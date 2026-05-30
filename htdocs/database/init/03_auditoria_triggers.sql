-- ============================================================
-- SISTEMA DE AUDITORÍA - ERP JUNTA DE AGUA (V2 con Variable de Sesión)
-- Tabla: Auditoria + 18 Triggers (6 tablas x 3 operaciones)
-- ============================================================

-- ------------------------------------------------------------
-- TABLA DE AUDITORÍA
-- ------------------------------------------------------------
CREATE TABLE Auditoria (
    id_auditoria    BIGINT AUTO_INCREMENT PRIMARY KEY,
    tabla_afectada  VARCHAR(100) NOT NULL COMMENT 'Nombre de la tabla modificada',
    operacion       ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    id_registro     VARCHAR(50) NOT NULL COMMENT 'PK del registro afectado',
    datos_anteriores JSON NULL COMMENT 'Valores ANTES del cambio (NULL en INSERT)',
    datos_nuevos     JSON NULL COMMENT 'Valores DESPUÉS del cambio (NULL en DELETE)',
    id_usuario      INT NULL COMMENT 'Usuario del sistema que ejecutó la acción (vía @id_usuario_actual)',
    fecha_hora      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_origen       VARCHAR(45) NULL COMMENT 'IP de conexión (llenada por el backend opcionalmente)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_aud_tabla     ON Auditoria(tabla_afectada);
CREATE INDEX idx_aud_fecha     ON Auditoria(fecha_hora);
CREATE INDEX idx_aud_usuario   ON Auditoria(id_usuario);
CREATE INDEX idx_aud_operacion ON Auditoria(operacion);

-- ============================================================
-- TRIGGERS: PERSONA
-- ============================================================
DELIMITER $$

CREATE TRIGGER trg_persona_insert
AFTER INSERT ON Persona FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Persona', 'INSERT', NEW.id_persona, NULL, JSON_OBJECT(
        'id_persona', NEW.id_persona, 'cedula', NEW.cedula, 'nombre', NEW.nombre, 'apellido', NEW.apellido,
        'id_genero', NEW.id_genero, 'id_sector', NEW.id_sector, 'id_condicion_especial', NEW.id_condicion_especial, 'estado_vital', NEW.estado_vital
    ), @id_usuario_actual);
END$$

CREATE TRIGGER trg_persona_update
AFTER UPDATE ON Persona FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Persona', 'UPDATE', NEW.id_persona,
    JSON_OBJECT(
        'id_persona', OLD.id_persona, 'cedula', OLD.cedula, 'nombre', OLD.nombre, 'apellido', OLD.apellido,
        'id_genero', OLD.id_genero, 'id_sector', OLD.id_sector, 'id_condicion_especial', OLD.id_condicion_especial, 'estado_vital', OLD.estado_vital
    ), JSON_OBJECT(
        'id_persona', NEW.id_persona, 'cedula', NEW.cedula, 'nombre', NEW.nombre, 'apellido', NEW.apellido,
        'id_genero', NEW.id_genero, 'id_sector', NEW.id_sector, 'id_condicion_especial', NEW.id_condicion_especial, 'estado_vital', NEW.estado_vital,
        'fecha_defuncion', NEW.fecha_defuncion
    ), @id_usuario_actual);
END$$

CREATE TRIGGER trg_persona_delete
BEFORE DELETE ON Persona FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Persona', 'DELETE', OLD.id_persona, JSON_OBJECT(
        'id_persona', OLD.id_persona,
        'cedula', OLD.cedula,
        'nombre', OLD.nombre,
        'apellido', OLD.apellido,
        'fecha_nacimiento', OLD.fecha_nacimiento,
        'id_zona', OLD.id_zona,
        'estado_vital', OLD.estado_vital
    ), NULL, @id_usuario_actual);
END$$

-- ============================================================
-- TRIGGERS: MULTA
-- ============================================================
CREATE TRIGGER trg_multa_insert
AFTER INSERT ON Multa FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Multa', 'INSERT', NEW.id_multa, NULL, JSON_OBJECT(
        'id_multa', NEW.id_multa,
        'id_persona', NEW.id_persona,
        'motivo_multa', NEW.motivo_multa,
        'monto', NEW.monto,
        'estado_pago', NEW.estado_pago,
        'fecha_emision', NEW.fecha_emision
    ), @id_usuario_actual);
