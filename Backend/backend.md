npm install pg dotenv bcryptjs jsonwebtoken cors
pg -> Es el driver oficial para conectar Node.js con PostgreSQL. Sin él, tu backend no puede hablar con tu base de datos appbus.
dotenv -> Tu base de datos tiene usuario y contraseña. No puedes escribirlos directamente en el código porque ese código va a GitHub y cualquiera podría verlo. dotenv carga esas variables desde el archivo .env que nunca se sube a GitHub.
bcryptjs -> En tu base.sql tienes password_hash en todas las tablas. Eso significa que nunca guardas la contraseña real, sino una versión cifrada. bcryptjs es quien hace ese cifrado.
jsonwebtoken -> Tu sistema tiene tres roles: empresa, conductor y usuario. Cuando alguien inicia sesión necesitas una forma de identificarle en las siguientes peticiones sin pedirle el usuario y contraseña cada vez. JWT genera un token que el usuario guarda y envía en cada petición.
cors -> Tu backend corre en localhost:3000. Tus apps móviles van a hacer peticiones desde otro origen. Sin cors, el navegador o la app bloquearía esas peticiones por seguridad. cors le dice al servidor que acepte peticiones de otros orígenes.
---
npm install nodemon --save-dev
nodemon -> Como indican tus apuntes, en desarrollo quieres que el servidor se reinicie automáticamente cada vez que guardas un archivo. nodemon hace eso. En producción no se usa porque el servidor no debe reiniciarse solo.
Por eso se instala con --save-dev, que significa que solo es para desarrollo y no se incluye en producción.



3. Para qué sirve cada una
dotenv → variables de entorno
pg → conexión a PostgreSQL
bcrypt → hash de contraseñas
jsonwebtoken → JWT para login
cors → permitir peticiones del frontend
helmet → cabeceras de seguridad
morgan → logs HTTP
zod → validación de datos
socket.io → tiempo real para GPS/incidencias
nodemon → reinicio automático en desarrollo

## ¿Porque quietar Pug?
Pug es un motor de plantillas para generar HTML en el servidor.

Se usa para hacer cosas como:

páginas web renderizadas desde backend
SSR (Server Side Rendering)

## MI sistema es:

backend API (Node + Express)
frontend separado (React Native)

## ¿por qué sobra Pug?
Porque:

❌ No vas a renderizar vistas
❌ No tienes frontend web en el servidor
❌ Solo trabajas con JSON
❌ Añade dependencias innecesarias (y vulnerabilidades)