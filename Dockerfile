# Usamos una imagen ligera de Node.js 20
FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos las dependencias (incluyendo las de desarrollo para tener sequelize-cli)
RUN npm install

# Copiamos el resto del código de la aplicación
COPY . .

# Le damos permisos de ejecución a nuestro script orquestador
RUN chmod +x start.sh

# Exponemos el puerto definido (por defecto 3000)
EXPOSE 3000

# Usamos el script como punto de entrada
CMD ["./start.sh"]