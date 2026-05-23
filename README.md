
# APPBUS 🚍

## 📌 Descripción

APPBUS es una plataforma para la gestión y monitorización del transporte urbano en tiempo real.

El sistema va dirigido a las empresas que puedar añadir los datos con respecto al transporte publido y puedan gestionar su red de transporte (lineas, paradas, trayectos y horarios), los usuarios pueden consultar dicha informacion en tiempo real, pudiendo tener de forma exacta los timepo de llegada, la ubicacion del autobus e incidencias del servicio.

---

## 🎯 Objetivo

El objetivo del proyecto es mejorar la experiencia del usuario en el transporte público proporcionando:

* Información en tiempo real de los autobuses
* Estimaciones precisas de llegada
* Notificación de incidencias y cambios de ruta
* Consulta de líneas y paradas cercanas y sus horarios 
* Guardar lines y paradas favoritas

---

## 👥 Actores del sistema

### Empresa

* Gestión de líneas, trayectos y paradas
* Gestión de conductores y autobuses
* Supervisión del servicio
* Gestión de incidencias y avisos

### Conductor

* Inicio de sesión
* Selección de bus y trayecto
* Envío de ubicación GPS en tiempo real (a traves del telefono de empresa)
* Reporte de incidencias

### Usuario

* Consulta de líneas y paradas
* Visualización de autobuses en tiempo real
* Consulta de horarios
* Gestión de favoritos
* Visualización de avisos de servicio

---

## ⚙️ Tecnologías utilizadas

* **Backend:** Node.js + Express
* **Base de datos:** PostgreSQL + PostGIS
* **Frontend:** React Native
* **Tiempo real:** Socket.IO
* **Control de versiones:** Git + GitHub

---

## 🗄️ Base de datos

El sistema utiliza una base de datos relacional con soporte geoespacial.

Principales entidades:

* asignar_servicio
* aviso_servicio
* bus
* conductor
* empresa 
* favorito
* horario
* incidencia
* parada
* posicion_bus
* registro_fichaje
* trayecto
* trayecto_parada
* usuario

---

## 📂 Estructura del proyecto

```
/AppBus
 ├── /appDriver
 ├── /appUser
 ├── /webCompany
 ├── /backend
 ├── /database
 │    ├── base.sql
 │    ├── datos.sql
 │    ├── BaseDatos.html
 │    └── BBDD.md
 ├── /docs
 │    └── Funcionalidades.md
 ├── /test
 └── README.md
```

---

## Tecnologías del proyecto APPBUS

### Backend
**Tecnologías utilizadas**
* Node.js
* Express

El servidor sera el encargado de:

- lógica de negocio
- API REST
- conexión con la base de datos

### Base de datos: 
* PostgreSQL 
* PostGIS

- Almacenara los datos en el sistema
- Ayudara en la gestion de las ubicaciones geograficas
- Calcular las distancias (paradas cercanas, etc.)

### Frontend (aplicación móvil)
* React Native 
	- para la app moviles del conductor y el usuario)
	- multiplataforma (Android/iOS)
* React 
	- para la pagina web donde las empresas podran añadir los datos y hacer un control de las incidencias)

### Comunicación en tiempo real
* Socket.IO

- enviar ubicación del bus en directo
- actualizar mapa en tiempo real

### Mapas
Google Maps API
* Open Street Map

- Se utilizará OpenStreetMap como proveedor de mapas, al tratarse de una solución open source que permite su uso sin coste y con gran flexibilidad.
- mostrar autobuses y paradas
- calcular rutas

### Autenticación
JSON Web Token (JWT)

- login de usuarios
- login de conductores

### seguridad en la API
- Control de versiones
* Git
* GitHub
* GitBash

- gestionar versiones
- trabajar con ramas
- usar issues y pull requests

---

## 🚀 Estado del proyecto

Actualmente el proyecto se encuentra en fase inicial:

* ✔ Diseño del modelo de datos completado
* ✔ Base de datos implementada en PostgreSQL
* 🔄 Desarrollo del backend en progreso
* ⏳ Desarrollo del frontend pendiente

---

## 🔄 Flujo principal del sistema

Empresa configura la red →
Conductor inicia servicio y envía GPS →
Backend procesa la información →
Usuario visualiza el autobús en tiempo real

---

## 📍 Prueba piloto

El sistema se probará en un entorno controlado con los autobuses urbanos de **Talavera de la Reina**.

---

## 📌 Notas

Este proyecto forma parte de un Trabajo de Fin de Grado (TFG) y se encuentra en desarrollo activo.

