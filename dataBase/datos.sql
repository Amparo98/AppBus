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