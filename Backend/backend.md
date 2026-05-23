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


En ese repo, el hash de la contraseña no se hace en la ruta de login, sino en el modelo User, en un middleware pre("save"). Y la comprobación se hace con comparePassword. Después, en /users/signin, si la contraseña coincide, se llama a jwt.sign(...) y devuelve el token

routes → define la URL
controller → recibe la petición
service → lógica de login
repository → consulta SQL



Sistema de Autenticación con JWT – Resumen Técnico

Para garantizar el acceso seguro al backend se ha implementado un sistema de autenticación basado en email, contraseña y JSON Web Token (JWT). Este mecanismo permite identificar usuarios y proteger rutas privadas sin necesidad de mantener sesiones en el servidor.

1. Proceso de Login

El usuario (empresa, conductor o usuario final) introduce:

email
contraseña

El frontend envía una petición al backend:

POST /api/auth/login

con un body similar a:

{
  "email": "usuario@test.com",
  "password": "123456"
}
2. Validación de Credenciales

Cuando el backend recibe la petición:

2.1 Verifica campos obligatorios

Se comprueba que:

exista email
exista contraseña

Si faltan datos:

{
  "ok": false,
  "message": "Email y contraseña son obligatorios"
}
2.2 Búsqueda del usuario en base de datos

Se realiza una consulta SQL sobre la tabla correspondiente (usuario, empresa o conductor) utilizando el email recibido.

Ejemplo:

SELECT id_usuario, nombre, email, password_hash
FROM usuario
WHERE email = $1
LIMIT 1;
2.3 Verificación de contraseña

Las contraseñas no se almacenan en texto plano.
En la base de datos se guarda un hash bcrypt.

El backend compara:

contraseña enviada por el usuario
hash almacenado en BD

Mediante:

bcrypt.compare(password, password_hash)

Si no coincide:

{
  "ok": false,
  "message": "Credenciales inválidas"
}
3. Generación del Token JWT

Si el email existe y la contraseña es correcta, el backend genera un token JWT.

Ejemplo:

jwt.sign(
  {
    id: usuario.id_usuario,
    role: "usuario"
  },
  JWT_SECRET,
  { expiresIn: "7d" }
)

El token contiene información mínima:

identificador del usuario
rol del usuario
fecha de emisión
fecha de expiración
4. Respuesta del Login

Si todo es correcto, el backend responde:

{
  "ok": true,
  "message": "Login correcto",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "nombre": "Roberto",
    "email": "usuario@test.com",
    "role": "usuario"
  }
}
5. Uso del Token

Una vez autenticado, el frontend guarda el token y lo envía en futuras peticiones protegidas mediante cabecera HTTP:

Authorization: Bearer TOKEN
6. Middleware de Autenticación JWT

Para proteger rutas privadas se implementa un middleware que:

Lee el token recibido
Verifica su firma
Comprueba expiración
Extrae los datos del usuario

Ejemplo:

req.user = decodedToken;

Si el token no existe o es inválido:

{
  "ok": false,
  "message": "Token inválido o expirado"
}
7. Rutas Protegidas

Gracias al middleware JWT, ciertas rutas solo pueden ser utilizadas por usuarios autenticados.

Ejemplo:

GET /api/auth/me

Respuesta:

{
  "ok": true,
  "user": {
    "id": "...",
    "role": "usuario"
  }
}
8. Ventajas del sistema JWT
Seguridad
No se almacena contraseña en texto plano
Token firmado digitalmente
Expiración automática
Escalabilidad
No requiere sesiones en servidor
Fácil integración con móvil y web
Flexibilidad

Permite controlar permisos según rol:

empresa
conductor
usuario
9. Aplicación en el proyecto

Este sistema permite que:

Usuario final
consulte favoritos
acceda a información personalizada
Empresa
gestione líneas
cree conductores
supervise incidencias
Conductor
inicie servicio
envíe posición GPS
reporte incidencias
10. Conclusión

La autenticación mediante JWT proporciona una solución moderna, segura y escalable para el backend del sistema de transporte urbano, permitiendo proteger recursos sensibles y diferenciar funcionalidades según el tipo de usuario autenticado.


----
middlewares -> Sirve para guardar funciones reutilizables de control transversal.

La carpeta middlewares centraliza funciones intermedias reutilizables ejecutadas antes del controlador principal. Permite separar responsabilidades como autenticación, autorización y validación, evitando duplicación de código y mejorando la mantenibilidad del backend.


------------------
Base de la API
Tecnología¿Correcta?Por quéNode.js + Express✅Estándar para APIs REST, ligero y con gran ecosistemaPostgreSQL✅Base de datos relacional robusta, ideal para datos estructurados como usuarios y empresaspg (node-postgres)✅Driver oficial para conectar Node.js con PostgreSQLdotenv✅Mantiene credenciales fuera del código, nunca hardcodeadas

Seguridad
Tecnología¿Correcta?Por québcrypt✅Hashea contraseñas con salt automático, estándar del sectorjsonwebtoken✅Autenticación stateless mediante JWT, no requiere sesiones en servidorhelmet✅Añade ~15 headers de seguridad HTTP contra XSS, clickjacking, sniffingcors✅Controla qué dominios pueden consumir tu APIexpress-rate-limit✅Protege los endpoints de login contra ataques de fuerza brutaZod✅Valida y sanitiza los datos de entrada antes de que lleguen al controller



----
ZOD
Esto deja pasar cosas como:

Un email con formato inválido → "noesuncorreo"
Una contraseña de 1 carácter → "a"
Un nombre con números → "M4r14"
Campos con solo espacios → "   "

Zod te permite definir exactamente qué forma deben tener los datos.

-----
Helmet
Añade headers de seguridad HTTP automáticamente. Protege contra ataques comunes como XSS, clickjacking, sniffing de contenido, etc. Es una sola línea pero por debajo configura ~15 headers de seguridad.

-------

CORS
Controla qué dominios pueden hacer peticiones a tu API. Sin esto, cualquier web puede llamar a tu backend desde el navegador.



Empresa crea conductor
       ↓
Sistema genera token_activacion (crypto)
       ↓
Nodemailer envía email via Gmail SMTP
       ↓
Conductor recibe enlace con el token
       ↓
Conductor POST /api/conductores/activar con token + nueva contraseña
       ↓
Sistema guarda password_hash y marca cuenta_activada = true