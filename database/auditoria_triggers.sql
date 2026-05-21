-- -----------------------------------------------------
-- PARTE 10: BLOQUE DE TRIGGERS (28 EN TOTAL)
-- -----------------------------------------------------
DELIMITER $$

-- 10.1 PROTECCIÓN DEL ADMIN
CREATE TRIGGER trg_bloqueo_admin_delete
BEFORE DELETE ON Usuario_Sistema FOR EACH ROW
BEGIN
    IF OLD.id_usuario = 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Bloqueo crítico: No se puede eliminar al administrador principal.';
    END IF;
END$$

-- 10.2 AUDITORÍA: PERSONA
CREATE TRIGGER trg_persona_insert AFTER INSERT ON Persona FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Persona', 'INSERT', NEW.id_persona, NULL, JSON_OBJECT(
        'id_persona', NEW.id_persona, 'cedula', NEW.cedula, 'nombre', NEW.nombre, 'apellido', NEW.apellido,
        'id_genero', NEW.id_genero, 'id_zona', NEW.id_zona, 'id_condicion_especial', NEW.id_condicion_especial, 'estado_vital', NEW.estado_vital
    ), @id_usuario_actual);
END$$

CREATE TRIGGER trg_persona_update AFTER UPDATE ON Persona FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Persona', 'UPDATE', NEW.id_persona,
    JSON_OBJECT('cedula', OLD.cedula, 'nombre', OLD.nombre, 'apellido', OLD.apellido, 'id_genero', OLD.id_genero, 'id_zona', OLD.id_zona, 'estado_vital', OLD.estado_vital),
    JSON_OBJECT('cedula', NEW.cedula, 'nombre', NEW.nombre, 'apellido', NEW.apellido, 'id_genero', NEW.id_genero, 'id_zona', NEW.id_zona, 'estado_vital', NEW.estado_vital), 
    @id_usuario_actual);
END$$

CREATE TRIGGER trg_persona_delete BEFORE DELETE ON Persona FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Persona', 'DELETE', OLD.id_persona, JSON_OBJECT(
        'id_persona', OLD.id_persona, 'cedula', OLD.cedula, 'nombre', OLD.nombre, 'id_zona', OLD.id_zona
    ), NULL, @id_usuario_actual);
END$$

-- 10.3 AUDITORÍA: MULTA
CREATE TRIGGER trg_multa_insert AFTER INSERT ON Multa FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Multa', 'INSERT', NEW.id_multa, NULL, JSON_OBJECT(
        'id_multa', NEW.id_multa, 'id_persona', NEW.id_persona, 'monto', NEW.monto, 'estado_pago', NEW.estado_pago
    ), @id_usuario_actual);
END$$

CREATE TRIGGER trg_multa_update AFTER UPDATE ON Multa FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Multa', 'UPDATE', NEW.id_multa,
    JSON_OBJECT('monto', OLD.monto, 'estado_pago', OLD.estado_pago), JSON_OBJECT('monto', NEW.monto, 'estado_pago', NEW.estado_pago), @id_usuario_actual);
END$$

CREATE TRIGGER trg_multa_delete BEFORE DELETE ON Multa FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Multa', 'DELETE', OLD.id_multa, JSON_OBJECT('id_multa', OLD.id_multa, 'id_persona', OLD.id_persona, 'monto', OLD.monto), NULL, @id_usuario_actual);
END$$

-- 10.4 AUDITORÍA: CAJA_COMUNITARIA
CREATE TRIGGER trg_caja_insert AFTER INSERT ON Caja_Comunitaria FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Caja_Comunitaria', 'INSERT', NEW.id_transaccion, NULL, JSON_OBJECT(
        'id_transaccion', NEW.id_transaccion, 'tipo_movimiento', NEW.tipo_movimiento, 'monto', NEW.monto, 'id_planilla', NEW.id_planilla
    ), @id_usuario_actual);
END$$

