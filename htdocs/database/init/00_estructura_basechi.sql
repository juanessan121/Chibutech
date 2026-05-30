CREATE DATABASE IF NOT EXISTS basechi;
USE basechi;

-- =============================================================================
-- ERP JUNTAS DE AGUA - ARQUITECTURA DEFINITIVA (V4 - 100% DINÁMICA Y FINANCIERA)
-- MOTOR: InnoDB | DEFAULT CHARSET: utf8mb4 
-- DISEÑO: Cero datos quemados, jerarquía de multas, manejo de imprevistos y auditoría.
-- =============================================================================

-- -----------------------------------------------------
-- PARTE 1: CATÁLOGOS GLOBALES Y DINÁMICOS
-- -----------------------------------------------------

-- 1.1 Geografía y Directiva
CREATE TABLE Zona (
    id_zona INT AUTO_INCREMENT PRIMARY KEY,
    nombre_zona VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Sector (
    id_sector INT AUTO_INCREMENT PRIMARY KEY,
    id_zona INT NOT NULL,
    nombre_sector VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    CONSTRAINT fk_sector_zona FOREIGN KEY (id_zona) REFERENCES Zona(id_zona) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Catalogo_Cargo_Directivo (
    id_cargo_directivo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_cargo VARCHAR(100) NOT NULL UNIQUE, 
    descripcion TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 1.2 Personas y Contactos
CREATE TABLE Catalogo_Condicion_Especial (
    id_condicion INT AUTO_INCREMENT PRIMARY KEY,
    nombre_condicion VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO Catalogo_Condicion_Especial (nombre_condicion) VALUES 
('Ninguna'), ('Tercera Edad'), ('Discapacidad'), ('Viudez'), ('Enfermedad Catastrófica');

CREATE TABLE Catalogo_Tipo_Contacto (
    id_tipo_contacto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tipo VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO Catalogo_Tipo_Contacto (nombre_tipo) VALUES 
('Celular'), ('Teléfono Fijo'), ('Correo Electrónico'), ('WhatsApp');

-- 1.3 Infraestructura y Catastro
CREATE TABLE Catalogo_Estado_Construccion (
    id_estado_construccion INT AUTO_INCREMENT PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO Catalogo_Estado_Construccion (nombre_estado) VALUES 
('Lote Baldío'), ('En Planificación'), ('En Construcción'), ('Construida');

-- 1.4 Catálogos para Mingas (Trabajo Comunitario)
CREATE TABLE Catalogo_Actividad_Minga (
    id_actividad INT AUTO_INCREMENT PRIMARY KEY,
    nombre_actividad VARCHAR(150) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Catalogo_Estado_Minga (
    id_estado_minga INT AUTO_INCREMENT PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Catalogo_Estado_Asistencia (
    id_estado_asistencia INT AUTO_INCREMENT PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO Catalogo_Estado_Minga (nombre_estado) VALUES ('Programada'), ('En Ejecución'), ('Finalizada'), ('Suspendida'), ('Cancelada');
INSERT INTO Catalogo_Estado_Asistencia (nombre_estado) VALUES ('Pendiente'), ('Presente'), ('Faltó'), ('Justificado');

-- 1.5 Educación
CREATE TABLE Catalogo_Nivel_Academico (
    id_nivel_academico INT AUTO_INCREMENT PRIMARY KEY,
    nombre_nivel VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO Catalogo_Nivel_Academico (id_nivel_academico, nombre_nivel) VALUES 
(1, 'No Especificado'), (2, 'Técnico/Tecnológico'), (3, 'Tercer Nivel'), (4, 'Cuarto Nivel'), (5, 'Quinto Nivel');


-- -----------------------------------------------------
-- PARTE 2: CATÁLOGO NACIONAL DE TÍTULOS (SENESCYT)
-- -----------------------------------------------------
CREATE TABLE Catalogo_Titulo_Educativo (
    codigo VARCHAR(15) PRIMARY KEY COMMENT 'Código oficial CINE',
    nombre VARCHAR(255) NOT NULL,
    nivel_jerarquico INT NOT NULL,
    
    id_nivel_academico INT NOT NULL DEFAULT 1,
    parent_codigo VARCHAR(15) NULL,
    
    CONSTRAINT fk_cat_titulo_parent FOREIGN KEY (parent_codigo) REFERENCES Catalogo_Titulo_Educativo(codigo) ON DELETE RESTRICT,
    CONSTRAINT fk_cat_titulo_nivel FOREIGN KEY (id_nivel_academico) REFERENCES Catalogo_Nivel_Academico(id_nivel_academico) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_cat_nivel_jerarquico ON Catalogo_Titulo_Educativo(nivel_jerarquico);
ALTER TABLE Catalogo_Titulo_Educativo ADD FULLTEXT INDEX idx_cat_nombre (nombre);


-- -----------------------------------------------------
-- PARTE 3: NÚCLEO DE PERSONAS Y GOBERNANZA
-- -----------------------------------------------------
CREATE TABLE Persona (
    id_persona INT AUTO_INCREMENT PRIMARY KEY,
    cedula VARCHAR(15) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    id_zona INT NULL,
    
    id_genero INT NULL,
    id_sector INT NULL,
    id_representante_familia INT NULL,
    id_condicion_especial INT NOT NULL DEFAULT 1,
    estado_vital ENUM('Vivo', 'Fallecido') DEFAULT 'Vivo',
    fecha_defuncion DATE NULL,

    CONSTRAINT fk_persona_genero FOREIGN KEY (id_genero) REFERENCES Catalogo_Genero(id_genero) ON DELETE RESTRICT,
    CONSTRAINT fk_persona_sector FOREIGN KEY (id_sector) REFERENCES Sector(id_sector) ON DELETE SET NULL,
    CONSTRAINT fk_persona_tutor FOREIGN KEY (id_representante_familia) REFERENCES Persona(id_persona) ON DELETE SET NULL,
    CONSTRAINT fk_persona_condicion FOREIGN KEY (id_condicion_especial) REFERENCES Catalogo_Condicion_Especial(id_condicion) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Miembro_Directiva (
    id_directiva INT AUTO_INCREMENT PRIMARY KEY,
    id_persona INT NOT NULL,
    id_cargo_directivo INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NULL,
    estado ENUM('Activo', 'Finalizado') DEFAULT 'Activo',
    
    CONSTRAINT fk_directiva_persona FOREIGN KEY (id_persona) REFERENCES Persona(id_persona) ON DELETE CASCADE,
    CONSTRAINT fk_directiva_cargo FOREIGN KEY (id_cargo_directivo) REFERENCES Catalogo_Cargo_Directivo(id_cargo_directivo) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- PARTE 4: EDUCACIÓN Y CONTACTOS PERSONALES
-- -----------------------------------------------------
CREATE TABLE Perfil_Educativo_Persona (
    id_perfil INT AUTO_INCREMENT PRIMARY KEY,
    id_persona INT NOT NULL,
    codigo_titulo_cine VARCHAR(15) NOT NULL, 
    estado_estudio ENUM('Cursando', 'Finalizado', 'Abandonado') DEFAULT 'Finalizado',
    
    CONSTRAINT fk_edu_persona FOREIGN KEY (id_persona) REFERENCES Persona(id_persona) ON DELETE CASCADE,
    CONSTRAINT fk_edu_titulo FOREIGN KEY (codigo_titulo_cine) REFERENCES Catalogo_Titulo_Educativo(codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Contacto_Persona (
    id_contacto INT AUTO_INCREMENT PRIMARY KEY,
    id_persona INT NOT NULL,
    id_tipo_contacto INT NOT NULL, 
    valor_contacto VARCHAR(150) NOT NULL,
    operadora_o_detalle VARCHAR(50) NULL,
    es_principal BOOLEAN DEFAULT FALSE,
    
    CONSTRAINT fk_contacto_persona FOREIGN KEY (id_persona) REFERENCES Persona(id_persona) ON DELETE CASCADE,
    CONSTRAINT fk_contacto_tipo FOREIGN KEY (id_tipo_contacto) REFERENCES Catalogo_Tipo_Contacto(id_tipo_contacto) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- PARTE 5: CATASTRO Y CONTROL DE TIERRAS
-- -----------------------------------------------------
CREATE TABLE Terreno (
    id_terreno INT AUTO_INCREMENT PRIMARY KEY,
    id_persona INT NOT NULL,
    clave_catastral VARCHAR(50) UNIQUE NOT NULL,
    area_total DECIMAL(10, 2) NOT NULL,
    id_estado_construccion INT NOT NULL DEFAULT 1,
    
    CONSTRAINT fk_terreno_persona FOREIGN KEY (id_persona) REFERENCES Persona(id_persona),
    CONSTRAINT fk_terreno_estado FOREIGN KEY (id_estado_construccion) REFERENCES Catalogo_Estado_Construccion(id_estado_construccion) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- PARTE 6: SEGURIDAD INFORMÁTICA - RBAC DINÁMICO
-- -----------------------------------------------------
CREATE TABLE Rol_Sistema (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) UNIQUE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Permiso_Sistema (
    id_permiso INT AUTO_INCREMENT PRIMARY KEY,
    nombre_permiso VARCHAR(100) UNIQUE NOT NULL, 
    modulo VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Permiso_Rol (
    id_rol INT NOT NULL,
    id_permiso INT NOT NULL,
    PRIMARY KEY (id_rol, id_permiso),
    CONSTRAINT fk_rol_matriz FOREIGN KEY (id_rol) REFERENCES Rol_Sistema(id_rol) ON DELETE CASCADE,
    CONSTRAINT fk_permiso_matriz FOREIGN KEY (id_permiso) REFERENCES Permiso_Sistema(id_permiso) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Usuario_Sistema (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    id_persona INT NOT NULL,
    id_rol INT NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    password_salt VARCHAR(255) NOT NULL,
    
    CONSTRAINT fk_usuario_persona FOREIGN KEY (id_persona) REFERENCES Persona(id_persona),
    CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) REFERENCES Rol_Sistema(id_rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- PARTE 7: TRABAJO COMUNITARIO Y MANTENIMIENTO (MINGAS 2.0)
-- -----------------------------------------------------
CREATE TABLE Minga (
    id_minga INT AUTO_INCREMENT PRIMARY KEY,
    fecha_programada DATE NOT NULL,
    motivo_general VARCHAR(255) NOT NULL,
    lugar_encuentro VARCHAR(150) NOT NULL,
    id_estado_minga INT NOT NULL,
    
    valor_multa_inasistencia DECIMAL(8,2) NOT NULL DEFAULT 0.00 COMMENT 'Multa base para esta minga',
    observacion_estado TEXT NULL COMMENT 'Motivo de cancelación o suspensión',
    
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_minga_estado FOREIGN KEY (id_estado_minga) REFERENCES Catalogo_Estado_Minga(id_estado_minga) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Asignacion_Sector_Minga (
    id_asignacion_sector INT AUTO_INCREMENT PRIMARY KEY,
    id_minga INT NOT NULL,
    id_sector INT NOT NULL,
    id_actividad INT NOT NULL,
    valor_multa_grupo DECIMAL(8,2) NULL,
    CONSTRAINT fk_asig_sector_minga FOREIGN KEY (id_minga) REFERENCES Minga(id_minga) ON DELETE CASCADE,
    CONSTRAINT fk_asig_sector_lugar FOREIGN KEY (id_sector) REFERENCES Sector(id_sector) ON DELETE CASCADE,
    CONSTRAINT fk_asig_sector_actividad FOREIGN KEY (id_actividad) REFERENCES Catalogo_Actividad_Minga(id_actividad) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Asistencia_Minga (
    id_asistencia INT AUTO_INCREMENT PRIMARY KEY,
    id_minga INT NOT NULL,
    id_persona INT NOT NULL,
    id_actividad_especifica INT NULL,
    id_estado_asistencia INT NOT NULL,
    observacion VARCHAR(255) NULL COMMENT 'Aquí se registra si presentó justificación o certificado médico',
    
    CONSTRAINT fk_asistencia_minga FOREIGN KEY (id_minga) REFERENCES Minga(id_minga) ON DELETE CASCADE,
    CONSTRAINT fk_asistencia_persona FOREIGN KEY (id_persona) REFERENCES Persona(id_persona) ON DELETE CASCADE,
    CONSTRAINT fk_asistencia_actividad FOREIGN KEY (id_actividad_especifica) REFERENCES Catalogo_Actividad_Minga(id_actividad) ON DELETE SET NULL,
    CONSTRAINT fk_asistencia_estado FOREIGN KEY (id_estado_asistencia) REFERENCES Catalogo_Estado_Asistencia(id_estado_asistencia) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_asistencia_control ON Asistencia_Minga(id_minga, id_estado_asistencia);


-- -----------------------------------------------------
-- PARTE 8: FINANZAS Y CONFIGURACIÓN GLOBAL
-- -----------------------------------------------------
CREATE TABLE Multa (
    id_multa INT AUTO_INCREMENT PRIMARY KEY,
    id_persona INT NOT NULL,
    motivo_multa VARCHAR(200) NOT NULL,
    monto DECIMAL(8, 2) NOT NULL,
    estado_pago ENUM('Pendiente', 'Pagada', 'Anulada') DEFAULT 'Pendiente',
    fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_multa_persona FOREIGN KEY (id_persona) REFERENCES Persona(id_persona) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Caja_Comunitaria (
    id_transaccion INT AUTO_INCREMENT PRIMARY KEY,
    numero_comprobante VARCHAR(50) UNIQUE NULL,
    tipo_movimiento ENUM('Ingreso', 'Egreso') NOT NULL,
    concepto VARCHAR(255) NOT NULL,
    id_multa INT NULL,
    monto DECIMAL(12, 2) NOT NULL,
    responsable_registro INT NOT NULL,
    
    CONSTRAINT fk_caja_multa FOREIGN KEY (id_multa) REFERENCES Multa(id_multa) ON DELETE SET NULL,
    CONSTRAINT fk_caja_usuario FOREIGN KEY (responsable_registro) REFERENCES Usuario_Sistema(id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Configuracion_Global (
    id_configuracion INT AUTO_INCREMENT PRIMARY KEY,
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor VARCHAR(255) NOT NULL,
    tipo_dato ENUM('Entero', 'Decimal', 'Texto', 'Booleano') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- PARTE 9: AUDITORÍA Y TRAZABILIDAD DEL SISTEMA
-- -----------------------------------------------------
CREATE TABLE Auditoria_Sistema (
    id_auditoria INT AUTO_INCREMENT PRIMARY KEY,
    tabla_afectada VARCHAR(100) NOT NULL,
    accion ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    id_registro_afectado INT NOT NULL,
    
    valores_antiguos JSON NULL,
    valores_nuevos JSON NULL,
    
    id_usuario_responsable INT NULL,
    ip_origen VARCHAR(45) NULL,
    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_auditoria_usuario FOREIGN KEY (id_usuario_responsable) REFERENCES Usuario_Sistema(id_usuario) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_auditoria_busqueda ON Auditoria_Sistema(tabla_afectada, id_registro_afectado);


-- -----------------------------------------------------
-- PARTE 10: TRIGGERS Y REGLAS DE NEGOCIO (Blindaje)
-- -----------------------------------------------------
DELIMITER //

CREATE TRIGGER trg_bloqueo_admin_delete
BEFORE DELETE ON Usuario_Sistema
FOR EACH ROW
BEGIN
    -- Bloqueo estricto para proteger al super administrador (ID 1)
    IF OLD.id_usuario = 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Bloqueo crítico: No se puede eliminar al administrador principal porque sin él se acaba el programa.';
    END IF;
END; //

DELIMITER ;