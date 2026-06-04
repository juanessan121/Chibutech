USE basechi;

-- 1. Actualizar Catálogo de Condiciones Especiales (Eliminando Viudez y añadiendo reales)
-- Desactivar llaves foráneas temporalmente si ya hay datos
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE Catalogo_Condicion_Especial;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO Catalogo_Condicion_Especial (nombre_condicion) VALUES 
('Discapacidad Física'), 
('Discapacidad Intelectual'), 
('Discapacidad Visual'), 
('Discapacidad Auditiva'), 
('Tercera Edad'), 
('Enfermedad Catastrófica');

-- 2. Llenar Zonas y Sectores
-- Limpiar tablas si se requiere ejecutar este script desde cero (opcional)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE Sector;
TRUNCATE TABLE Zona;
SET FOREIGN_KEY_CHECKS = 1;

-- Insertar Zonas
INSERT INTO Zona (nombre_zona, descripcion) VALUES 
('Zona Norte', 'Sector norte de la comunidad'),
('Zona Sur', 'Sector sur de la comunidad'),
('Zona Este', 'Sector este de la comunidad'),
('Zona Oeste', 'Sector oeste de la comunidad');

-- Insertar Sectores (Relacionados a las zonas)
-- ID 1 = Norte, ID 2 = Sur, ID 3 = Este, ID 4 = Oeste
INSERT INTO Sector (id_zona, nombre_sector, descripcion) VALUES 
-- Sectores Zona Norte
(1, 'San Luis', 'Sector norte'),
(1, 'San Francisco', 'Sector norte'),
(1, 'San Miguel', 'Sector norte'),
(1, 'La Magdalena', 'Sector norte'),
(1, 'El Calvario', 'Sector norte'),
-- Sectores Zona Sur
(2, 'San Antonio', 'Sector sur'),
(2, 'Santa Faz', 'Sector sur'),
(2, 'El Rosario', 'Sector sur'),
(2, 'La Merced', 'Sector sur'),
(2, 'Bellavista', 'Sector sur'),
-- Sectores Zona Este
(3, 'San Pedro', 'Sector este'),
(3, 'Santa Rosa', 'Sector este'),
(3, 'Las Orquídeas', 'Sector este'),
(3, 'El Mirador', 'Sector este'),
(3, 'Los Pinos', 'Sector este'),
-- Sectores Zona Oeste
(4, 'San Juan', 'Sector oeste'),
(4, 'La Esperanza', 'Sector oeste'),
(4, 'El Paraíso', 'Sector oeste'),
(4, 'Nueva Vida', 'Sector oeste'),
(4, 'Las Lomas', 'Sector oeste');
