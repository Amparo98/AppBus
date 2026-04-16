/*table.sql: Esquema de la base de datos para el proyecto de gestión de empresas y sus ubicaciones geográficas.*/

/*Esquema de la base de datos para el proyecto de gestión de empresas y sus ubicaciones geográficas.*/
/*Se utilizan las extensiones pgcrypto para generar UUIDs y postgis para manejar datos geoespaciales.*/
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS postgis;

/*Tabla Empresa*/
CREATE TABLE empresa (
    id_empresa UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    telefono VARCHAR(20) CHECK (telefono ~ '^\+?[0-9]{7,15}$'),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

/*Tabla Conductor*/
CREATE TABLE conductor (
    id_conductor UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empresa(id_empresa) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    dni VARCHAR(20) NOT NULL UNIQUE CHECK (dni ~* '^[0-9]{8}[A-Za-z]$'),
    telefono VARCHAR(20) CHECK (telefono ~ '^\+?[0-9]{7,15}$'),
    num_trabajador VARCHAR(20) NOT NULL,
    password_hash TEXT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (empresa_id, email),
    UNIQUE (empresa_id, num_trabajador) 
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

/*Tabla Posicion_Bus*/
CREATE TABLE posicion_bus (
    id_posicion UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bus_id UUID NOT NULL REFERENCES bus(id_bus) ON DELETE CASCADE,
    ubicacion GEOGRAPHY(POINT, 4326) NOT NULL,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

/*Tabla Linea*/
CREATE TABLE linea (
    id_linea UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empresa(id_empresa) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    color VARCHAR(7) CHECK (color ~ '^#[A-Fa-f0-9]{6}$'),
    codigo VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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

/*Tabla relacionadas con Conductor*/
CREATE TABLE registro_fichaje(
    id_fichaje UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conductor_id UUID NOT NULL REFERENCES conductor(id_conductor) ON DELETE CASCADE,
    inicio_jornada TIMESTAMP WITH TIME ZONE NOT NULL,
    fin_jornada TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (fin_jornada IS NULL OR fin_jornada >= inicio_jornada)
);

/*Tabla Trayecto*/
CREATE TABLE trayecto (
    id_trayecto UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    linea_id UUID NOT NULL REFERENCES linea(id_linea) ON DELETE CASCADE,
    origen VARCHAR(255) NOT NULL,
    destino VARCHAR(255) NOT NULL,
    duracion_estimada INTERVAL,
    activo BOOLEAN DEFAULT TRUE,
    sentido VARCHAR(20) NOT NULL CHECK (sentido IN ('ida', 'vuelta')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (linea_id, sentido)
);

CREATE TABLE asignar_servicio(
    id_asignacion UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conductor_id UUID NOT NULL REFERENCES conductor(id_conductor) ON DELETE CASCADE,
    bus_id UUID NOT NULL REFERENCES bus(id_bus) ON DELETE CASCADE,
    trayecto_id UUID NOT NULL REFERENCES trayecto(id_trayecto) ON DELETE CASCADE,
    fecha_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    fecha_fin TIMESTAMP WITH TIME ZONE,
    estado VARCHAR(20) NOT NULL DEFAULT 'asignada' CHECK (estado IN ('asignada', 'en_curso', 'finalizada', 'cancelada')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (fecha_fin IS NULL OR fecha_fin >= fecha_inicio)
);

CREATE TABLE incidencia(
    id_incidencia UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conductor_id UUID NOT NULL REFERENCES conductor(id_conductor) ON DELETE CASCADE,
    bus_id UUID REFERENCES bus(id_bus) ON DELETE SET NULL,
    trayecto_id UUID REFERENCES trayecto(id_trayecto) ON DELETE SET NULL,
    tipo_incidencia VARCHAR(255) NOT NULL CHECK (tipo_incidencia IN ('averia', 'pasajero', 'emergencia', 'otra')),
    descripcion TEXT,
    estado VARCHAR(20) NOT NULL DEFAULT 'abierta' CHECK (estado IN ('abierta', 'en_proceso', 'cerrada')),
    resuelta_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

/*Tabla Trayecto_Parada*/
CREATE TABLE trayecto_parada (
    id_trayecto_parada UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trayecto_id UUID NOT NULL REFERENCES trayecto(id_trayecto) ON DELETE CASCADE,
    parada_id UUID NOT NULL REFERENCES parada(id_parada) ON DELETE CASCADE,
    orden INTEGER NOT NULL CHECK (orden > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (trayecto_id, parada_id),
    UNIQUE (trayecto_id, orden)
);

/*Tabla Horario*/
CREATE TABLE horario (
    id_horario UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trayecto_id UUID NOT NULL REFERENCES trayecto(id_trayecto) ON DELETE CASCADE,
    parada_id UUID NOT NULL REFERENCES parada(id_parada) ON DELETE CASCADE,
    hora_llegada TIME NOT NULL,
    hora_salida TIME NOT NULL CHECK (hora_salida >= hora_llegada),
    tipo_dia VARCHAR(10) NOT NULL CHECK (tipo_dia IN ('L-V', 'sabado', 'domingo', 'festivo')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (trayecto_id, parada_id, hora_llegada, tipo_dia)
);

/*Tabla Usuario*/
CREATE TABLE usuario (
    id_usuario UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

/*Tabla Favoritos*/
CREATE TABLE favorito (
    id_favorito UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    trayecto_id UUID NOT NULL REFERENCES trayecto(id_trayecto) ON DELETE CASCADE,
    parada_id UUID NOT NULL REFERENCES parada(id_parada) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (usuario_id, trayecto_id, parada_id)
);  

/* Tabla Aviso_Servicio */
CREATE TABLE aviso_servicio (
    id_aviso UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trayecto_id UUID NOT NULL REFERENCES trayecto(id_trayecto) ON DELETE CASCADE,
    tipo_aviso VARCHAR(20) NOT NULL CHECK (tipo_aviso IN ('obras', 'desvio', 'retraso', 'suspension', 'otra')),
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    fecha_fin TIMESTAMP WITH TIME ZONE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (fecha_fin IS NULL OR fecha_fin >= fecha_inicio)
);

/* indices para optimizar consultas */
/*CREATE INDEX idx_posicion_bus_fecha ON posicion_bus(fecha);
CREATE INDEX idx_asignar_servicio_fecha_inicio ON asignar_servicio(fecha_inicio);
CREATE INDEX idx_asignar_servicio_fecha_fin ON asignar_servicio(fecha_fin);
CREATE INDEX idx_incidencia_estado ON incidencia(estado);
CREATE INDEX idx_incidencia_tipo ON incidencia(tipo_incidencia);
CREATE INDEX idx_incidencia_resuelta_at ON incidencia(resuelta_at);
CREATE INDEX idx_aviso_servicio_fecha_inicio ON aviso_servicio(fecha_inicio);
CREATE INDEX idx_aviso_servicio_fecha_fin ON aviso_servicio(fecha_fin);

CREATE INDEX idx_parada_ubicacion ON parada USING GIST (ubicacion);
CREATE INDEX idx_posicion_bus_ubicacion ON posicion_bus USING GIST (ubicacion);
CREATE INDEX idx_conductor_empresa_id ON conductor (empresa_id);
CREATE INDEX idx_bus_empresa_id ON bus (empresa_id);
CREATE INDEX idx_linea_empresa_id ON linea (empresa_id);
CREATE INDEX idx_trayecto_linea_id ON trayecto (linea_id);
CREATE INDEX idx_trayecto_parada_trayecto_id ON trayecto_parada (trayecto_id);
CREATE INDEX idx_trayecto_parada_parada_id ON trayecto_parada (parada_id);
CREATE INDEX idx_horario_trayecto_id ON horario (trayecto_id);
CREATE INDEX idx_horario_parada_id ON horario (parada_id);
CREATE INDEX idx_posicion_bus_bus_id ON posicion_bus (bus_id);
CREATE INDEX idx_registro_fichaje_conductor_id ON registro_fichaje (conductor_id);
CREATE INDEX idx_asignar_servicio_conductor_id ON asignar_servicio (conductor_id);
CREATE INDEX idx_asignar_servicio_bus_id ON asignar_servicio (bus_id);
CREATE INDEX idx_asignar_servicio_trayecto_id ON asignar_servicio (trayecto_id);
CREATE INDEX idx_incidencia_conductor_id ON incidencia (conductor_id);
CREATE INDEX idx_incidencia_bus_id ON incidencia (bus_id);
CREATE INDEX idx_incidencia_trayecto_id ON incidencia (trayecto_id);
CREATE INDEX idx_favorito_usuario_id ON favorito (usuario_id);
CREATE INDEX idx_favorito_trayecto_id ON favorito (trayecto_id);
CREATE INDEX idx_favorito_parada_id ON favorito (parada_id);
CREATE INDEX idx_aviso_servicio_trayecto_id ON aviso_servicio (trayecto_id);
CREATE INDEX idx_bus_en_servicio ON bus (en_servicio);
CREATE INDEX idx_incidencia_estado ON incidencia (estado);
CREATE INDEX idx_aviso_servicio_activo ON aviso_servicio (activo);
CREATE INDEX idx_parada_ubicacion ON parada USING GIST (ubicacion);
CREATE INDEX idx_posicion_bus_ubicacion ON posicion_bus USING GIST (ubicacion);
CREATE INDEX idx_posicion_bus_bus_id ON posicion_bus (bus_id);
CREATE INDEX idx_linea_empresa_id ON linea (empresa_id);
CREATE INDEX idx_trayecto_linea_id ON trayecto (linea_id);
CREATE INDEX idx_horario_trayecto_id ON horario (trayecto_id);
CREATE INDEX idx_favorito_usuario_id ON favorito (usuario_id);
CREATE INDEX idx_aviso_servicio_trayecto_id ON aviso_servicio (trayecto_id);
CREATE INDEX idx_incidencia_estado ON incidencia (estado);*/