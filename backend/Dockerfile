FROM python:3.12.3
# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de backend
COPY backend/requirements.txt .

# Instala dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copia el código fuente de la app
COPY backend/app /app/app

# Expone el puerto de Flask
EXPOSE 5000

# Ejecuta el servidor Flask
CMD ["python", "app/app.py"]