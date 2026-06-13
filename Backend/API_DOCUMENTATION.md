# AppBus — Documentación de la API REST

Base URL: `http://localhost:3000/api`

Todos los endpoints protegidos requieren el header:
```
Authorization: Bearer <token>
```

---

## Índice

- [Auth](#auth)
- [Client](#client)
- [Driver](#driver)
- [Bus](#bus)
- [Line](#line)
- [Route](#route)
- [Stop](#stop)
- [Position](#position)
- [Service](#service)
- [Incident](#incident)
- [Alert](#alert)
- [Timetable](#timetable)
- [Favorite](#favorite)

---

## Auth

### POST `/auth/client/login`
Login de cliente.

**Rol requerido:** Público

**Body:**
```json
{
  "email": "cliente@gmail.com",
  "password": "123456"
}
```

**Respuesta 200:**
```json
{
  "ok": true,
  "message": "Login correcto",
  "token": "eyJ...",
  "user": {
    "id": "uuid",
    "full_name": "Juan",
    "first_surname": "García",
    "second_surname": "López",
    "email": "cliente@gmail.com",
    "role": "Client"
  }
}
```

**Errores:** `401 INVALID_CREDENTIALS` · `429 TOO_MANY_REQUESTS`

---

### POST `/auth/company/login`
Login de empresa.

**Rol requerido:** Público

**Body:**
```json
{
  "email": "empresa@gmail.com",
  "password": "123456"
}
```

**Respuesta 200:**
```json
{
  "ok": true,
  "token": "eyJ...",
  "user": {
    "id": "uuid",
    "name_company": "AppBus S.L.",
    "email": "empresa@gmail.com",
    "role": "Company"
  }
}
```

**Errores:** `401 INVALID_CREDENTIALS` · `429 TOO_MANY_REQUESTS`

---

### POST `/auth/driver/login`
Login de conductor.

**Rol requerido:** Público

**Body:**
```json
{
  "email": "conductor@appbus.com",
  "password": "123456"
}
```

**Respuesta 200:**
```json
{
  "ok": true,
  "token": "eyJ...",
  "user": {
    "id": "uuid",
    "full_name": "Pedro",
    "employee_number": "AB-00001",
    "role": "Driver"
  }
}
```

**Errores:** `401 INVALID_CREDENTIALS` · `403 ACCOUNT_NOT_ACTIVATED` · `403 ACCOUNT_DISABLED`

---

### GET `/auth/me`
Devuelve los datos del usuario autenticado a partir del token JWT.

**Rol requerido:** Cualquier rol autenticado

**Respuesta 200:**
```json
{
  "ok": true,
  "user": {
    "id": "uuid",
    "role": "Client"
  }
}
```

---

### POST `/auth/client/register`
Registro de nuevo cliente.

**Rol requerido:** Público

**Body:**
```json
{
  "name": "Juan",
  "first_surname": "García",
  "second_surname": "López",
  "email": "cliente@gmail.com",
  "password": "123456"
}
```

**Respuesta 201:**
```json
{
  "ok": true,
  "message": "Cliente creado correctamente",
  "client": {
    "id_client": "uuid",
    "full_name": "Juan",
    "email": "cliente@gmail.com"
  }
}
```

**Errores:** `409 EMAIL_ALREADY_EXISTS`

---

### POST `/auth/company/register`
Registro de nueva empresa.

**Rol requerido:** Público

**Body:**
```json
{
  "name": "AppBus S.L.",
  "email": "empresa@gmail.com",
  "password": "123456"
}
```

**Respuesta 201:**
```json
{
  "ok": true,
  "message": "Empresa creada correctamente",
  "company": {
    "id_company": "uuid",
    "name_company": "AppBus S.L.",
    "email": "empresa@gmail.com"
  }
}
```

**Errores:** `409 EMAIL_ALREADY_EXISTS`

---

## Client

### GET `/client/profile`
Obtiene el perfil del cliente autenticado.

**Rol requerido:** `Client`

**Respuesta 200:**
```json
{
  "ok": true,
  "client": {
    "id_client": "uuid",
    "full_name": "Juan",
    "first_surname": "García",
    "second_surname": "López",
    "email": "cliente@gmail.com",
    "avatar_url": "https://example.com/avatar1.png",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### PUT `/client/profile`
Actualiza los datos personales del cliente.

**Rol requerido:** `Client`

**Body (todos opcionales, mínimo uno):**
```json
{
  "full_name": "Juan",
  "first_surname": "García",
  "second_surname": "López",
  "email": "nuevo@gmail.com",
  "avatar_url": "https://example.com/avatar2.png"
}
```

**Respuesta 200:**
```json
{
  "ok": true,
  "message": "Perfil actualizado correctamente",
  "client": { "..." }
}
```

**Errores:** `409 EMAIL_ALREADY_EXISTS` · `404 CLIENT_NOT_FOUND`

---

### PATCH `/client/password`
Cambia la contraseña del cliente.

**Rol requerido:** `Client`

**Body:**
```json
{
  "current_password": "123456",
  "new_password": "nuevapass"
}
```

**Respuesta 200:**
```json
{
  "ok": true,
  "message": "Contraseña actualizada correctamente"
}
```

**Errores:** `401 INVALID_CREDENTIALS` · `404 CLIENT_NOT_FOUND`

---

## Driver

### GET `/drivers`
Lista todos los conductores de la empresa.

**Rol requerido:** `Company`

**Respuesta 200:**
```json
{
  "ok": true,
  "driver": [
    {
      "id_driver": "uuid",
      "full_name": "Pedro",
      "first_surname": "Martínez",
      "company_email": "pedro.martinez@appbus.com",
      "employee_number": "AB-00001",
      "is_account_activated": true,
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### GET `/drivers/pending`
Lista conductores con cuenta sin activar.

**Rol requerido:** `Company`

**Respuesta 200:**
```json
{
  "ok": true,
  "driver": [{ "..." }]
}
```

---

### GET `/drivers/:id_driver`
Obtiene un conductor por ID.

**Rol requerido:** `Company`

**Respuesta 200:**
```json
{
  "ok": true,
  "driver": { "..." }
}
```

**Errores:** `404 DRIVER_NOT_FOUND`

---

### POST `/drivers`
Crea un nuevo conductor y envía email de activación.

**Rol requerido:** `Company`

**Body:**
```json
{
  "name": "Pedro",
  "first_surname": "Martínez",
  "second_surname": "López",
  "dni": "12345678A",
  "phone_number": "600000000",
  "personal_email": "pedro@gmail.com"
}
```

**Respuesta 201:**
```json
{
  "ok": true,
  "message": "Conductor creado correctamente",
  "driver": { "..." }
}
```

**Errores:** `409 EMAIL_ALREADY_EXISTS` · `404 COMPANY_NOT_FOUND`

---

### POST `/drivers/activate`
Activa la cuenta del conductor con el token recibido por email.

**Rol requerido:** Público

**Body:**
```json
{
  "token": "abc123...",
  "password": "nuevapass"
}
```

**Respuesta 200:**
```json
{
  "ok": true,
  "message": "Cuenta activada correctamente",
  "driver": { "..." }
}
```

**Errores:** `400 INVALID_TOKEN` · `409 ALREADY_ACTIVATED`

---

### PUT `/drivers/:id_driver`
Actualiza datos de un conductor.

**Rol requerido:** `Company`

**Body (todos opcionales, mínimo uno):**
```json
{
  "full_name": "Pedro",
  "first_surname": "Martínez",
  "phone_number": "600000001",
  "is_active": false
}
```

**Respuesta 200:**
```json
{
  "ok": true,
  "message": "Conductor actualizado correctamente",
  "driver": { "..." }
}
```

**Errores:** `404 DRIVER_NOT_FOUND`

---

### DELETE `/drivers/:id_driver`
Elimina un conductor.

**Rol requerido:** `Company`

**Respuesta 200:**
```json
{
  "ok": true,
  "message": "Conductor eliminado correctamente"
}
```

**Errores:** `404 DRIVER_NOT_FOUND`

---

## Bus

### GET `/buses`
Lista todos los buses de la empresa.

**Rol requerido:** `Company`

**Respuesta 200:**
```json
{
  "ok": true,
  "buses": [
    {
      "id_bus": "uuid",
      "license_plate": "1234ABC",
      "statu": "operational",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### GET `/buses/active`
Lista buses circulando en tiempo real con su última ubicación GPS.

**Rol requerido:** `Client`

**Respuesta 200:**
```json
{
  "ok": true,
  "buses": [
    {
      "id_bus": "uuid",
      "license_plate": "1234ABC",
      "line_code": "001A",
      "name_line": "Línea 1",
      "color": "#FF0000",
      "latitude": 39.123,
      "longitude": -4.456,
      "last_update": "2024-01-01T10:00:00Z"
    }
  ]
}
```

---

### GET `/buses/active/company`
Lista buses activos con detalle completo incluyendo datos del conductor.

**Rol requerido:** `Company`

**Respuesta 200:**
```json
{
  "ok": true,
  "buses": [
    {
      "id_bus": "uuid",
      "license_plate": "1234ABC",
      "line_code": "001A",
      "name_line": "Línea 1",
      "driver_name": "Pedro",
      "driver_surname": "Martínez",
      "employee_number": "AB-00001",
      "latitude": 39.123,
      "longitude": -4.456
    }
  ]
}
```

---

### GET `/buses/:id_bus`
Obtiene un bus por ID.

**Rol requerido:** `Company`

**Errores:** `404 BUS_NOT_FOUND`

---

### POST `/buses`
Crea un nuevo bus.

**Rol requerido:** `Company`

**Body:**
```json
{
  "license_plate": "1234ABC"
}
```

**Respuesta 201:**
```json
{
  "ok": true,
  "message": "Bus creado correctamente",
  "bus": { "..." }
}
```

**Errores:** `409 LICENSE_ALREADY_EXISTS`

---

### PUT `/buses/:id_bus`
Actualiza un bus. El campo `statu` sigue las transiciones:
`operational → maintenance → out_of_service`

**Rol requerido:** `Company`

**Body (todos opcionales, mínimo uno):**
```json
{
  "license_plate": "5678DEF",
  "statu": "maintenance"
}
```

**Errores:** `404 BUS_NOT_FOUND` · `400 INVALID_STATE_TRANSITION`

---

### DELETE `/buses/:id_bus`
Elimina un bus.

**Rol requerido:** `Company`

**Errores:** `404 BUS_NOT_FOUND`

---

## Line

### GET `/lines`
Lista todas las líneas disponibles.

**Rol requerido:** Público

**Respuesta 200:**
```json
{
  "ok": true,
  "lines": [
    {
      "id_line": "uuid",
      "name_line": "Línea 1",
      "color": "#FF0000",
      "code": "001A",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### GET `/lines/:code`
Obtiene una línea por su código.

**Rol requerido:** Público

**Errores:** `404 LINE_NOT_FOUND`

---

### POST `/lines`
Crea una nueva línea.

**Rol requerido:** `Company`

**Body:**
```json
{
  "name_line": "Línea 1",
  "color": "#FF0000"
}
```

**Respuesta 201:**
```json
{
  "ok": true,
  "message": "Línea creada correctamente",
  "line": { "..." }
}
```

---

### PUT `/lines/:code`
Actualiza una línea.

**Rol requerido:** `Company`

**Body (todos opcionales, mínimo uno):**
```json
{
  "name_line": "Línea 2",
  "color": "#0000FF"
}
```

**Errores:** `404 LINE_NOT_FOUND`

---

### DELETE `/lines/:code`
Elimina una línea.

**Rol requerido:** `Company`

**Errores:** `404 LINE_NOT_FOUND`

---

## Route

### GET `/lines/:code/routes`
Lista todos los trayectos de una línea.

**Rol requerido:** Público

**Respuesta 200:**
```json
{
  "ok": true,
  "route": [
    {
      "id_route": "uuid",
      "origin": "Norte",
      "destination": "Sur",
      "estimated_duration": 30,
      "direction": "ida",
      "is_active": true
    }
  ]
}
```

---

### GET `/lines/:code/routes/:id_route`
Obtiene un trayecto por ID.

**Rol requerido:** Público

**Errores:** `404 ROUTE_NOT_FOUND` · `404 LINE_NOT_FOUND`

---

### POST `/lines/:code/routes`
Crea un nuevo trayecto en una línea.

**Rol requerido:** `Company`

**Body:**
```json
{
  "origin": "Norte",
  "destination": "Sur",
  "estimated_duration": 30,
  "is_active": true,
  "direction": "ida"
}
```

**Errores:** `404 LINE_NOT_FOUND`

---

### PUT `/lines/:code/routes/:id_route`
Actualiza un trayecto.

**Rol requerido:** `Company`

**Body (todos opcionales, mínimo uno):**
```json
{
  "origin": "Este",
  "estimated_duration": 25,
  "is_active": false
}
```

**Errores:** `404 ROUTE_NOT_FOUND`

---

### DELETE `/lines/:code/routes/:id_route`
Elimina un trayecto.

**Rol requerido:** `Company`

**Errores:** `404 ROUTE_NOT_FOUND`

---

## Stop

### GET `/stops`
Lista todas las paradas.

**Rol requerido:** Público

**Respuesta 200:**
```json
{
  "ok": true,
  "stops": [
    {
      "id_stop": "uuid",
      "name_stop": "Parada Central",
      "address_stop": "Calle Mayor 1",
      "latitude": 39.123,
      "longitude": -4.456
    }
  ]
}
```

---

### GET `/stops/nearby`
Busca paradas cercanas a una ubicación por radio.

**Rol requerido:** Público

**Query params:**

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `lat` | number | ✅ | Latitud |
| `lng` | number | ✅ | Longitud |
| `radius` | number | ❌ | Radio en metros (por defecto 1000, máximo 2000) |

**Ejemplo:** `GET /stops/nearby?lat=39.123&lng=-4.456&radius=500`

**Respuesta 200:**
```json
{
  "ok": true,
  "stops": [
    {
      "id_stop": "uuid",
      "name_stop": "Parada Central",
      "address_stop": "Calle Mayor 1",
      "latitude": 39.123,
      "longitude": -4.456,
      "distance_meters": 243.5
    }
  ]
}
```

**Errores:** `400 MISSING_COORDINATES` · `400 INVALID_COORDINATES`

---

### GET `/stops/route/:id_route`
Lista paradas de un trayecto.

**Rol requerido:** Público

---

### GET `/stops/:id_stop/arrival/:id_route`
Calcula el tiempo estimado de llegada del bus más cercano a una parada.

**Rol requerido:** Público

**Respuesta 200:**
```json
{
  "ok": true,
  "result": {
    "estimated_minutes": 5,
    "distance_km": 2.5,
    "bus_last_update": "2024-01-01T10:00:00Z"
  }
}
```

**Errores:** `404 STOP_NOT_FOUND`

---

### GET `/stops/:id_stop`
Obtiene una parada por ID.

**Rol requerido:** Público

**Errores:** `404 STOP_NOT_FOUND`

---

### POST `/stops`
Crea una nueva parada.

**Rol requerido:** `Company`

---

### PUT `/stops/:id_stop`
Actualiza una parada.

**Rol requerido:** `Company`

**Errores:** `404 STOP_NOT_FOUND`

---

### DELETE `/stops/:id_stop`
Elimina una parada.

**Rol requerido:** `Company`

**Errores:** `404 STOP_NOT_FOUND`

---

### POST `/stops/route/:id_route`
Añade una parada a un trayecto.

**Rol requerido:** `Company`

---

### DELETE `/stops/route/stop/:id_route_stop`
Elimina una parada de un trayecto.

**Rol requerido:** `Company`

---

## Position

### POST `/positions`
Guarda la posición GPS actual del bus.

**Rol requerido:** `Driver`

**Body:**
```json
{
  "bus_id": "uuid",
  "latitude": 39.123,
  "longitude": -4.456
}
```

**Respuesta 201:**
```json
{
  "ok": true,
  "position": {
    "id_position": "uuid",
    "bus_id": "uuid",
    "latitude": 39.123,
    "longitude": -4.456,
    "dates": "2024-01-01T10:00:00Z"
  }
}
```

---

### GET `/positions`
Lista la última posición de todos los buses de la empresa.

**Rol requerido:** `Company`

---

### GET `/positions/:id_bus`
Obtiene la última posición de un bus.

**Rol requerido:** `Company`

**Errores:** `404 POSITION_NOT_FOUND`

---

## Service

### GET `/services`
Lista todos los servicios de la empresa.

**Rol requerido:** `Company`

**Respuesta 200:**
```json
{
  "ok": true,
  "services": [
    {
      "id_service": "uuid",
      "driver_name": "Pedro",
      "employee_number": "AB-00001",
      "bus_license": "1234ABC",
      "shift": "morning",
      "service_date": "2024-01-01",
      "status": "scheduled"
    }
  ]
}
```

---

### GET `/services/:id_service`
Obtiene un servicio por ID.

**Rol requerido:** `Company`

**Errores:** `404 SERVICE_NOT_FOUND`

---

### GET `/services/driver/my_service`
Lista los servicios del conductor autenticado.

**Rol requerido:** `Driver`

**Query params:**

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `status` | string | ❌ | Filtrar por estado: `scheduled`, `in_progress`, `completed`, `cancelled` |

---

### POST `/services`
Asigna un servicio a un conductor.

**Rol requerido:** `Company`

**Body:**
```json
{
  "driver_id": "uuid",
  "bus_id": "uuid",
  "line_id": "uuid",
  "shift": "morning",
  "service_date": "2024-01-15"
}
```

**Errores:** `409 SERVICE_ALREADY_EXISTS` · `400 DRIVER_NOT_FOUND` · `400 BUS_NOT_FOUND` · `400 LINE_NOT_FOUND`

---

### PUT `/services/:id_service`
Actualiza un servicio. Transiciones de estado permitidas:
`scheduled → in_progress → completed`
`scheduled → cancelled` · `in_progress → cancelled`

**Rol requerido:** `Company`

**Errores:** `400 INVALID_STATE_TRANSITION` · `404 SERVICE_NOT_FOUND`

---

### PATCH `/services/:id_service/start`
El conductor inicia un servicio.

**Rol requerido:** `Driver`

**Respuesta 200:**
```json
{
  "ok": true,
  "message": "Servicio iniciado correctamente",
  "service": {
    "status": "in_progress",
    "started_at": "2024-01-01T08:00:00Z"
  }
}
```

**Errores:** `404 SERVICE_NOT_FOUND` · `400 INVALID_STATE_TRANSITION`

---

### PATCH `/services/:id_service/finish`
El conductor finaliza un servicio.

**Rol requerido:** `Driver`

**Respuesta 200:**
```json
{
  "ok": true,
  "message": "Servicio finalizado correctamente",
  "service": {
    "status": "completed",
    "finished_at": "2024-01-01T14:00:00Z"
  }
}
```

**Errores:** `404 SERVICE_NOT_FOUND` · `400 INVALID_STATE_TRANSITION`

---

### DELETE `/services/:id_service`
Elimina un servicio.

**Rol requerido:** `Company`

**Errores:** `404 SERVICE_NOT_FOUND`

---

## Incident

### GET `/incidents`
Lista todas las incidencias de la empresa.

**Rol requerido:** `Company`

**Respuesta 200:**
```json
{
  "ok": true,
  "incidents": [
    {
      "id_incident": "uuid",
      "incident_type": "breakdown",
      "descriptions": "Avería en motor",
      "status": "open",
      "driver_full_name": "Pedro",
      "bus_license_plate": "1234ABC",
      "created_at": "2024-01-01T10:00:00Z"
    }
  ]
}
```

---

### GET `/incidents/:id_incident`
Obtiene una incidencia por ID.

**Rol requerido:** `Company`

**Errores:** `404 INCIDENT_NOT_FOUND`

---

### POST `/incidents`
El conductor crea una incidencia durante un servicio activo.

**Rol requerido:** `Driver`

**Body:**
```json
{
  "bus_id": "uuid",
  "route_id": "uuid",
  "incident_type": "breakdown",
  "descriptions": "Avería en motor"
}
```

Tipos válidos: `breakdown` · `passenger` · `emergency` · `other`

**Errores:** `404 SERVICE_NOT_FOUND` · `400 SERVICE_NOT_ACTIVE`

---

### PUT `/incidents/:id_incident`
Actualiza el estado de una incidencia. Transiciones permitidas:
`open → in_progress → resolved`

**Rol requerido:** `Company`

**Body (todos opcionales, mínimo uno):**
```json
{
  "states": "in_progress",
  "descriptions": "En proceso de resolución"
}
```

**Errores:** `404 INCIDENT_NOT_FOUND` · `400 INVALID_STATE_TRANSITION`

---

### DELETE `/incidents/:id_incident`
Elimina una incidencia.

**Rol requerido:** `Company`

**Errores:** `404 INCIDENT_NOT_FOUND`

---

## Alert

### GET `/alerts`
Lista todas las alertas de la empresa.

**Rol requerido:** `Company`

**Respuesta 200:**
```json
{
  "ok": true,
  "alerts": [
    {
      "id_alert": "uuid",
      "alert_type": "roadworks",
      "title": "Obras en Calle Mayor",
      "descriptions": "Corte de carril",
      "starts_date": "2024-01-01T08:00:00Z",
      "end_date": "2024-01-15T20:00:00Z",
      "is_active": true,
      "origin": "Norte",
      "destination": "Sur"
    }
  ]
}
```

---

### GET `/alerts/:id_alert`
Obtiene una alerta por ID.

**Rol requerido:** `Company`

**Errores:** `404 ALERT_NOT_FOUND`

---

### POST `/alerts`
Crea una nueva alerta.

**Rol requerido:** `Company`

**Body:**
```json
{
  "route_id": "uuid",
  "alert_type": "roadworks",
  "title": "Obras en Calle Mayor",
  "descriptions": "Corte de carril",
  "starts_date": "2024-01-01T08:00:00Z",
  "end_date": "2024-01-15T20:00:00Z"
}
```

Tipos válidos: `roadworks` · `detour` · `delay` · `suspension` · `other`

---

### PUT `/alerts/:id_alert`
Actualiza una alerta.

**Rol requerido:** `Company`

**Body (todos opcionales, mínimo uno):**
```json
{
  "title": "Nuevo título",
  "is_active": false
}
```

**Errores:** `404 ALERT_NOT_FOUND`

---

### DELETE `/alerts/:id_alert`
Elimina una alerta.

**Rol requerido:** `Company`

**Errores:** `404 ALERT_NOT_FOUND`

---

## Timetable

### GET `/timetable/route/:id_route`
Consulta horarios de un trayecto. Filtrables por tipo de día.

**Rol requerido:** Público

**Query params:**

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `day_type` | string | ❌ | `L-V`, `sabado`, `domingo`, `festivo` |

**Ejemplo:** `GET /timetable/route/uuid?day_type=L-V`

**Respuesta 200:**
```json
{
  "ok": true,
  "timetable": [
    {
      "id_timetable": "uuid",
      "arrival_time": "08:00",
      "departure_time": "08:05",
      "day_type": "L-V",
      "name_stop": "Parada Central",
      "address_stop": "Calle Mayor 1"
    }
  ]
}
```

**Errores:** `404 TIMETABLE_NOT_FOUND`

---

### GET `/timetable/stop/:id_stop`
Consulta horarios de una parada. Filtrables por tipo de día.

**Rol requerido:** Público

**Query params:**

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `day_type` | string | ❌ | `L-V`, `sabado`, `domingo`, `festivo` |

**Errores:** `404 TIMETABLE_NOT_FOUND`

---

### POST `/timetable`
Crea un nuevo horario.

**Rol requerido:** `Company`

**Body:**
```json
{
  "route_id": "uuid",
  "stop_id": "uuid",
  "arrival_time": "08:00",
  "departure_time": "08:05",
  "day_type": "L-V"
}
```

---

### DELETE `/timetable/:id_timetable`
Elimina un horario.

**Rol requerido:** `Company`

**Errores:** `404 TIMETABLE_NOT_FOUND`

---

## Favorite

### GET `/favorites`
Lista los favoritos del cliente autenticado.

**Rol requerido:** `Client`

**Respuesta 200:**
```json
{
  "ok": true,
  "favorites": [
    {
      "id_favorite": "uuid",
      "name_stop": "Parada Central",
      "address_stop": "Calle Mayor 1",
      "latitude": 39.123,
      "longitude": -4.456,
      "origin": "Norte",
      "destination": "Sur",
      "direction": "ida",
      "line_code": "001A",
      "name_line": "Línea 1",
      "color": "#FF0000",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### POST `/favorites`
Añade una parada favorita.

**Rol requerido:** `Client`

**Body:**
```json
{
  "stop_id": "uuid",
  "route_id": "uuid"
}
```

**Respuesta 201:**
```json
{
  "ok": true,
  "message": "Favorito añadido correctamente",
  "favorite": { "..." }
}
```

**Errores:** `409 FAVORITE_ALREADY_EXISTS`

---

### DELETE `/favorites/:id_favorite`
Elimina un favorito.

**Rol requerido:** `Client`

**Respuesta 200:**
```json
{
  "ok": true,
  "message": "Favorito eliminado correctamente"
}
```

**Errores:** `404 FAVORITE_NOT_FOUND`

---

## Resumen de roles y acceso

| Módulo | Público | Client | Driver | Company |
|---|---|---|---|---|
| Auth (login/register) | ✅ | | | |
| Client (perfil) | | ✅ | | |
| Lines (lectura) | ✅ | | | |
| Lines (escritura) | | | | ✅ |
| Routes (lectura) | ✅ | | | |
| Routes (escritura) | | | | ✅ |
| Stops (lectura) | ✅ | | | |
| Stops (escritura) | | | | ✅ |
| Buses activos (mapa) | | ✅ | | |
| Buses gestión | | | | ✅ |
| Position (enviar GPS) | | | ✅ | |
| Position (consultar) | | | | ✅ |
| Services (gestión) | | | | ✅ |
| Services (iniciar/finalizar) | | | ✅ | |
| Services (mis servicios) | | | ✅ | |
| Incidents (ver/gestionar) | | | | ✅ |
| Incidents (crear) | | | ✅ | |
| Alerts | | | | ✅ |
| Timetable (consulta) | ✅ | | | |
| Timetable (gestión) | | | | ✅ |
| Favorites | | ✅ | | |
| Drivers | | | | ✅ |

---

## Códigos de error comunes

| Código | HTTP | Descripción |
|---|---|---|
| `INVALID_CREDENTIALS` | 401 | Email o contraseña incorrectos |
| `ACCOUNT_NOT_ACTIVATED` | 403 | Cuenta de conductor sin activar |
| `ACCOUNT_DISABLED` | 403 | Cuenta deshabilitada por la empresa |
| `EMAIL_ALREADY_EXISTS` | 409 | El email ya está registrado |
| `INVALID_STATE_TRANSITION` | 400 | Cambio de estado no permitido |
| `TOO_MANY_REQUESTS` | 429 | Demasiados intentos de login |
| `DRIVER_NOT_FOUND` | 404 | Conductor no encontrado |
| `BUS_NOT_FOUND` | 404 | Bus no encontrado |
| `LINE_NOT_FOUND` | 404 | Línea no encontrada |
| `ROUTE_NOT_FOUND` | 404 | Trayecto no encontrado |
| `STOP_NOT_FOUND` | 404 | Parada no encontrada |
| `SERVICE_NOT_FOUND` | 404 | Servicio no encontrado |
| `INCIDENT_NOT_FOUND` | 404 | Incidencia no encontrada |
| `ALERT_NOT_FOUND` | 404 | Alerta no encontrada |
| `TIMETABLE_NOT_FOUND` | 404 | Horario no encontrado |
| `FAVORITE_NOT_FOUND` | 404 | Favorito no encontrado |
| `POSITION_NOT_FOUND` | 404 | Posición no encontrada |
| `MISSING_COORDINATES` | 400 | Faltan lat/lng en la petición |
| `INVALID_COORDINATES` | 400 | Coordenadas fuera de rango |
| `SERVICE_NOT_ACTIVE` | 400 | El servicio no está en curso |
| `FAVORITE_ALREADY_EXISTS` | 409 | La parada ya está en favoritos |
| `LICENSE_ALREADY_EXISTS` | 409 | La matrícula ya existe |
