-- ============================================================
-- SISTEMA DE AUDITORÍA - ERP JUNTA DE AGUA
-- Tabla: Auditoria + 18 Triggers (6 tablas x 3 operaciones)
-- ============================================================

-- ------------------------------------------------------------
-- TABLA DE AUDITORÍA
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS auditoria (
    id_auditoria    BIGINT AUTO_INCREMENT PRIMARY KEY,
    tabla_afectada  VARCHAR(100) NOT NULL COMMENT 'Nombre de la tabla modificada',
    operacion       ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    id_registro     VARCHAR(50) NOT NULL COMMENT 'PK del registro afectado',
    datos_anteriores JSON NULL COMMENT 'Valores ANTES del cambio (NULL en INSERT)',
    datos_nuevos     JSON NULL COMMENT 'Valores DESPUÉS del cambio (NULL en DELETE)',
    id_usuario      INT NULL COMMENT 'Usuario del sistema que ejecutó la acción',
    fecha_hora      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_origen       VARCHAR(45) NULL COMMENT 'IP de conexión (llenada por el backend opcionalmente)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_aud_tabla    ON auditoria(tabla_afectada);
CREATE INDEX idx_aud_fecha    ON auditoria(fecha_hora);
CREATE INDEX idx_aud_usuario  ON auditoria(id_usuario);
CREATE INDEX idx_aud_operacion ON auditoria(operacion);

-- ============================================================
-- TRIGGERS: PERSONA
-- ============================================================
DELIMITER $$

CREATE TRIGGER trg_persona_insert
AFTER INSERT ON persona FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos)
    VALUES ('persona', 'INSERT', NEW.id_persona, NULL, JSON_OBJECT(
        'id_persona', NEW.id_persona,
        'cedula', NEW.cedula,
        'nombre', NEW.nombre,
        'apellido', NEW.apellido,
        'fecha_nacimiento', NEW.fecha_nacimiento,
        'id_zona', NEW.id_zona,
        'id_condicion_especial', NEW.id_condicion_especial,
        'estado_vital', NEW.estado_vital
    ));
END$$

CREATE TRIGGER trg_persona_update
AFTER UPDATE ON persona FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos)
    VALUES ('persona', 'UPDATE', NEW.id_persona,
    JSON_OBJECT(
        'cedula', OLD.cedula,
        'nombre', OLD.nombre,
        'apellido', OLD.apellido,
        'fecha_nacimiento', OLD.fecha_nacimiento,
        'id_zona', OLD.id_zona,
        'id_condicion_especial', OLD.id_condicion_especial,
        'estado_vital', OLD.estado_vital,
        'fecha_defuncion', OLD.fecha_defuncion
    ),
    JSON_OBJECT(
        'cedula', NEW.cedula,
        'nombre', NEW.nombre,
        'apellido', NEW.apellido,
        'fecha_nacimiento', NEW.fecha_nacimiento,
        'id_zona', NEW.id_zona,
        'id_condicion_especial', NEW.id_condicion_especial,
        'estado_vital', NEW.estado_vital,
        'fecha_defuncion', NEW.fecha_defuncion
    ));
END$$

CREATE TRIGGER trg_persona_delete
BEFORE DELETE ON persona FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos)
    VALUES ('persona', 'DELETE', OLD.id_persona, JSON_OBJECT(
        'id_persona', OLD.id_persona,
        'cedula', OLD.cedula,
        'nombre', OLD.nombre,
        'apellido', OLD.apellido,
        'fecha_nacimiento', OLD.fecha_nacimiento,
        'id_zona', OLD.id_zona,
        'estado_vital', OLD.estado_vital
    ), NULL);
END$$

-- ============================================================
-- TRIGGERS: MULTA
-- ============================================================
CREATE TRIGGER trg_multa_insert
AFTER INSERT ON multa FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos)
    VALUES ('multa', 'INSERT', NEW.id_multa, NULL, JSON_OBJECT(
        'id_multa', NEW.id_multa,
        'id_persona', NEW.id_persona,
        'motivo_multa', NEW.motivo_multa,
        'monto', NEW.monto,
        'estado_pago', NEW.estado_pago,
        'fecha_emision', NEW.fecha_emision
    ));
END$$

CREATE TRIGGER trg_multa_update
AFTER UPDATE ON multa FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos)
    VALUES ('multa', 'UPDATE', NEW.id_multa,
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
    ));
END$$

CREATE TRIGGER trg_multa_delete
BEFORE DELETE ON multa FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos)
    VALUES ('multa', 'DELETE', OLD.id_multa, JSON_OBJECT(
        'id_multa', OLD.id_multa,
        'id_persona', OLD.id_persona,
        'motivo_multa', OLD.motivo_multa,
        'monto', OLD.monto,
        'estado_pago', OLD.estado_pago
    ), NULL);
END$$

-- ============================================================
-- TRIGGERS: CAJA_COMUNITARIA
-- ============================================================
CREATE TRIGGER trg_caja_insert
AFTER INSERT ON caja_comunitaria FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos)
    VALUES ('caja_comunitaria', 'INSERT', NEW.id_transaccion, NULL, JSON_OBJECT(
        'id_transaccion', NEW.id_transaccion,
        'numero_comprobante', NEW.numero_comprobante,
        'tipo_movimiento', NEW.tipo_movimiento,
        'concepto', NEW.concepto,
        'monto', NEW.monto,
        'id_multa', NEW.id_multa,
        'responsable_registro', NEW.responsable_registro
    ));