CREATE TRIGGER trg_caja_update AFTER UPDATE ON Caja_Comunitaria FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Caja_Comunitaria', 'UPDATE', NEW.id_transaccion,
    JSON_OBJECT('tipo_movimiento', OLD.tipo_movimiento, 'monto', OLD.monto), JSON_OBJECT('tipo_movimiento', NEW.tipo_movimiento, 'monto', NEW.monto), @id_usuario_actual);
END$$

CREATE TRIGGER trg_caja_delete BEFORE DELETE ON Caja_Comunitaria FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Caja_Comunitaria', 'DELETE', OLD.id_transaccion, JSON_OBJECT('id_transaccion', OLD.id_transaccion, 'monto', OLD.monto), NULL, @id_usuario_actual);
END$$

-- 10.5 AUDITORÍA: MIEMBRO_DIRECTIVA
CREATE TRIGGER trg_directiva_insert AFTER INSERT ON Miembro_Directiva FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Miembro_Directiva', 'INSERT', NEW.id_directiva, NULL, JSON_OBJECT('id_directiva', NEW.id_directiva, 'id_persona', NEW.id_persona, 'id_cargo_directivo', NEW.id_cargo_directivo, 'estado', NEW.estado), @id_usuario_actual);
END$$

CREATE TRIGGER trg_directiva_update AFTER UPDATE ON Miembro_Directiva FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Miembro_Directiva', 'UPDATE', NEW.id_directiva, JSON_OBJECT('estado', OLD.estado), JSON_OBJECT('estado', NEW.estado), @id_usuario_actual);
END$$

CREATE TRIGGER trg_directiva_delete BEFORE DELETE ON Miembro_Directiva FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Miembro_Directiva', 'DELETE', OLD.id_directiva, JSON_OBJECT('id_directiva', OLD.id_directiva, 'id_persona', OLD.id_persona), NULL, @id_usuario_actual);
END$$

-- 10.6 AUDITORÍA: JEFE_ZONA
CREATE TRIGGER trg_jefe_zona_insert AFTER INSERT ON Jefe_Zona FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Jefe_Zona', 'INSERT', NEW.id_jefe_zona, NULL, JSON_OBJECT('id_jefe_zona', NEW.id_jefe_zona, 'id_zona', NEW.id_zona, 'id_persona', NEW.id_persona, 'estado', NEW.estado), @id_usuario_actual);
END$$

CREATE TRIGGER trg_jefe_zona_update AFTER UPDATE ON Jefe_Zona FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Jefe_Zona', 'UPDATE', NEW.id_jefe_zona, JSON_OBJECT('estado', OLD.estado), JSON_OBJECT('estado', NEW.estado), @id_usuario_actual);
END$$

CREATE TRIGGER trg_jefe_zona_delete BEFORE DELETE ON Jefe_Zona FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Jefe_Zona', 'DELETE', OLD.id_jefe_zona, JSON_OBJECT('id_jefe_zona', OLD.id_jefe_zona, 'id_zona', OLD.id_zona, 'id_persona', OLD.id_persona), NULL, @id_usuario_actual);
END$$

-- 10.7 AUDITORÍA: USUARIO_SISTEMA
CREATE TRIGGER trg_usuario_insert AFTER INSERT ON Usuario_Sistema FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Usuario_Sistema', 'INSERT', NEW.id_usuario, NULL, JSON_OBJECT('id_usuario', NEW.id_usuario, 'id_persona', NEW.id_persona, 'id_rol', NEW.id_rol, 'username', NEW.username), @id_usuario_actual);
END$$

CREATE TRIGGER trg_usuario_update AFTER UPDATE ON Usuario_Sistema FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Usuario_Sistema', 'UPDATE', NEW.id_usuario, JSON_OBJECT('id_rol', OLD.id_rol, 'username', OLD.username), JSON_OBJECT('id_rol', NEW.id_rol, 'username', NEW.username), @id_usuario_actual);
END$$

CREATE TRIGGER trg_usuario_delete BEFORE DELETE ON Usuario_Sistema FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Usuario_Sistema', 'DELETE', OLD.id_usuario, JSON_OBJECT('id_usuario', OLD.id_usuario, 'username', OLD.username), NULL, @id_usuario_actual);
END$$

