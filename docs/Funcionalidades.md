# MVP — APPBUS
Documento de alcance funcional del sistema. Se definira el alzance que se quiere llegar y las funionalidades que tiene cada uno

---

# 1. Descripción general

El sistema APPBUS tiene como objetivo proporcionar una plataforma base para la gestión y monitorización del transporte urbano, permitiendo a las empresas configurar su red de transporte y a los usuarios consultar información en tiempo real sobre los autobuses.

# 2. Roles del sistema

El sistema contempla tres tipos de usuarios:
- Empresa (administración)
- Conductor
- Cliente 

# 3. Funcionalidades del MVP
## 3.1. Empresa
**Gestión de red de transporte**
- Crear, editar y eliminar 
    - Lineas de autobuses
    - Paradas de autobuses
- Crear y gestionar las rutas
- Asignar paradas a rutas en un orden determinado
- Definir horarios básicos de cada línea
**Gestión de conductores**
- Registrar conductores en el sistema
- Consultar listado de conductores
**Gestión de incidencias**
- Consultar incidencias activas
- Marcar incidencias como resueltas

## 3.2. Conductor
**Autenticación**
- Iniciar sesión en la aplicación
**Operativa de servicio**
- Seleccionar el autobús y la línea asignada
- Iniciar servicio
**Seguimiento en tiempo real**
- Enviar la ubicación GPS del vehículo de forma periódica
**Reporte de incidencias**
- El conductor podrá reportar:
    - Avería del autobús
    - Incidencia con pasajeros
    - Emergencia médica
    - Otras incidencias mediante texto libre

## 3.3 Cliente no registrado
- Consultar líneas disponibles
- Visualizar paradas en el mapa
- Consultar horarios orientativos
- Consultar tiempo aproximado de llegada basado en horario
- Visualizar paradas cercanas mediante geolocalización
## 3.4 Cliente registrado
- Incluye todas las funcionalidades del cliente no registrado, además de:
    - Visualizar la ubicación del autobús en tiempo real
    - Consultar tiempo estimado de llegada basado en la posición del vehículo
    - Recibir avisos de incidencias
    - Guardar líneas o paradas como favoritas

# 4. Funcionalidades fuera del MVP
Las siguientes funcionalidades quedan fuera del alcance de esta primera versión:
    - Gestión de fichajes de conductores
    - Asignación automática de autobuses de sustitución
    - Notificaciones avanzadas basadas en proximidad del autobús
    - Sistema de pago o recarga de abonos
    - Historial de viajes del usuario
    - Sistema de valoraciones o reseñas
    - Panel avanzado de estadísticas para la empresa

# 5. Criterios de validación del MVP
El sistema se considerará válido si se cumplen las siguientes condiciones
    - La empresa puede configurar líneas, paradas, rutas y horarios
    - Un conductor puede iniciar servicio y enviar su ubicación
    - Un usuario puede visualizar el autobús en tiempo real
    - El sistema permite registrar y consultar incidencias
    - Existe coherencia entre los datos mostrados (líneas, paradas y rutas)

# 6. Prueba piloto
El sistema será validado mediante una prueba piloto utilizando como caso de estudio los autobuses urbanos de Talavera de la Reina.

*Primera toma de contacto, ir mejorando*