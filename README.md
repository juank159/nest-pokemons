<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio.
2. Ejecutar.

```
npm install
```

3. Tener Nest CLI instalado.

```
npm i -g @nest/cli
```

4. levantar la base de datos.

```
docker-compose up -d
```

5. Clonar el archivo `.env.template` y renombrar la copia a `.env`

6. Llenar las variables de entorno definidas en el archivo `.env`

7. Ejecutar la aplicacion en dev.

```
npm run dev start:dev
```

8. Reconstruir la base de datos.

```
http://localhost:3000/api/v2/seed
```

## Stack usado

- MongoDB
- Nest

## Production Build

1. Crear el archivo `.env.prod`
2. llenar las variables de entorno para `.env.prod`
3. crear las imagenes

```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```