-- 10.8 AUDITORÍA: TERRENO
CREATE TRIGGER trg_terreno_insert AFTER INSERT ON Terreno FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Terreno', 'INSERT', NEW.id_terreno, NULL, JSON_OBJECT('id_terreno', NEW.id_terreno, 'id_persona', NEW.id_persona, 'area_total', NEW.area_total), @id_usuario_actual);
END$$

CREATE TRIGGER trg_terreno_update AFTER UPDATE ON Terreno FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Terreno', 'UPDATE', NEW.id_terreno, JSON_OBJECT('area_total', OLD.area_total), JSON_OBJECT('area_total', NEW.area_total), @id_usuario_actual);
END$$

CREATE TRIGGER trg_terreno_delete BEFORE DELETE ON Terreno FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Terreno', 'DELETE', OLD.id_terreno, JSON_OBJECT('id_terreno', OLD.id_terreno, 'id_persona', OLD.id_persona, 'area_total', OLD.area_total), NULL, @id_usuario_actual);
END$$

-- 10.9 AUDITORÍA: PLANILLA CABECERA
CREATE TRIGGER trg_planillac_insert AFTER INSERT ON Planilla_Cabecera FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Planilla_Cabecera', 'INSERT', NEW.id_planilla, NULL, JSON_OBJECT('id_planilla', NEW.id_planilla, 'id_persona', NEW.id_persona, 'total_pagar', NEW.total_pagar, 'estado_pago', NEW.estado_pago), @id_usuario_actual);
END$$

CREATE TRIGGER trg_planillac_update AFTER UPDATE ON Planilla_Cabecera FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Planilla_Cabecera', 'UPDATE', NEW.id_planilla, JSON_OBJECT('total_pagar', OLD.total_pagar, 'estado_pago', OLD.estado_pago), JSON_OBJECT('total_pagar', NEW.total_pagar, 'estado_pago', NEW.estado_pago), @id_usuario_actual);
END$$

CREATE TRIGGER trg_planillac_delete BEFORE DELETE ON Planilla_Cabecera FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Planilla_Cabecera', 'DELETE', OLD.id_planilla, JSON_OBJECT('id_planilla', OLD.id_planilla, 'id_persona', OLD.id_persona, 'total_pagar', OLD.total_pagar), NULL, @id_usuario_actual);
END$$

-- 10.10 AUDITORÍA: PLANILLA DETALLE
CREATE TRIGGER trg_planillad_insert AFTER INSERT ON Planilla_Detalle_Terreno FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Planilla_Detalle_Terreno', 'INSERT', NEW.id_detalle, NULL, JSON_OBJECT('id_detalle', NEW.id_detalle, 'id_planilla', NEW.id_planilla, 'id_terreno', NEW.id_terreno, 'area_terreno_copia', NEW.area_terreno_copia, 'subtotal_calculado', NEW.subtotal_calculado), @id_usuario_actual);
END$$

CREATE TRIGGER trg_planillad_update AFTER UPDATE ON Planilla_Detalle_Terreno FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Planilla_Detalle_Terreno', 'UPDATE', NEW.id_detalle, JSON_OBJECT('area_terreno_copia', OLD.area_terreno_copia, 'subtotal_calculado', OLD.subtotal_calculado), JSON_OBJECT('area_terreno_copia', NEW.area_terreno_copia, 'subtotal_calculado', NEW.subtotal_calculado), @id_usuario_actual);
END$$

CREATE TRIGGER trg_planillad_delete BEFORE DELETE ON Planilla_Detalle_Terreno FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Planilla_Detalle_Terreno', 'DELETE', OLD.id_detalle, JSON_OBJECT('id_detalle', OLD.id_detalle, 'id_planilla', OLD.id_planilla, 'id_terreno', OLD.id_terreno, 'subtotal_calculado', OLD.subtotal_calculado), NULL, @id_usuario_actual);
END$$

DELIMITER ;