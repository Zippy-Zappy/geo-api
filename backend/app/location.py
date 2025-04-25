import redis
from enum import Enum

class LocationDatabase:
    _instance = None
    #GEO_KEY = "locations"  # Redis key where all geo data is stored

    class Group(Enum):
        CERVECERIAS = "Cervecerías Artesanales"
        UNIVERSIDADES = "Universidades"
        FARMACIAS = "Farmacias"
        EMERGENCIAS = "Centro de Atención de Emergencias"
        SUPERMERCADOS = "Supermercados"

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = redis.StrictRedis(
                host="redis", #this changes from localhost to "redis" once app is dockerized as Docker gives each service a hostname equal to its service name, and
                port=6379,    #if it doesn't change, it would be looking for Redis inside itself, rather than on the redis container
                db=3,
                decode_responses=True
            )
        return cls._instance

    @classmethod
    def create_location(cls, group: Group, name: str, longitude: float, latitude: float) -> str:
        '''Add a new object to the Redis GEO set.'''
        try:
            client = cls.get_instance()
            added = client.geoadd(group.name, (longitude, latitude, name))
            return bool(added)
        except redis.RedisError as error:
            return f"Error trying to create object: {error}"

    @classmethod
    def get_location(cls, group: Group, name: str):
        '''Fetch the location of a specific object by name.'''
        try:
            client = cls.get_instance()
            pos = client.geopos(group.name, name)
            #pos = client.geopos("cerveceros", name)
            #print(pos)
            if not pos or pos[0] is None:
                return None
            return {"name": name, "longitude": pos[0][0], "latitude": pos[0][1]}
        except redis.RedisError as error:
            return f"Error trying to fetch object: {error}"
   

    @classmethod
    def update_location(cls, group: Group, name: str, longitude: float, latitude: float) -> str:
        '''
        Update the location of an object (just re-adds it).

        This is because GEO Redis already checks if a location
        exists.

        :param location: the name of the place.
        :type location: str
        :param longitude: longitude value of the place.
        :type longitude: float
        :param latitude: latitude value of the place.
        :type latitude: float
        '''
        return cls.create_location(group, name, longitude, latitude)

    @classmethod
    def delete_location(cls, group: Group, name: str) -> str:
        '''Delete a location from the GEO set.'''
        try:
            client = cls.get_instance()
            removed = client.zrem(group.name, name)
            if removed == 0:
                return f"No such object."
            return f"Object {name} successfully removed."
        except redis.RedisError as error:
            return f"Error trying to delete object: {error}"

    @classmethod
    def nearby_locations(cls, group: Group, member: str, radius: float, unit: str = 'km'):
        '''Find nearby locations within a given radius.
        
        Uses an already existing member as starting point.
        '''
        client = cls.get_instance()
        results = client.geosearch(
            name=group.name, 
            member=member, 
            radius=radius, 
            unit=unit, 
            withdist=True)
        #results = client.georadius(group.name, longitude, latitude, radius, unit=unit, withdist=True)
        return [{"name": name, "distance": dist} for name, dist in results]
    
    @classmethod
    def nearby_locations_long_lat(cls, group: Group, longitude: float, latitude: float, radius: float, unit: str = 'km'):
        '''
        Find bearby locations within a given radius.

        Uses longitud and latitude as starting point.
        '''
        try:
            client = cls.get_instance()
            results = client.georadius(
                name=group.name,
                longitude=longitude,
                latitude=latitude,
                radius=radius,
                unit=unit,
                withdist=True
            )
            #return [{"name": name, "distance": dist * 1000 if dist < 1 else dist} for name, dist in results]
            return [{"name": name, "distance": dist} for name, dist in results]
        except redis.RedisError as error:
            return f"Error trying to search locations: {error}"
