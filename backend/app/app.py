from location import LocationDatabase
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)



@app.route("/", methods=["GET"])
def index():
    #return jsonify(result)
    return "test"

@app.route("/location/<group>/<name>")
def get_location(group, name):
    try:
        result = LocationDatabase.get_location(LocationDatabase.Group[group], name)
        if result is None:
            return jsonify({"error": "Localización no existente o no encontrada"}), 404
        return jsonify(result)
    except KeyError:
        return jsonify({"error": "Grupo inválido"}), 400
    except Exception as e:
        print(f"Error en /location: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/groups", methods=["GET"])
def get_groups():
    groups = LocationDatabase.Group 
    print(groups)
    for group in groups:
        print({"key": group.name, "label": group.value})
    return jsonify([
        {"key": group.name, "label": group.value}
        for group in groups
    ])

@app.route("/create", methods=["POST"])
def create_location():
    try:
        data = request.get_json()
        print(data)
        result = LocationDatabase.create_location(
            LocationDatabase.Group[data["group"]],
            data["name"],
            data["longitude"],
            data["latitude"]
        )
        return jsonify({"message": result if result else "No se pudo crear la localización."})
    except KeyError as ke:
        return jsonify({"message": f"Grupo inválido: {ke}"}), 400
    except Exception as e:
        print(f"Error al tratar de crear localización: {e}")
        return jsonify({"message": str(e)}), 500

# @app.route("/nearby", methods=["GET"])
# def nearby_radius():
#     data = request.get_json()
#     result = LocationDatabase.nearby_locations(
#         LocationDatabase.Group[data["group"]],
#         data["member"],
#         data["radius"],
#         data["unit"]
#     )
#     return jsonify({"message": result})

# @app.route("/nearby_alt", methods=["GET"])
# def nearby_radius_alt():
#     data = request.get_json()
#     result = LocationDatabase.nearby_locations_long_lat(
#         LocationDatabase.Group[data["group"]],
#         data["longitude"],
#         data["latitude"],
#         data["radius"],
#         data["unit"]
#     )
#     return jsonify({"message": result})

@app.route("/nearby", methods=["GET"])
def nearby_radius():
    try:
        group = request.args.get('group')
        member = request.args.get('member')
        radius = float(request.args.get('radius'))
        unit = request.args.get('unit')

        # Validar si todos los parámetros necesarios están presentes
        if not group or not member or not radius or not unit:
            return jsonify({"error": "Faltan parámetros de búsqueda"}), 400

        # Llamar al método que busca por miembro
        result = LocationDatabase.nearby_locations(
            LocationDatabase.Group[group],
            member,
            radius,
            unit
        )
        return jsonify({"message": result})
    except Exception as e:
        print(f"Error en /nearby: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/nearby_alt", methods=["GET"])
def nearby_radius_alt():
    try:
        group = request.args.get('group')
        longitude = float(request.args.get('longitude'))
        latitude = float(request.args.get('latitude'))
        radius = float(request.args.get('radius'))
        unit = request.args.get('unit')

        # Validar si todos los parámetros necesarios están presentes
        if not group or not longitude or not latitude or not radius or not unit:
            return jsonify({"error": "Faltan parámetros de búsqueda"}), 400

        # Llamar al método que busca por coordenadas
        result = LocationDatabase.nearby_locations_long_lat(
            LocationDatabase.Group[group],
            longitude,
            latitude,
            radius,
            unit
        )
        return jsonify({"message": result})
    except Exception as e:
        print(f"Error en /nearby_alt: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/delete", methods=["DELETE"])
def delete_location():
    data = request.get_json()
    result = LocationDatabase.delete_location(
        LocationDatabase.Group[data["group"]],
        data["name"]
    )
    return jsonify({"message": result})

@app.route("/update", methods=["PUT"])
def update_location():
    data = request.get_json()
    result = LocationDatabase.update_location(
        LocationDatabase.Group[data["group"]],
        data["name"],
        data["longitude"],
        data["latitude"]
    )
    return jsonify({"message": result})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
    #print(LocationDatabase.get_location((Status.CERVECEROS), "FCyT"))

# group = Status.CERVECERIAS

# print(LocationDatabase.nearby_locations("cerveceros", "FCyT", 1))
# print(LocationDatabase.nearby_locations_long_lat("cerveceros", -32.4789, -58.2334, 1))


# try:
#     print((Status.CERVECERIAS).value)
#     print(type((Status.CERVECERIAS)))
#     print(Status.CERVECERIAS)
#     print(group.name)
#     print((isinstance(Status.CERVECERIAS.name, Status)))
#     print((isinstance(group, Status)))
# except AttributeError as error:
#     print(f"Error: {error}")