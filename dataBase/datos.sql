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
DELETE FROM client;

/*Cambiar a UNIQUE una columnas*/
ALTER TABLE usuario ADD UNIQUE (email);


ALTER TABLE public.usuario 
DROP CONSTRAINT usuario_email_key1;

SELECT pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conname = 'conductor_email_check';

ALTER TABLE bus 
DROP COLUMN en_servicio;

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