END$$

CREATE TRIGGER trg_multa_update
AFTER UPDATE ON Multa FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Multa', 'UPDATE', NEW.id_multa,
    JSON_OBJECT(
        'id_persona', OLD.id_persona,
        'motivo_multa', OLD.motivo_multa,
        'monto', OLD.monto,
        'estado_pago', OLD.estado_pago
    ),
    JSON_OBJECT(
        'id_persona', NEW.id_persona,
        'motivo_multa', NEW.motivo_multa,
        'monto', NEW.monto,
        'estado_pago', NEW.estado_pago
    ), @id_usuario_actual);
END$$

CREATE TRIGGER trg_multa_delete
BEFORE DELETE ON Multa FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Multa', 'DELETE', OLD.id_multa, JSON_OBJECT(
        'id_multa', OLD.id_multa,
        'id_persona', OLD.id_persona,
        'motivo_multa', OLD.motivo_multa,
        'monto', OLD.monto,
        'estado_pago', OLD.estado_pago
    ), NULL, @id_usuario_actual);
END$$

-- ============================================================
-- TRIGGERS: CAJA_COMUNITARIA
-- ============================================================
CREATE TRIGGER trg_caja_insert
AFTER INSERT ON Caja_Comunitaria FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Caja_Comunitaria', 'INSERT', NEW.id_transaccion, NULL, JSON_OBJECT(
        'id_transaccion', NEW.id_transaccion,
        'numero_comprobante', NEW.numero_comprobante,
        'tipo_movimiento', NEW.tipo_movimiento,
        'concepto', NEW.concepto,
        'monto', NEW.monto,
        'id_multa', NEW.id_multa,
        'responsable_registro', NEW.responsable_registro
    ), @id_usuario_actual);
END$$

CREATE TRIGGER trg_caja_update
AFTER UPDATE ON Caja_Comunitaria FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Caja_Comunitaria', 'UPDATE', NEW.id_transaccion,
    JSON_OBJECT(
        'numero_comprobante', OLD.numero_comprobante,
        'tipo_movimiento', OLD.tipo_movimiento,
        'concepto', OLD.concepto,
        'monto', OLD.monto,
        'id_multa', OLD.id_multa,
        'responsable_registro', OLD.responsable_registro
    ),
    JSON_OBJECT(
        'numero_comprobante', NEW.numero_comprobante,
        'tipo_movimiento', NEW.tipo_movimiento,
        'concepto', NEW.concepto,
        'monto', NEW.monto,
        'id_multa', NEW.id_multa,
        'responsable_registro', NEW.responsable_registro
    ), @id_usuario_actual);
END$$

CREATE TRIGGER trg_caja_delete
BEFORE DELETE ON Caja_Comunitaria FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Caja_Comunitaria', 'DELETE', OLD.id_transaccion, JSON_OBJECT(
        'id_transaccion', OLD.id_transaccion,
        'numero_comprobante', OLD.numero_comprobante,
        'tipo_movimiento', OLD.tipo_movimiento,
        'concepto', OLD.concepto,
        'monto', OLD.monto,
        'responsable_registro', OLD.responsable_registro
    ), NULL, @id_usuario_actual);
END$$

-- ============================================================
-- TRIGGERS: MIEMBRO_DIRECTIVA
-- ============================================================
CREATE TRIGGER trg_directiva_insert
AFTER INSERT ON Miembro_Directiva FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Miembro_Directiva', 'INSERT', NEW.id_directiva, NULL, JSON_OBJECT(
        'id_directiva', NEW.id_directiva,
        'id_persona', NEW.id_persona,
        'id_cargo_directivo', NEW.id_cargo_directivo,
        'fecha_inicio', NEW.fecha_inicio,
        'fecha_fin', NEW.fecha_fin,
        'estado', NEW.estado
    ), @id_usuario_actual);
END$$

CREATE TRIGGER trg_directiva_update
AFTER UPDATE ON Miembro_Directiva FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Miembro_Directiva', 'UPDATE', NEW.id_directiva,
    JSON_OBJECT(
        'id_persona', OLD.id_persona,
        'id_cargo_directivo', OLD.id_cargo_directivo,
        'fecha_inicio', OLD.fecha_inicio,
        'fecha_fin', OLD.fecha_fin,
        'estado', OLD.estado
    ),
    JSON_OBJECT(
        'id_persona', NEW.id_persona,
        'id_cargo_directivo', NEW.id_cargo_directivo,
        'fecha_inicio', NEW.fecha_inicio,
        'fecha_fin', NEW.fecha_fin,
        'estado', NEW.estado
    ), @id_usuario_actual);
