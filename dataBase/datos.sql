INSERT INTO usuario (
    nombre,
    email,
    password_hash
)
VALUES (
    'Prueba',
    'usuario@prueba.com',
    '123'
);

INSERT INTO empresa (
    nombre,
    email,
    password_hash
)
VALUES (
    'MonBus',
    'monbus@prueba.com',
    '456'
);

//posteriormente se asignará el conductor a una empresa, por eso se ha dejado el campo empresa_id en blanco
INSERT INTO conductor (
    empresa_id,
    nombre,
    email,
    dni,
    password_hash
)
VALUES (
    '66441935-8443-42ac-857a-bbae9953e49b',
    'Conductor',
    'conductor@prueba.com',
    '12345678A',
    '789'
);

/////
UPDATE usuario
SET password_hash = '$2b$10$2OdBx6av7UIBPtOT.avM1ueWhJ3w4Vl0jht/3QUorJzCGwjy52.9W'
WHERE email = 'usuario@prueba.com';

UPDATE empresa
SET password_hash = '$2b$10$v6vyLQFT3pNu.4h9OX1oIOHmQWdy.oFC8NaerqPFbbrALfhyTUb.6'
WHERE email = 'monbus@prueba.com';

UPDATE empresa
SET email = LOWER(email);

UPDATE usuario
SET email = LOWER(email);

ALTER TABLE usuario
ADD COLUMN apellidos VARCHAR(255);


ALTER TABLE conductor
ADD COLUMN token_activacion VARCHAR NULL,
ADD COLUMN cuenta_activada BOOLEAN DEFAULT FALSE;


ALTER TABLE conductor 
ALTER COLUMN password_hash DROP NOT NULL;

/*elimar datos de prueba*/
DELETE FROM driver;

/*Cambiar a UNIQUE una columnas*/
ALTER TABLE usuario ADD UNIQUE (email);


ALTER TABLE public.usuario 
DROP CONSTRAINT usuario_email_key1;

SELECT pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conname = 'conductor_email_check';

ALTER TABLE driver 
DROP COLUMN email;

ALTER TABLE bus 
ADD COLUMN en_servicio VARCHAR DEFAULT 'Operativo' 
CHECK (en_servicio IN ('Operativo', 'En mantenimiento', 'Fuera de servicio'));


ALTER TABLE bus 
ALTER COLUMN ultima_actualizacion DROP NOT NULL;

SELECT id_bus, empresa_id FROM bus;

ALTER TABLE asignar_servicio 
ADD COLUMN estado VARCHAR DEFAULT 'Programado'
CHECK (estado IN ('Programado', 'En curso', 'Completado', 'Cancelado'));


ALTER TABLE usuario DROP COLUMN apellido;


ALTER TABLE bus
ADD CONSTRAINT chk_bus_license_plate_format
CHECK (license_plate ~* '^[0-9]{4}[B-DF-HJ-NP-TV-Z]{3}$');

ALTER TABLE bus
ADD CONSTRAINT uq_bus_company_license_plate
UNIQUE (company_id, license_plate);



ALTER TABLE driver
ADD COLUMN personal_email VARCHAR(255);
ADD COLUMN company_email VARCHAR(255) NOT NULL UNIQUE


ALTER TABLE driver
ADD CONSTRAINT chk_driver_personal_email_format
CHECK (
  personal_email IS NULL OR
  personal_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);

ALTER TABLE driver
ADD CONSTRAINT chk_driver_company_email_format
CHECK (
  company_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);

ALTER TABLE driver
ADD CONSTRAINT uq_driver_company_email UNIQUE (company_email);

ALTER TABLE public.driver
DROP CONSTRAINT uq_driver_company_email;

SELECT id_driver, company_id FROM driver;

SELECT id_driver, company_id, full_name, company_email
FROM driver
WHERE id_driver = '722a4bfd-66d4-42ed-aab6-d48d9eb7cb84'
AND company_id = '506870ab-815a-4cce-b60d-f7ccc11a8425';


ALTER TABLE incident RENAME TO incidence;

ALTER TABLE incidence RENAME COLUMN id_incident TO id_incidence;
ALTER TABLE incidence RENAME COLUMN incident_type TO incidence_type;
ALTER TABLE incidence RENAME COLUMN id_incident TO id_incidence;
