/*Cambiar nombre de tablas y elementos a ingles*/

/*Cambiar nombre de la tabla*/
ALTER TABLE aviso_servicio RENAME TO services;

/*Cambiar nombre de la columna*/
ALTER TABLE services RENAME COLUMN id_asignacion TO id_service;
ALTER TABLE services RENAME COLUMN conductor_id TO driver_id;
ALTER TABLE services RENAME COLUMN trayecto_id TO route_id;
ALTER TABLE services RENAME COLUMN fecha_inicio TO starts_date;
ALTER TABLE services RENAME COLUMN fecha_fin TO end_date;
ALTER TABLE services RENAME COLUMN estado TO states;

ALTER TABLE aviso_servicio RENAME TO service_alert;

ALTER TABLE service_alert RENAME COLUMN id_aviso TO id_alert;
ALTER TABLE service_alert RENAME COLUMN trayecto_id TO route_id;
ALTER TABLE service_alert RENAME COLUMN tipo_aviso TO alert_type;
ALTER TABLE service_alert RENAME COLUMN titulo TO title;
ALTER TABLE service_alert RENAME COLUMN descripcion TO descriptions;
ALTER TABLE service_alert RENAME COLUMN fecha_inicio TO starts_date;
ALTER TABLE service_alert RENAME COLUMN fecha_fin TO end_date;
ALTER TABLE service_alert RENAME COLUMN activo TO is_active;



ALTER TABLE bus RENAME COLUMN empresa_id TO company_id;
ALTER TABLE bus RENAME COLUMN matricula TO license_plate;
ALTER TABLE bus RENAME COLUMN ultima_actualizacion TO updated_at;
ALTER TABLE bus RENAME COLUMN en_servicio TO statu;


ALTER TABLE conductor RENAME TO driver;

ALTER TABLE driver RENAME COLUMN id_busdriver TO id_driver;
ALTER TABLE driver RENAME COLUMN empresa_id TO company_id;
ALTER TABLE driver RENAME COLUMN nombre TO full_name;
ALTER TABLE driver RENAME COLUMN telefono TO phone_number;
ALTER TABLE driver RENAME COLUMN num_trabajador TO employee_number;
ALTER TABLE driver RENAME COLUMN activo TO is_active;
ALTER TABLE driver RENAME COLUMN token_activacion TO activation_token;
ALTER TABLE driver RENAME COLUMN cuenta_activada TO is_account_activated;


ALTER TABLE empresa RENAME TO company;

ALTER TABLE company RENAME COLUMN id_empresa TO id_company;
ALTER TABLE company RENAME COLUMN nombre TO name_company;
ALTER TABLE company RENAME COLUMN telefono TO phone_number;

ALTER TABLE favorito RENAME TO favorite;

ALTER TABLE favorite RENAME COLUMN id_favorito TO id_favorite;
ALTER TABLE favorite RENAME COLUMN usuario_id TO user_id;
ALTER TABLE favorite RENAME COLUMN trayecto_id TO route_id;
ALTER TABLE favorite RENAME COLUMN parada_id TO stop_id;


-- 1. Renombrar la tabla a timetable
ALTER TABLE horario RENAME TO timetable;

-- 2. Renombrar las columnas (basado en la imagen anterior)
ALTER TABLE timetable RENAME COLUMN id_horario TO id_timetable;
ALTER TABLE timetable RENAME COLUMN trayecto_id TO route_id;
ALTER TABLE timetable RENAME COLUMN parada_id TO stop_id;
ALTER TABLE timetable RENAME COLUMN hora_llegada TO arrival_time;
ALTER TABLE timetable RENAME COLUMN hora_salida TO departure_time;
ALTER TABLE timetable RENAME COLUMN tipo_dia TO day_type;

ALTER TABLE incidencia RENAME TO incident;

ALTER TABLE incident RENAME COLUMN id TO id_incident;
ALTER TABLE incident RENAME COLUMN conductor_id TO driver_id; 
ALTER TABLE incident RENAME COLUMN trayecto_id TO route_id;
ALTER TABLE incident RENAME COLUMN tipo_incidencia TO incident_type;
ALTER TABLE incident RENAME COLUMN descripcion TO descriptions;
ALTER TABLE incident RENAME COLUMN estado TO states;
ALTER TABLE incident RENAME COLUMN resuelta_at TO resolved_at;

ALTER TABLE linea RENAME TO line;

ALTER TABLE line RENAME COLUMN id TO id_line;
ALTER TABLE line RENAME COLUMN empresa_id TO company_id;
ALTER TABLE line RENAME COLUMN nombre TO name_line;
ALTER TABLE line RENAME COLUMN codigo TO code;

ALTER TABLE parada RENAME TO stops;

ALTER TABLE stops RENAME COLUMN id_parada TO id_stop;
ALTER TABLE stops RENAME COLUMN nombre TO name_stop;
ALTER TABLE stops RENAME COLUMN direccion TO address_stop;
ALTER TABLE stops RENAME COLUMN ubicacion TO locations;

ALTER TABLE posicion_bus RENAME TO bus_position;

ALTER TABLE bus_position RENAME COLUMN id_posicion TO id_position;
ALTER TABLE bus_position RENAME COLUMN ubicacion TO location_bus;
ALTER TABLE bus_position RENAME COLUMN fecha TO dates;

ALTER TABLE registro_fichaje RENAME TO shift_log;

ALTER TABLE shift_log RENAME COLUMN id_fichaje TO id_shift_log;
ALTER TABLE shift_log RENAME COLUMN conductor_id TO driver_id;
ALTER TABLE shift_log RENAME COLUMN inicio_jornada TO start_time;
ALTER TABLE shift_log RENAME COLUMN fin_jornada TO end_time;

ALTER TABLE trayecto RENAME TO routes;

ALTER TABLE routes RENAME COLUMN id_trayecto TO id_route;
ALTER TABLE routes RENAME COLUMN linea_id TO line_id;
ALTER TABLE routes RENAME COLUMN origen TO origin;
ALTER TABLE routes RENAME COLUMN destino TO destination;
ALTER TABLE routes RENAME COLUMN duracion_estimada TO estimated_duration;
ALTER TABLE routes RENAME COLUMN activo TO is_active;
ALTER TABLE routes RENAME COLUMN sentido TO direction;

ALTER TABLE trayecto_parada RENAME TO route_stop;

ALTER TABLE route_stop RENAME COLUMN id_trayecto_parada TO id_route_stop;
ALTER TABLE route_stop RENAME COLUMN trayecto_id TO route_id;
ALTER TABLE route_stop RENAME COLUMN parada_id TO stop_id;
ALTER TABLE route_stop RENAME COLUMN orden TO orders; 

ALTER TABLE usuario RENAME TO client;

ALTER TABLE client RENAME COLUMN id_usuario TO id_client;
ALTER TABLE client RENAME COLUMN nombre TO full_name;

ALTER TABLE usuario
ADD COLUMN first_surname VARCHAR(100),
ADD COLUMN second_surname VARCHAR(100);

ALTER TABLE conductor RENAME COLUMN id_busDriver TO id_driver;

ALTER TABLE services ADD COLUMN busdriver_id uuid;

-- 2. Creamos la relación (Foreign Key)
ALTER TABLE servicio 
ADD CONSTRAINT fk_servicio_driver
FOREIGN KEY (driver_id) 
REFERENCES conductor (id_busdriver)