END$$

CREATE TRIGGER trg_directiva_delete
BEFORE DELETE ON Miembro_Directiva FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Miembro_Directiva', 'DELETE', OLD.id_directiva, JSON_OBJECT(
        'id_directiva', OLD.id_directiva,
        'id_persona', OLD.id_persona,
        'id_cargo_directivo', OLD.id_cargo_directivo,
        'fecha_inicio', OLD.fecha_inicio,
        'estado', OLD.estado
    ), NULL, @id_usuario_actual);
END$$

-- ============================================================
-- TRIGGERS: USUARIO_SISTEMA
-- ============================================================
CREATE TRIGGER trg_usuario_insert
AFTER INSERT ON Usuario_Sistema FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Usuario_Sistema', 'INSERT', NEW.id_usuario, NULL, JSON_OBJECT(
        'id_usuario', NEW.id_usuario,
        'id_persona', NEW.id_persona,
        'id_rol', NEW.id_rol,
        'username', NEW.username
    ), @id_usuario_actual);
END$$

CREATE TRIGGER trg_usuario_update
AFTER UPDATE ON Usuario_Sistema FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Usuario_Sistema', 'UPDATE', NEW.id_usuario,
    JSON_OBJECT(
        'id_persona', OLD.id_persona,
        'id_rol', OLD.id_rol,
        'username', OLD.username
    ),
    JSON_OBJECT(
        'id_persona', NEW.id_persona,
        'id_rol', NEW.id_rol,
        'username', NEW.username
    ), @id_usuario_actual);
END$$

CREATE TRIGGER trg_usuario_delete
BEFORE DELETE ON Usuario_Sistema FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Usuario_Sistema', 'DELETE', OLD.id_usuario, JSON_OBJECT(
        'id_usuario', OLD.id_usuario,
        'id_persona', OLD.id_persona,
        'id_rol', OLD.id_rol,
        'username', OLD.username
    ), NULL, @id_usuario_actual);
END$$

-- ============================================================
-- TRIGGERS: TERRENO
-- ============================================================
CREATE TRIGGER trg_terreno_insert
AFTER INSERT ON Terreno FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Terreno', 'INSERT', NEW.id_terreno, NULL, JSON_OBJECT(
        'id_terreno', NEW.id_terreno,
        'id_persona', NEW.id_persona,
        'clave_catastral', NEW.clave_catastral,
        'area_total', NEW.area_total,
        'id_estado_construccion', NEW.id_estado_construccion
    ), @id_usuario_actual);
END$$

CREATE TRIGGER trg_terreno_update
AFTER UPDATE ON Terreno FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Terreno', 'UPDATE', NEW.id_terreno,
    JSON_OBJECT(
        'id_persona', OLD.id_persona,
        'clave_catastral', OLD.clave_catastral,
        'area_total', OLD.area_total,
        'id_estado_construccion', OLD.id_estado_construccion
    ),
    JSON_OBJECT(
        'id_persona', NEW.id_persona,
        'clave_catastral', NEW.clave_catastral,
        'area_total', NEW.area_total,
        'id_estado_construccion', NEW.id_estado_construccion
    ), @id_usuario_actual);
END$$

CREATE TRIGGER trg_terreno_delete
BEFORE DELETE ON Terreno FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Terreno', 'DELETE', OLD.id_terreno, JSON_OBJECT(
        'id_terreno', OLD.id_terreno,
        'id_persona', OLD.id_persona,
        'clave_catastral', OLD.clave_catastral,
        'area_total', OLD.area_total,
        'id_estado_construccion', OLD.id_estado_construccion
    ), NULL, @id_usuario_actual);
END$$

DELIMITER ;

-- ============================================================
-- VERIFICACIÓN: ver triggers creados
-- ============================================================
SELECT TRIGGER_NAME, EVENT_MANIPULATION, EVENT_OBJECT_TABLE
FROM information_schema.TRIGGERS
WHERE TRIGGER_SCHEMA = DATABASE()
ORDER BY EVENT_OBJECT_TABLE, EVENT_MANIPULATION;