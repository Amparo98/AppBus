/*Esquema de la base de datos para el proyecto de gestión de empresas y sus ubicaciones geográficas.*/
/*Se utilizan las extensiones pgcrypto para generar UUIDs y postgis para manejar datos geoespaciales.*/
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS postgis;

/*Tabla Empresa*/
CREATE TABLE empresa (
    id_empresa UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    telefono VARCHAR(20) NOT NULL check (telefono ~ '^\+?[0-9]{7,15}$'),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

/*Tabla Conductor*/
CREATE TABLE conductor (
    id_conductor UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empresa(id_empresa) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    dni VARCHAR(20) NOT NULL UNIQUE check (dni ~* '^[0-9]{8}[A-Za-z]$'),
    telefono VARCHAR(20) check (telefono ~ '^\+?[0-9]{7,15}$'),
    num_trabajador VARCHAR(20) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

/*Tabla Bus*/
CREATE TABLE bus (
    id_bus UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empresa(id_empresa) ON DELETE CASCADE,
    matricula VARCHAR(20) NOT NULL UNIQUE,
    ultima_actualizacion TIMESTAMP WITH TIME ZONE,
    en_servicio BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

/*Tabla Linea*/
CREATE TABLE linea (
    id_linea UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empresa(id_empresa) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    color VARCHAR(7) CHECK (color ~ '^#[A-Fa-f0-9]{6}$'),
    codigo VARCHAR(20) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    UNIQUE (empresa_id, codigo)
);

/*Tabla Parada*/
CREATE TABLE parada (
    id_parada UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    direccion VARCHAR(255),
    ubicacion GEOGRAPHY(POINT, 4326) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);