END$$

CREATE TRIGGER trg_caja_update
AFTER UPDATE ON caja_comunitaria FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos)
    VALUES ('caja_comunitaria', 'UPDATE', NEW.id_transaccion,
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
    ));
END$$

CREATE TRIGGER trg_caja_delete
BEFORE DELETE ON caja_comunitaria FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos)
    VALUES ('caja_comunitaria', 'DELETE', OLD.id_transaccion, JSON_OBJECT(
        'id_transaccion', OLD.id_transaccion,
        'numero_comprobante', OLD.numero_comprobante,
        'tipo_movimiento', OLD.tipo_movimiento,
        'concepto', OLD.concepto,
        'monto', OLD.monto,
        'responsable_registro', OLD.responsable_registro
    ), NULL);
END$$

-- ============================================================
-- TRIGGERS: MIEMBRO_DIRECTIVA
-- ============================================================
CREATE TRIGGER trg_directiva_insert
AFTER INSERT ON miembro_directiva FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos)
    VALUES ('miembro_directiva', 'INSERT', NEW.id_directiva, NULL, JSON_OBJECT(
        'id_directiva', NEW.id_directiva,
        'id_persona', NEW.id_persona,
        'id_cargo_directivo', NEW.id_cargo_directivo,
        'fecha_inicio', NEW.fecha_inicio,
        'fecha_fin', NEW.fecha_fin,
        'estado', NEW.estado
    ));
END$$

CREATE TRIGGER trg_directiva_update
AFTER UPDATE ON miembro_directiva FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos)
    VALUES ('miembro_directiva', 'UPDATE', NEW.id_directiva,
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
    ));
END$$

CREATE TRIGGER trg_directiva_delete
BEFORE DELETE ON miembro_directiva FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos)
    VALUES ('miembro_directiva', 'DELETE', OLD.id_directiva, JSON_OBJECT(
        'id_directiva', OLD.id_directiva,
        'id_persona', OLD.id_persona,
        'id_cargo_directivo', OLD.id_cargo_directivo,
        'fecha_inicio', OLD.fecha_inicio,
        'estado', OLD.estado
    ), NULL);
END$$

-- ============================================================
-- TRIGGERS: USUARIO_SISTEMA
-- ============================================================
CREATE TRIGGER trg_usuario_insert
AFTER INSERT ON usuario_sistema FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos)
    VALUES ('usuario_sistema', 'INSERT', NEW.id_usuario, NULL, JSON_OBJECT(
        'id_usuario', NEW.id_usuario,
        'id_persona', NEW.id_persona,
        'id_rol', NEW.id_rol,
        'username', NEW.username
        -- NOTA: password_hash y salt nunca se auditan por seguridad
    ));
END$$

CREATE TRIGGER trg_usuario_update
AFTER UPDATE ON usuario_sistema FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos)
    VALUES ('usuario_sistema', 'UPDATE', NEW.id_usuario,
    JSON_OBJECT(
        'id_persona', OLD.id_persona,
        'id_rol', OLD.id_rol,
        'username', OLD.username
    ),
    JSON_OBJECT(
        'id_persona', NEW.id_persona,
        'id_rol', NEW.id_rol,
        'username', NEW.username
    ));
END$$

CREATE TRIGGER trg_usuario_delete
BEFORE DELETE ON usuario_sistema FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos)
    VALUES ('usuario_sistema', 'DELETE', OLD.id_usuario, JSON_OBJECT(
        'id_usuario', OLD.id_usuario,
        'id_persona', OLD.id_persona,
        'id_rol', OLD.id_rol,
        'username', OLD.username
    ), NULL);
END$$

-- ============================================================
-- TRIGGERS: TERRENO
-- ============================================================
CREATE TRIGGER trg_terreno_insert
AFTER INSERT ON terreno FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos)
    VALUES ('terreno', 'INSERT', NEW.id_terreno, NULL, JSON_OBJECT(
        'id_terreno', NEW.id_terreno,
        'id_persona', NEW.id_persona,
        'clave_catastral', NEW.clave_catastral,
        'area_total', NEW.area_total,
        'id_estado_construccion', NEW.id_estado_construccion
    ));
END$$

CREATE TRIGGER trg_terreno_update
AFTER UPDATE ON terreno FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos)
    VALUES ('terreno', 'UPDATE', NEW.id_terreno,
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
    ));
END$$

CREATE TRIGGER trg_terreno_delete
BEFORE DELETE ON terreno FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos)
    VALUES ('terreno', 'DELETE', OLD.id_terreno, JSON_OBJECT(
        'id_terreno', OLD.id_terreno,
        'id_persona', OLD.id_persona,
        'clave_catastral', OLD.clave_catastral,
        'area_total', OLD.area_total,
        'id_estado_construccion', OLD.id_estado_construccion
    ), NULL);
END$$

DELIMITER ;

-- ============================================================
-- VERIFICACIÓN: ver triggers creados
-- ============================================================
SELECT TRIGGER_NAME, EVENT_MANIPULATION, EVENT_OBJECT_TABLE
FROM information_schema.TRIGGERS
WHERE TRIGGER_SCHEMA = DATABASE()
ORDER BY EVENT_OBJECT_TABLE, EVENT_MANIPULATION;