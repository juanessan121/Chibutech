
/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.6.25-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: basechi
-- ------------------------------------------------------
-- Server version	10.6.25-MariaDB-ubu2204

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Asignacion_Sector_Minga`
--

DROP TABLE IF EXISTS `Asignacion_Sector_Minga`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Asignacion_Sector_Minga` (
  `id_asignacion_sector` int(11) NOT NULL AUTO_INCREMENT,
  `id_minga` int(11) NOT NULL,
  `id_sector` int(11) NOT NULL,
  `id_actividad` int(11) NOT NULL,
  `valor_multa_grupo` decimal(8,2) DEFAULT NULL,
  PRIMARY KEY (`id_asignacion_sector`),
  KEY `fk_asig_sector_minga` (`id_minga`),
  KEY `fk_asig_sector_lugar` (`id_sector`),
  KEY `fk_asig_sector_actividad` (`id_actividad`),
  CONSTRAINT `fk_asig_sector_actividad` FOREIGN KEY (`id_actividad`) REFERENCES `Catalogo_Actividad_Minga` (`id_actividad`),
  CONSTRAINT `fk_asig_sector_lugar` FOREIGN KEY (`id_sector`) REFERENCES `Sector` (`id_sector`) ON DELETE CASCADE,
  CONSTRAINT `fk_asig_sector_minga` FOREIGN KEY (`id_minga`) REFERENCES `Minga` (`id_minga`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Asignacion_Sector_Minga`
--

LOCK TABLES `Asignacion_Sector_Minga` WRITE;
/*!40000 ALTER TABLE `Asignacion_Sector_Minga` DISABLE KEYS */;
INSERT INTO `Asignacion_Sector_Minga` VALUES (2,2,1,1,NULL),(3,2,2,1,NULL),(4,2,3,1,NULL),(5,2,4,1,NULL),(6,2,5,1,NULL),(7,2,6,1,NULL),(8,2,7,1,NULL),(9,2,8,1,NULL),(10,2,9,1,NULL),(11,2,10,1,NULL),(12,2,11,1,NULL),(13,2,12,1,NULL),(14,2,13,1,NULL),(15,2,14,1,NULL),(16,2,15,1,NULL),(17,2,16,1,NULL),(18,2,17,1,NULL),(19,2,18,1,NULL),(20,2,19,1,NULL),(21,2,20,1,NULL),(22,3,1,1,NULL),(23,3,2,1,NULL),(24,3,3,1,NULL),(25,3,4,1,NULL),(26,3,5,1,NULL),(27,3,6,1,NULL),(28,3,7,1,NULL),(29,3,8,1,NULL),(30,3,9,1,NULL),(31,3,10,1,NULL),(32,3,11,1,NULL),(33,3,12,1,NULL),(34,3,13,1,NULL),(35,3,14,1,NULL),(36,3,15,1,NULL),(37,3,16,1,NULL),(38,3,17,1,NULL),(39,3,18,1,NULL),(40,3,19,1,NULL),(41,3,20,1,NULL),(42,4,1,1,NULL),(43,4,2,1,NULL),(44,4,3,1,NULL),(45,4,4,1,NULL),(46,4,5,1,NULL),(47,4,6,1,NULL),(48,4,7,1,NULL),(49,4,8,1,NULL),(50,4,9,1,NULL),(51,4,10,1,NULL),(52,4,11,1,NULL),(53,4,12,1,NULL),(54,4,13,1,NULL),(55,4,14,1,NULL),(56,4,15,1,NULL),(57,4,16,1,NULL),(58,4,17,1,NULL),(59,4,18,1,NULL),(60,4,19,1,NULL),(61,4,20,1,NULL),(62,5,21,1,NULL),(63,5,11,1,NULL),(64,5,12,1,NULL),(65,5,13,1,NULL),(66,5,14,1,NULL),(67,5,15,1,NULL),(68,5,1,1,NULL),(69,5,2,1,NULL),(70,5,3,1,NULL),(71,5,4,1,NULL),(72,5,5,1,NULL),(73,5,16,1,NULL),(74,5,17,1,NULL),(75,5,18,1,NULL),(76,5,19,1,NULL),(77,5,20,1,NULL),(78,5,6,1,NULL),(79,5,7,1,NULL),(80,5,8,1,NULL),(81,5,9,1,NULL),(82,5,10,1,NULL),(83,6,1,1,NULL),(84,6,5,1,NULL),(85,6,16,1,NULL),(86,6,18,1,NULL),(87,6,6,1,NULL);
/*!40000 ALTER TABLE `Asignacion_Sector_Minga` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Asistencia_Minga`
--

DROP TABLE IF EXISTS `Asistencia_Minga`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Asistencia_Minga` (
  `id_asistencia` int(11) NOT NULL AUTO_INCREMENT,
  `id_minga` int(11) NOT NULL,
  `id_persona` int(11) NOT NULL,
  `id_actividad_especifica` int(11) DEFAULT NULL,
  `id_estado_asistencia` int(11) NOT NULL,
  `observacion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_asistencia`),
  UNIQUE KEY `idx_minga_persona` (`id_minga`,`id_persona`),
  KEY `fk_asistencia_actividad` (`id_actividad_especifica`),
  KEY `fk_asistencia_estado` (`id_estado_asistencia`),
  KEY `idx_asistencia_control` (`id_minga`,`id_estado_asistencia`),
  KEY `idx_asistencia_minga_estado` (`id_minga`,`id_estado_asistencia`),
  KEY `idx_asistencia_persona` (`id_persona`),
  CONSTRAINT `fk_asistencia_actividad` FOREIGN KEY (`id_actividad_especifica`) REFERENCES `Catalogo_Actividad_Minga` (`id_actividad`) ON DELETE SET NULL,
  CONSTRAINT `fk_asistencia_estado` FOREIGN KEY (`id_estado_asistencia`) REFERENCES `Catalogo_Estado_Asistencia` (`id_estado_asistencia`),
  CONSTRAINT `fk_asistencia_minga` FOREIGN KEY (`id_minga`) REFERENCES `Minga` (`id_minga`) ON DELETE CASCADE,
  CONSTRAINT `fk_asistencia_persona` FOREIGN KEY (`id_persona`) REFERENCES `Persona` (`id_persona`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Asistencia_Minga`
--

LOCK TABLES `Asistencia_Minga` WRITE;
/*!40000 ALTER TABLE `Asistencia_Minga` DISABLE KEYS */;
INSERT INTO `Asistencia_Minga` VALUES (1,2,1,NULL,3,NULL),(3,2,9,NULL,2,NULL),(5,2,7,NULL,2,NULL),(7,2,5,NULL,3,NULL),(8,2,11,NULL,3,NULL),(10,2,13,NULL,2,NULL),(12,2,3,NULL,2,NULL),(15,2,15,NULL,3,NULL),(17,3,1,NULL,2,NULL),(18,3,9,NULL,2,NULL),(19,3,7,NULL,3,NULL),(20,3,5,NULL,3,NULL),(21,3,11,NULL,2,NULL),(22,3,17,NULL,3,NULL),(23,3,13,NULL,3,NULL),(24,3,3,NULL,3,NULL),(25,3,15,NULL,2,NULL),(26,4,9,NULL,2,NULL),(27,4,7,NULL,3,NULL),(28,4,21,NULL,3,NULL),(29,4,5,NULL,3,NULL),(30,4,11,NULL,1,NULL),(31,4,17,NULL,2,NULL),(32,4,20,NULL,2,NULL),(33,4,13,NULL,2,NULL),(34,4,1,NULL,2,NULL),(35,4,3,NULL,2,NULL),(36,4,15,NULL,2,NULL),(37,5,9,NULL,2,NULL),(38,5,7,NULL,2,NULL),(39,5,21,NULL,2,NULL),(40,5,5,NULL,2,NULL),(41,5,11,NULL,2,NULL),(42,5,17,NULL,2,NULL),(43,5,20,NULL,2,NULL),(44,5,13,NULL,2,NULL),(45,5,23,NULL,3,NULL),(46,5,1,NULL,2,NULL),(47,5,22,NULL,2,NULL),(48,5,3,NULL,2,NULL),(49,5,15,NULL,2,NULL);
/*!40000 ALTER TABLE `Asistencia_Minga` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Auditoria`
--

DROP TABLE IF EXISTS `Auditoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Auditoria` (
  `id_auditoria` bigint(20) NOT NULL AUTO_INCREMENT,
  `tabla_afectada` varchar(100) NOT NULL,
  `operacion` enum('INSERT','UPDATE','DELETE') NOT NULL,
  `id_registro` varchar(50) NOT NULL,
  `datos_anteriores` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`datos_anteriores`)),
  `datos_nuevos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`datos_nuevos`)),
  `id_usuario` int(11) DEFAULT NULL,
  `fecha_hora` datetime NOT NULL DEFAULT current_timestamp(),
  `ip_origen` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_auditoria`),
  KEY `idx_aud_tabla` (`tabla_afectada`),
  KEY `idx_aud_fecha` (`fecha_hora`),
  KEY `idx_aud_usuario` (`id_usuario`),
  KEY `idx_aud_operacion` (`operacion`)
) ENGINE=InnoDB AUTO_INCREMENT=214 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Auditoria`
--

LOCK TABLES `Auditoria` WRITE;
/*!40000 ALTER TABLE `Auditoria` DISABLE KEYS */;
INSERT INTO `Auditoria` VALUES (1,'Persona','INSERT','1',NULL,'{\"id_persona\": 1, \"cedula\": \"1801119197\", \"nombre\": \"Pepito Ernesto\", \"apellido\": \"Perez Jerez\", \"id_genero\": 1, \"id_sector\": null, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-03 20:28:53',NULL),(2,'Persona','UPDATE','1','{\"cedula\": \"1801119197\", \"nombre\": \"Pepito Ernesto\", \"apellido\": \"Perez Jerez\", \"id_genero\": 1, \"id_sector\": null, \"estado_vital\": \"Vivo\"}','{\"cedula\": \"1801119197\", \"nombre\": \"Pepito Ernesto\", \"apellido\": \"Perez Jerez\", \"id_genero\": 1, \"id_sector\": 1, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-03 21:01:43',NULL),(3,'Terreno','INSERT','1',NULL,'{\"id_terreno\": 1, \"id_persona\": 1, \"area_total\": 5000.00}',NULL,'2026-06-03 21:30:07',NULL),(4,'Terreno','UPDATE','1','{\"area_total\": 5000.00}','{\"area_total\": 5000.00}',NULL,'2026-06-03 22:01:45',NULL),(5,'Terreno','UPDATE','1','{\"id_terreno\":1,\"id_persona\":1,\"clave_catastral\":\"18-08-57-44-545-545\",\"latitud\":\"-1.33160300\",\"longitud\":\"-78.54504100\",\"url_planimetria\":null,\"peso_archivo_bytes\":null,\"area_total\":\"5000.00\",\"id_estado_construccion\":1}','{\"area_total\":5000,\"id_estado_construccion\":1,\"latitud\":-1.331603,\"longitud\":-78.545041}',1,'2026-06-03 22:01:45',NULL),(6,'Terreno','UPDATE','1','{\"area_total\": 5000.00}','{\"area_total\": 5000.00}',NULL,'2026-06-04 03:03:23',NULL),(7,'Terreno','UPDATE','1','{\"id_terreno\":1,\"id_persona\":1,\"clave_catastral\":\"18-08-57-44-545-545\",\"latitud\":\"-1.33160300\",\"longitud\":\"-78.54504100\",\"url_planimetria\":null,\"peso_archivo_bytes\":null,\"area_total\":\"5000.00\",\"id_estado_construccion\":1}','{\"area_total\":5000,\"id_estado_construccion\":2,\"latitud\":-1.331603,\"longitud\":-78.545041}',1,'2026-06-04 03:03:23',NULL),(8,'Planilla_Cabecera','INSERT','1',NULL,'{\"id_planilla\": 1, \"id_persona\": 1, \"total_pagar\": 25.00, \"estado_pago\": \"Pendiente\"}',NULL,'2026-06-04 03:39:00',NULL),(9,'Planilla_Cabecera','INSERT','2',NULL,'{\"id_planilla\": 2, \"id_persona\": 1, \"total_pagar\": 25.00, \"estado_pago\": \"Pendiente\"}',NULL,'2026-06-04 03:39:49',NULL),(10,'Planilla_Detalle_Terreno','INSERT','1',NULL,'{\"id_detalle\": 1, \"id_planilla\": 2, \"id_terreno\": 1, \"area_terreno_copia\": 5000.00, \"subtotal_calculado\": 25.00}',NULL,'2026-06-04 03:39:49',NULL),(11,'Planilla_Cabecera','INSERT','3',NULL,'{\"id_planilla\": 3, \"id_persona\": 1, \"total_pagar\": 25.00, \"estado_pago\": \"Pendiente\"}',NULL,'2026-06-04 03:40:50',NULL),(12,'Planilla_Detalle_Terreno','INSERT','2',NULL,'{\"id_detalle\": 2, \"id_planilla\": 3, \"id_terreno\": 1, \"area_terreno_copia\": 5000.00, \"subtotal_calculado\": 25.00}',NULL,'2026-06-04 03:40:50',NULL),(13,'Planilla_Cabecera','INSERT','4',NULL,'{\"id_planilla\": 4, \"id_persona\": 1, \"total_pagar\": 25.00, \"estado_pago\": \"Pendiente\"}',NULL,'2026-06-04 03:47:42',NULL),(14,'Planilla_Detalle_Terreno','INSERT','3',NULL,'{\"id_detalle\": 3, \"id_planilla\": 4, \"id_terreno\": 1, \"area_terreno_copia\": 5000.00, \"subtotal_calculado\": 25.00}',NULL,'2026-06-04 03:47:42',NULL),(18,'Usuario_Sistema','INSERT','1',NULL,'{\"id_usuario\": 1, \"id_persona\": 1, \"id_rol\": 1, \"username\": \"admin\"}',NULL,'2026-06-04 03:51:54',NULL),(19,'Planilla_Cabecera','UPDATE','4','{\"total_pagar\": 25.00, \"estado_pago\": \"Pendiente\"}','{\"total_pagar\": 25.00, \"estado_pago\": \"Pagada\"}',NULL,'2026-06-04 03:52:36',NULL),(20,'Caja_Comunitaria','INSERT','3',NULL,'{\"id_transaccion\": 3, \"tipo_movimiento\": \"Ingreso\", \"monto\": 25.00, \"id_planilla\": 4}',NULL,'2026-06-04 03:52:36',NULL),(21,'Multa','INSERT','1',NULL,'{\"id_multa\": 1, \"id_persona\": 1, \"monto\": 100.00, \"estado_pago\": \"Pendiente\"}',NULL,'2026-06-04 03:54:36',NULL),(22,'Planilla_Detalle_Terreno','DELETE','1','{\"id_detalle\": 1, \"id_planilla\": 2, \"id_terreno\": 1, \"subtotal_calculado\": 25.00}',NULL,NULL,'2026-06-04 03:57:18',NULL),(23,'Planilla_Detalle_Terreno','DELETE','2','{\"id_detalle\": 2, \"id_planilla\": 3, \"id_terreno\": 1, \"subtotal_calculado\": 25.00}',NULL,NULL,'2026-06-04 03:57:18',NULL),(24,'Planilla_Cabecera','DELETE','2','{\"id_planilla\": 2, \"id_persona\": 1, \"total_pagar\": 25.00}',NULL,NULL,'2026-06-04 03:57:18',NULL),(25,'Planilla_Cabecera','DELETE','3','{\"id_planilla\": 3, \"id_persona\": 1, \"total_pagar\": 25.00}',NULL,NULL,'2026-06-04 03:57:18',NULL),(29,'Multa','UPDATE','1','{\"monto\": 100.00, \"estado_pago\": \"Pendiente\"}','{\"monto\": 100.00, \"estado_pago\": \"Pagada\"}',NULL,'2026-06-04 04:11:50',NULL),(30,'Caja_Comunitaria','INSERT','6',NULL,'{\"id_transaccion\": 6, \"tipo_movimiento\": \"Ingreso\", \"monto\": 100.00, \"id_planilla\": null}',NULL,'2026-06-04 04:11:51',NULL),(31,'Planilla_Cabecera','UPDATE','1','{\"total_pagar\": 25.00, \"estado_pago\": \"Pendiente\"}','{\"total_pagar\": 25.00, \"estado_pago\": \"Pagada\"}',NULL,'2026-06-04 04:11:51',NULL),(32,'Caja_Comunitaria','INSERT','7',NULL,'{\"id_transaccion\": 7, \"tipo_movimiento\": \"Ingreso\", \"monto\": 25.00, \"id_planilla\": 1}',NULL,'2026-06-04 04:11:51',NULL),(34,'Persona','INSERT','3',NULL,'{\"id_persona\": 3, \"cedula\": \"1804632030\", \"nombre\": \"Braulio Andrés\", \"apellido\": \"Silva Toaza\", \"id_genero\": 1, \"id_sector\": 1, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 05:11:55',NULL),(35,'Persona','INSERT','4',NULL,'{\"id_persona\": 4, \"cedula\": \"0000000001\", \"nombre\": \"Hijo de Braulio\", \"apellido\": \"Silva Toaza\", \"id_genero\": 1, \"id_sector\": null, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 05:11:55',NULL),(36,'Terreno','INSERT','2',NULL,'{\"id_terreno\": 2, \"id_persona\": 3, \"area_total\": 250.50}',NULL,'2026-06-04 05:11:55',NULL),(37,'Persona','INSERT','5',NULL,'{\"id_persona\": 5, \"cedula\": \"1850661651\", \"nombre\": \"Dilón Marcelo\", \"apellido\": \"Lagua Poma\", \"id_genero\": 1, \"id_sector\": 1, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 05:11:55',NULL),(38,'Persona','INSERT','6',NULL,'{\"id_persona\": 6, \"cedula\": \"0000000002\", \"nombre\": \"Hijo de Dilón\", \"apellido\": \"Lagua Poma\", \"id_genero\": 1, \"id_sector\": null, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 05:11:55',NULL),(39,'Terreno','INSERT','3',NULL,'{\"id_terreno\": 3, \"id_persona\": 5, \"area_total\": 260.50}',NULL,'2026-06-04 05:11:55',NULL),(40,'Persona','INSERT','7',NULL,'{\"id_persona\": 7, \"cedula\": \"1805637202\", \"nombre\": \"Victor Hugo\", \"apellido\": \"Toasa Pérez\", \"id_genero\": 1, \"id_sector\": 1, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 05:11:55',NULL),(41,'Persona','INSERT','8',NULL,'{\"id_persona\": 8, \"cedula\": \"0000000003\", \"nombre\": \"Hijo de Victor\", \"apellido\": \"Toasa Pérez\", \"id_genero\": 1, \"id_sector\": null, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 05:11:55',NULL),(42,'Terreno','INSERT','4',NULL,'{\"id_terreno\": 4, \"id_persona\": 7, \"area_total\": 270.50}',NULL,'2026-06-04 05:11:55',NULL),(43,'Persona','INSERT','9',NULL,'{\"id_persona\": 9, \"cedula\": \"1851867026\", \"nombre\": \"Alejandro Luis\", \"apellido\": \"Sutherland Gómez\", \"id_genero\": 1, \"id_sector\": 1, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 05:11:55',NULL),(44,'Persona','INSERT','10',NULL,'{\"id_persona\": 10, \"cedula\": \"0000000004\", \"nombre\": \"Hijo de Alejandro\", \"apellido\": \"Sutherland Gómez\", \"id_genero\": 1, \"id_sector\": null, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 05:11:55',NULL),(45,'Terreno','INSERT','5',NULL,'{\"id_terreno\": 5, \"id_persona\": 9, \"area_total\": 280.50}',NULL,'2026-06-04 05:11:55',NULL),(46,'Persona','INSERT','11',NULL,'{\"id_persona\": 11, \"cedula\": \"1850339944\", \"nombre\": \"Paúl Fernando\", \"apellido\": \"Sánchez Vega\", \"id_genero\": 1, \"id_sector\": 1, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 05:11:55',NULL),(47,'Persona','INSERT','12',NULL,'{\"id_persona\": 12, \"cedula\": \"0000000005\", \"nombre\": \"Hijo de Paúl\", \"apellido\": \"Sánchez Vega\", \"id_genero\": 1, \"id_sector\": null, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 05:11:55',NULL),(48,'Terreno','INSERT','6',NULL,'{\"id_terreno\": 6, \"id_persona\": 11, \"area_total\": 290.50}',NULL,'2026-06-04 05:11:55',NULL),(49,'Persona','INSERT','13',NULL,'{\"id_persona\": 13, \"cedula\": \"1851025104\", \"nombre\": \"Esteban Javier\", \"apellido\": \"Ruiz Morales\", \"id_genero\": 1, \"id_sector\": 1, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 05:11:55',NULL),(50,'Persona','INSERT','14',NULL,'{\"id_persona\": 14, \"cedula\": \"0000000006\", \"nombre\": \"Hijo de Esteban\", \"apellido\": \"Ruiz Morales\", \"id_genero\": 1, \"id_sector\": null, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 05:11:55',NULL),(51,'Terreno','INSERT','7',NULL,'{\"id_terreno\": 7, \"id_persona\": 13, \"area_total\": 300.50}',NULL,'2026-06-04 05:11:55',NULL),(52,'Persona','INSERT','15',NULL,'{\"id_persona\": 15, \"cedula\": \"1805756663\", \"nombre\": \"Gabriel Enrique\", \"apellido\": \"Ramos Cruz\", \"id_genero\": 1, \"id_sector\": 1, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 05:11:55',NULL),(53,'Persona','INSERT','16',NULL,'{\"id_persona\": 16, \"cedula\": \"0000000007\", \"nombre\": \"Hijo de Gabriel\", \"apellido\": \"Ramos Cruz\", \"id_genero\": 1, \"id_sector\": null, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 05:11:55',NULL),(54,'Terreno','INSERT','8',NULL,'{\"id_terreno\": 8, \"id_persona\": 15, \"area_total\": 310.50}',NULL,'2026-06-04 05:11:55',NULL),(55,'Persona','UPDATE','3','{\"cedula\": \"1804632030\", \"nombre\": \"Braulio Andrés\", \"apellido\": \"Silva Toaza\", \"id_genero\": 1, \"id_sector\": 1, \"estado_vital\": \"Vivo\"}','{\"cedula\": \"1804632030\", \"nombre\": \"Braulio Andrés\", \"apellido\": \"Silva Toaza\", \"id_genero\": 1, \"id_sector\": 3, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 05:14:17',NULL),(56,'Persona','UPDATE','1','{\"cedula\": \"1801119197\", \"nombre\": \"Pepito Ernesto\", \"apellido\": \"Perez Jerez\", \"id_genero\": 1, \"id_sector\": 1, \"estado_vital\": \"Vivo\"}','{\"cedula\": \"1801119197\", \"nombre\": \"Pepito Ernesto\", \"apellido\": \"Perez Jerez\", \"id_genero\": 1, \"id_sector\": 5, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 05:17:38',NULL),(57,'Persona','UPDATE','4','{\"cedula\": \"0000000001\", \"nombre\": \"Hijo de Braulio\", \"apellido\": \"Silva Toaza\", \"id_genero\": 1, \"id_sector\": null, \"estado_vital\": \"Vivo\"}','{\"cedula\": \"2200023659\", \"nombre\": \"Hijo de Braulio\", \"apellido\": \"Silva Toaza\", \"id_genero\": 1, \"id_sector\": null, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 05:19:07',NULL),(58,'Persona','UPDATE','5','{\"cedula\": \"1850661651\", \"nombre\": \"Dilón Marcelo\", \"apellido\": \"Lagua Poma\", \"id_genero\": 1, \"id_sector\": 1, \"estado_vital\": \"Vivo\"}','{\"cedula\": \"1850661651\", \"nombre\": \"Dilón Marcelo\", \"apellido\": \"Lagua Poma\", \"id_genero\": 1, \"id_sector\": 15, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 05:20:09',NULL),(59,'Persona','UPDATE','6','{\"cedula\": \"0000000002\", \"nombre\": \"Hijo de Dilón\", \"apellido\": \"Lagua Poma\", \"id_genero\": 1, \"id_sector\": null, \"estado_vital\": \"Vivo\"}','{\"cedula\": \"1851053957\", \"nombre\": \"Hijo de Dilón\", \"apellido\": \"Lagua Poma\", \"id_genero\": 1, \"id_sector\": null, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 05:20:09',NULL),(60,'Persona','UPDATE','7','{\"cedula\": \"1805637202\", \"nombre\": \"Victor Hugo\", \"apellido\": \"Toasa Pérez\", \"id_genero\": 1, \"id_sector\": 1, \"estado_vital\": \"Vivo\"}','{\"cedula\": \"1805637202\", \"nombre\": \"Victor Hugo\", \"apellido\": \"Toasa Pérez\", \"id_genero\": 1, \"id_sector\": 8, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 05:21:00',NULL),(61,'Persona','UPDATE','8','{\"cedula\": \"0000000003\", \"nombre\": \"Hijo de Victor\", \"apellido\": \"Toasa Pérez\", \"id_genero\": 1, \"id_sector\": null, \"estado_vital\": \"Vivo\"}','{\"cedula\": \"1709596793\", \"nombre\": \"Hijo de Victor\", \"apellido\": \"Toasa Pérez\", \"id_genero\": 1, \"id_sector\": null, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 05:21:00',NULL),(62,'Persona','UPDATE','9','{\"cedula\": \"1851867026\", \"nombre\": \"Alejandro Luis\", \"apellido\": \"Sutherland Gómez\", \"id_genero\": 1, \"id_sector\": 1, \"estado_vital\": \"Vivo\"}','{\"cedula\": \"1851867026\", \"nombre\": \"Alejandro Luis\", \"apellido\": \"Sutherland Gómez\", \"id_genero\": 1, \"id_sector\": 14, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 05:22:43',NULL),(63,'Persona','UPDATE','10','{\"cedula\": \"0000000004\", \"nombre\": \"Hijo de Alejandro\", \"apellido\": \"Sutherland Gómez\", \"id_genero\": 1, \"id_sector\": null, \"estado_vital\": \"Vivo\"}','{\"cedula\": \"1800461871\", \"nombre\": \"Hijo de Alejandro\", \"apellido\": \"Sutherland Gómez\", \"id_genero\": 1, \"id_sector\": null, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 05:22:43',NULL),(64,'Persona','UPDATE','11','{\"cedula\": \"1850339944\", \"nombre\": \"Paúl Fernando\", \"apellido\": \"Sánchez Vega\", \"id_genero\": 1, \"id_sector\": 1, \"estado_vital\": \"Vivo\"}','{\"cedula\": \"1850339944\", \"nombre\": \"Paúl Fernando\", \"apellido\": \"Sánchez Vega\", \"id_genero\": 1, \"id_sector\": 19, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 05:23:39',NULL),(65,'Persona','UPDATE','12','{\"cedula\": \"0000000005\", \"nombre\": \"Hijo de Paúl\", \"apellido\": \"Sánchez Vega\", \"id_genero\": 1, \"id_sector\": null, \"estado_vital\": \"Vivo\"}','{\"cedula\": \"1729638302\", \"nombre\": \"Hijo de Paúl\", \"apellido\": \"Sánchez Vega\", \"id_genero\": 1, \"id_sector\": null, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 05:23:39',NULL),(66,'Persona','UPDATE','14','{\"cedula\": \"0000000006\", \"nombre\": \"Hijo de Esteban\", \"apellido\": \"Ruiz Morales\", \"id_genero\": 1, \"id_sector\": null, \"estado_vital\": \"Vivo\"}','{\"cedula\": \"1850460047\", \"nombre\": \"Hijo de Esteban\", \"apellido\": \"Ruiz Morales\", \"id_genero\": 1, \"id_sector\": null, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 05:24:25',NULL),(67,'Persona','UPDATE','15','{\"cedula\": \"1805756663\", \"nombre\": \"Gabriel Enrique\", \"apellido\": \"Ramos Cruz\", \"id_genero\": 1, \"id_sector\": 1, \"estado_vital\": \"Vivo\"}','{\"cedula\": \"1805756663\", \"nombre\": \"Gabriel Enrique\", \"apellido\": \"Ramos Cruz\", \"id_genero\": 1, \"id_sector\": 12, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 05:26:07',NULL),(68,'Persona','UPDATE','16','{\"cedula\": \"0000000007\", \"nombre\": \"Hijo de Gabriel\", \"apellido\": \"Ramos Cruz\", \"id_genero\": 1, \"id_sector\": null, \"estado_vital\": \"Vivo\"}','{\"cedula\": \"1850441146\", \"nombre\": \"Hijo de Gabriel\", \"apellido\": \"Ramos Cruz\", \"id_genero\": 1, \"id_sector\": null, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 05:26:07',NULL),(69,'Terreno','UPDATE','2','{\"area_total\": 250.50}','{\"area_total\": 5250.49}',NULL,'2026-06-04 05:29:37',NULL),(70,'Terreno','UPDATE','2','{\"id_terreno\":2,\"id_persona\":3,\"clave_catastral\":\"SEC-01-001\",\"latitud\":\"-1.24000000\",\"longitud\":\"-78.62000000\",\"url_planimetria\":null,\"peso_archivo_bytes\":null,\"area_total\":\"250.50\",\"id_estado_construccion\":1}','{\"area_total\":5250.49,\"id_estado_construccion\":1,\"latitud\":-1.24,\"longitud\":-78.62}',1,'2026-06-04 05:29:37',NULL),(71,'Terreno','UPDATE','8','{\"area_total\": 310.50}','{\"area_total\": 8310.50}',NULL,'2026-06-04 05:30:18',NULL),(72,'Terreno','UPDATE','8','{\"id_terreno\":8,\"id_persona\":15,\"clave_catastral\":\"SEC-01-007\",\"latitud\":\"-1.23400000\",\"longitud\":\"-78.61400000\",\"url_planimetria\":null,\"peso_archivo_bytes\":null,\"area_total\":\"310.50\",\"id_estado_construccion\":1}','{\"area_total\":8310.5,\"id_estado_construccion\":1,\"latitud\":-1.234,\"longitud\":-78.614}',1,'2026-06-04 05:30:18',NULL),(73,'Terreno','UPDATE','4','{\"area_total\": 270.50}','{\"area_total\": 7270.50}',NULL,'2026-06-04 05:31:33',NULL),(74,'Terreno','UPDATE','4','{\"id_terreno\":4,\"id_persona\":7,\"clave_catastral\":\"SEC-01-003\",\"latitud\":\"-1.23800000\",\"longitud\":\"-78.61800000\",\"url_planimetria\":null,\"peso_archivo_bytes\":null,\"area_total\":\"270.50\",\"id_estado_construccion\":1}','{\"area_total\":7270.5,\"id_estado_construccion\":1,\"latitud\":-1.238,\"longitud\":-78.618}',1,'2026-06-04 05:31:33',NULL),(75,'Terreno','UPDATE','5','{\"area_total\": 280.50}','{\"area_total\": 55280.50}',NULL,'2026-06-04 05:32:34',NULL),(76,'Terreno','UPDATE','5','{\"id_terreno\":5,\"id_persona\":9,\"clave_catastral\":\"SEC-01-004\",\"latitud\":\"-1.23700000\",\"longitud\":\"-78.61700000\",\"url_planimetria\":null,\"peso_archivo_bytes\":null,\"area_total\":\"280.50\",\"id_estado_construccion\":1}','{\"area_total\":55280.5,\"id_estado_construccion\":3,\"latitud\":-1.237,\"longitud\":-78.617}',1,'2026-06-04 05:32:34',NULL),(77,'Terreno','UPDATE','7','{\"area_total\": 300.50}','{\"area_total\": 77300.50}',NULL,'2026-06-04 05:33:24',NULL),(78,'Terreno','UPDATE','7','{\"id_terreno\":7,\"id_persona\":13,\"clave_catastral\":\"SEC-01-006\",\"latitud\":\"-1.23500000\",\"longitud\":\"-78.61500000\",\"url_planimetria\":null,\"peso_archivo_bytes\":null,\"area_total\":\"300.50\",\"id_estado_construccion\":1}','{\"area_total\":77300.5,\"id_estado_construccion\":1,\"latitud\":-1.235,\"longitud\":-78.615}',1,'2026-06-04 05:33:24',NULL),(79,'Multa','INSERT','2',NULL,'{\"id_multa\": 2, \"id_persona\": 9, \"monto\": 110.10, \"estado_pago\": \"Pendiente\"}',NULL,'2026-06-04 05:36:57',NULL),(80,'Multa','UPDATE','2','{\"monto\": 110.10, \"estado_pago\": \"Pendiente\"}','{\"monto\": 110.10, \"estado_pago\": \"Pagada\"}',NULL,'2026-06-04 05:37:58',NULL),(81,'Caja_Comunitaria','INSERT','8',NULL,'{\"id_transaccion\": 8, \"tipo_movimiento\": \"Ingreso\", \"monto\": 110.10, \"id_planilla\": null}',NULL,'2026-06-04 05:37:58',NULL),(82,'Caja_Comunitaria','INSERT','9',NULL,'{\"id_transaccion\": 9, \"tipo_movimiento\": \"Egreso\", \"monto\": 50.00, \"id_planilla\": null}',NULL,'2026-06-04 05:41:03',NULL),(90,'Miembro_Directiva','INSERT','10',NULL,'{\"id_directiva\": 10, \"id_persona\": 1, \"id_cargo_directivo\": 1, \"estado\": \"Activo\"}',NULL,'2026-06-04 06:25:51',NULL),(91,'Miembro_Directiva','INSERT','11',NULL,'{\"id_directiva\": 11, \"id_persona\": 3, \"id_cargo_directivo\": 2, \"estado\": \"Activo\"}',NULL,'2026-06-04 06:25:51',NULL),(92,'Miembro_Directiva','INSERT','12',NULL,'{\"id_directiva\": 12, \"id_persona\": 13, \"id_cargo_directivo\": 3, \"estado\": \"Activo\"}',NULL,'2026-06-04 06:25:51',NULL),(93,'Miembro_Directiva','INSERT','13',NULL,'{\"id_directiva\": 13, \"id_persona\": 5, \"id_cargo_directivo\": 4, \"estado\": \"Activo\"}',NULL,'2026-06-04 06:25:51',NULL),(94,'Miembro_Directiva','INSERT','14',NULL,'{\"id_directiva\": 14, \"id_persona\": 15, \"id_cargo_directivo\": 5, \"estado\": \"Activo\"}',NULL,'2026-06-04 06:25:51',NULL),(95,'Miembro_Directiva','INSERT','15',NULL,'{\"id_directiva\": 15, \"id_persona\": 9, \"id_cargo_directivo\": 6, \"estado\": \"Activo\"}',NULL,'2026-06-04 06:25:51',NULL),(96,'Miembro_Directiva','INSERT','16',NULL,'{\"id_directiva\": 16, \"id_persona\": 11, \"id_cargo_directivo\": 7, \"estado\": \"Activo\"}',NULL,'2026-06-04 06:25:51',NULL),(97,'Miembro_Directiva','INSERT','17',NULL,'{\"id_directiva\": 17, \"id_persona\": 7, \"id_cargo_directivo\": 8, \"estado\": \"Activo\"}',NULL,'2026-06-04 06:25:51',NULL),(98,'Miembro_Directiva','INSERT','18',NULL,'{\"id_directiva\": 18, \"id_persona\": 3, \"id_cargo_directivo\": 9, \"estado\": \"Activo\"}',NULL,'2026-06-04 06:25:51',NULL),(99,'Multa','INSERT','3',NULL,'{\"id_multa\": 3, \"id_persona\": 1, \"monto\": 120.00, \"estado_pago\": \"Pendiente\"}',NULL,'2026-06-04 06:43:28',NULL),(100,'Multa','INSERT','4',NULL,'{\"id_multa\": 4, \"id_persona\": 5, \"monto\": 120.00, \"estado_pago\": \"Pendiente\"}',NULL,'2026-06-04 06:43:28',NULL),(101,'Multa','INSERT','5',NULL,'{\"id_multa\": 5, \"id_persona\": 11, \"monto\": 120.00, \"estado_pago\": \"Pendiente\"}',NULL,'2026-06-04 06:43:28',NULL),(102,'Multa','INSERT','6',NULL,'{\"id_multa\": 6, \"id_persona\": 15, \"monto\": 120.00, \"estado_pago\": \"Pendiente\"}',NULL,'2026-06-04 06:43:28',NULL),(103,'Persona','INSERT','17',NULL,'{\"id_persona\": 17, \"cedula\": \"1804552170\", \"nombre\": \"Cheche Andres\", \"apellido\": \"Palacios Mendez\", \"id_genero\": 1, \"id_sector\": 2, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 12:56:00',NULL),(104,'Persona','INSERT','18',NULL,'{\"id_persona\": 18, \"cedula\": \"1805766100\", \"nombre\": \"Juan Esteban\", \"apellido\": \"Sandoval Flores\", \"id_genero\": 1, \"id_sector\": null, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 12:56:01',NULL),(105,'Multa','INSERT','7',NULL,'{\"id_multa\": 7, \"id_persona\": 7, \"monto\": 10.00, \"estado_pago\": \"Pendiente\"}',NULL,'2026-06-04 13:04:38',NULL),(106,'Multa','INSERT','8',NULL,'{\"id_multa\": 8, \"id_persona\": 17, \"monto\": 10.00, \"estado_pago\": \"Pendiente\"}',NULL,'2026-06-04 13:04:38',NULL),(107,'Multa','INSERT','9',NULL,'{\"id_multa\": 9, \"id_persona\": 13, \"monto\": 10.00, \"estado_pago\": \"Pendiente\"}',NULL,'2026-06-04 13:04:38',NULL),(108,'Multa','INSERT','10',NULL,'{\"id_multa\": 10, \"id_persona\": 3, \"monto\": 10.00, \"estado_pago\": \"Pendiente\"}',NULL,'2026-06-04 13:04:38',NULL),(109,'Terreno','INSERT','9',NULL,'{\"id_terreno\": 9, \"id_persona\": 17, \"area_total\": 200000.00}',NULL,'2026-06-04 13:12:54',NULL),(110,'Multa','UPDATE','4','{\"monto\": 120.00, \"estado_pago\": \"Pendiente\"}','{\"monto\": 120.00, \"estado_pago\": \"Pagada\"}',NULL,'2026-06-04 13:21:33',NULL),(111,'Caja_Comunitaria','INSERT','10',NULL,'{\"id_transaccion\": 10, \"tipo_movimiento\": \"Ingreso\", \"monto\": 120.00, \"id_planilla\": null}',NULL,'2026-06-04 13:21:33',NULL),(112,'Caja_Comunitaria','INSERT','11',NULL,'{\"id_transaccion\": 11, \"tipo_movimiento\": \"Egreso\", \"monto\": 100.00, \"id_planilla\": null}',NULL,'2026-06-04 13:25:33',NULL),(113,'Multa','INSERT','11',NULL,'{\"id_multa\": 11, \"id_persona\": 9, \"monto\": 35.00, \"estado_pago\": \"Pendiente\"}',NULL,'2026-06-04 13:28:34',NULL),(115,'Persona','UPDATE','1','{\"cedula\": \"1801119197\", \"nombre\": \"Pepito Ernesto\", \"apellido\": \"Perez Jerez\", \"id_genero\": 1, \"id_sector\": 5, \"estado_vital\": \"Vivo\"}','{\"cedula\": \"1801119197\", \"nombre\": \"Pepito Ernesto\", \"apellido\": \"Perez Jerez\", \"id_genero\": 1, \"id_sector\": 1, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 13:58:33',NULL),(116,'Terreno','INSERT','10',NULL,'{\"id_terreno\": 10, \"id_persona\": 17, \"area_total\": 200000.00}',NULL,'2026-06-04 14:06:16',NULL),(117,'Terreno','INSERT','11',NULL,'{\"id_terreno\": 11, \"id_persona\": 17, \"area_total\": 200000.00}',NULL,'2026-06-04 14:09:00',NULL),(118,'Persona','INSERT','19',NULL,'{\"id_persona\": 19, \"cedula\": \"1802993939\", \"nombre\": \"Chavo\", \"apellido\": \"Del Ocho\", \"id_genero\": 1, \"id_sector\": 1, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 15:22:43',NULL),(119,'Persona','DELETE','19','{\"id_persona\": 19, \"cedula\": \"1802993939\", \"nombre\": \"Chavo\", \"id_sector\": 1}',NULL,NULL,'2026-06-04 15:25:25',NULL),(120,'Persona','INSERT','20',NULL,'{\"id_persona\": 20, \"cedula\": \"1802993939\", \"nombre\": \"Chavo\", \"apellido\": \"Del Ocho\", \"id_genero\": 1, \"id_sector\": 1, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 15:28:01',NULL),(121,'Persona','INSERT','21',NULL,'{\"id_persona\": 21, \"cedula\": \"0604834556\", \"nombre\": \"TERÁN SOLIS\", \"apellido\": \"DOMÉNIKA PATRICIA\", \"id_genero\": 1, \"id_sector\": 9, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 15:33:14',NULL),(122,'Terreno','INSERT','12',NULL,'{\"id_terreno\": 12, \"id_persona\": 20, \"area_total\": 23456.00}',NULL,'2026-06-04 15:57:36',NULL),(123,'Multa','INSERT','12',NULL,'{\"id_multa\": 12, \"id_persona\": 21, \"monto\": 7.50, \"estado_pago\": \"Pendiente\"}',NULL,'2026-06-04 16:07:14',NULL),(124,'Planilla_Cabecera','INSERT','5',NULL,'{\"id_planilla\": 5, \"id_persona\": 9, \"total_pagar\": 276.40, \"estado_pago\": \"Pendiente\"}',NULL,'2026-06-04 16:15:18',NULL),(125,'Planilla_Detalle_Terreno','INSERT','4',NULL,'{\"id_detalle\": 4, \"id_planilla\": 5, \"id_terreno\": 5, \"area_terreno_copia\": 55280.50, \"subtotal_calculado\": 276.40}',NULL,'2026-06-04 16:15:18',NULL),(126,'Planilla_Cabecera','UPDATE','5','{\"total_pagar\": 276.40, \"estado_pago\": \"Pendiente\"}','{\"total_pagar\": 276.40, \"estado_pago\": \"Pagada\"}',NULL,'2026-06-04 16:23:26',NULL),(127,'Caja_Comunitaria','INSERT','12',NULL,'{\"id_transaccion\": 12, \"tipo_movimiento\": \"Ingreso\", \"monto\": 276.40, \"id_planilla\": 5}',NULL,'2026-06-04 16:23:26',NULL),(128,'Persona','INSERT','22',NULL,'{\"id_persona\": 22, \"cedula\": \"0000000000\", \"nombre\": \"Super\", \"apellido\": \"Administrador\", \"id_genero\": null, \"id_sector\": 1, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 16:38:35',NULL),(129,'Persona','INSERT','23',NULL,'{\"id_persona\": 23, \"cedula\": \"1850351071\", \"nombre\": \"LESLIE MADELEINE\", \"apellido\": \"SOLIS ROBALINO\", \"id_genero\": 2, \"id_sector\": 1, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-04 20:36:12',NULL),(130,'Terreno','UPDATE','1','{\"area_total\": 5000.00}','{\"area_total\": 5000.00}',NULL,'2026-06-04 20:40:08',NULL),(131,'Terreno','UPDATE','1','{\"id_terreno\":1,\"id_persona\":1,\"clave_catastral\":\"18-08-57-44-545-545\",\"latitud\":\"-1.33160300\",\"longitud\":\"-78.54504100\",\"url_planimetria\":null,\"peso_archivo_bytes\":null,\"area_total\":\"5000.00\",\"id_estado_construccion\":2,\"archivo_escritura\":null}','{\"area_total\":5000,\"id_estado_construccion\":2,\"latitud\":-1.331603,\"longitud\":-78.545041}',1,'2026-06-04 20:40:08',NULL),(132,'Planilla_Cabecera','INSERT','6',NULL,'{\"id_planilla\": 6, \"id_persona\": 1, \"total_pagar\": 25.00, \"estado_pago\": \"Pendiente\"}',NULL,'2026-06-04 21:11:04',NULL),(133,'Planilla_Detalle_Terreno','INSERT','5',NULL,'{\"id_detalle\": 5, \"id_planilla\": 6, \"id_terreno\": 1, \"area_terreno_copia\": 5000.00, \"subtotal_calculado\": 25.00}',NULL,'2026-06-04 21:11:04',NULL),(134,'Caja_Comunitaria','INSERT','13',NULL,'{\"id_transaccion\": 13, \"tipo_movimiento\": \"Egreso\", \"monto\": 100.00, \"id_planilla\": null}',NULL,'2026-06-05 03:04:46',NULL),(135,'Planilla_Cabecera','INSERT','7',NULL,'{\"id_planilla\": 7, \"id_persona\": 17, \"total_pagar\": 1000.00, \"estado_pago\": \"Pendiente\"}',NULL,'2026-06-05 03:36:18',NULL),(136,'Planilla_Detalle_Terreno','INSERT','6',NULL,'{\"id_detalle\": 6, \"id_planilla\": 7, \"id_terreno\": 9, \"area_terreno_copia\": 200000.00, \"subtotal_calculado\": 1000.00}',NULL,'2026-06-05 03:36:18',NULL),(137,'Planilla_Cabecera','INSERT','8',NULL,'{\"id_planilla\": 8, \"id_persona\": 17, \"total_pagar\": 1000.00, \"estado_pago\": \"Pendiente\"}',NULL,'2026-06-05 03:36:42',NULL),(138,'Planilla_Detalle_Terreno','INSERT','7',NULL,'{\"id_detalle\": 7, \"id_planilla\": 8, \"id_terreno\": 10, \"area_terreno_copia\": 200000.00, \"subtotal_calculado\": 1000.00}',NULL,'2026-06-05 03:36:42',NULL),(139,'Planilla_Cabecera','INSERT','9',NULL,'{\"id_planilla\": 9, \"id_persona\": 17, \"total_pagar\": 1000.00, \"estado_pago\": \"Pendiente\"}',NULL,'2026-06-05 03:40:49',NULL),(140,'Planilla_Detalle_Terreno','INSERT','8',NULL,'{\"id_detalle\": 8, \"id_planilla\": 9, \"id_terreno\": 11, \"area_terreno_copia\": 200000.00, \"subtotal_calculado\": 1000.00}',NULL,'2026-06-05 03:40:49',NULL),(141,'Miembro_Directiva','UPDATE','10','{\"estado\": \"Activo\"}','{\"estado\": \"Finalizado\"}',NULL,'2026-06-10 03:33:04',NULL),(142,'Miembro_Directiva','UPDATE','11','{\"estado\": \"Activo\"}','{\"estado\": \"Finalizado\"}',NULL,'2026-06-10 03:33:04',NULL),(143,'Miembro_Directiva','UPDATE','12','{\"estado\": \"Activo\"}','{\"estado\": \"Finalizado\"}',NULL,'2026-06-10 03:33:04',NULL),(144,'Miembro_Directiva','UPDATE','13','{\"estado\": \"Activo\"}','{\"estado\": \"Finalizado\"}',NULL,'2026-06-10 03:33:04',NULL),(145,'Miembro_Directiva','UPDATE','14','{\"estado\": \"Activo\"}','{\"estado\": \"Finalizado\"}',NULL,'2026-06-10 03:33:04',NULL),(146,'Miembro_Directiva','UPDATE','15','{\"estado\": \"Activo\"}','{\"estado\": \"Finalizado\"}',NULL,'2026-06-10 03:33:04',NULL),(147,'Miembro_Directiva','UPDATE','16','{\"estado\": \"Activo\"}','{\"estado\": \"Finalizado\"}',NULL,'2026-06-10 03:33:04',NULL),(148,'Miembro_Directiva','UPDATE','17','{\"estado\": \"Activo\"}','{\"estado\": \"Finalizado\"}',NULL,'2026-06-10 03:33:04',NULL),(149,'Miembro_Directiva','UPDATE','18','{\"estado\": \"Activo\"}','{\"estado\": \"Finalizado\"}',NULL,'2026-06-10 03:33:04',NULL),(150,'Miembro_Directiva','INSERT','19',NULL,'{\"id_directiva\": 19, \"id_persona\": 1, \"id_cargo_directivo\": 1, \"estado\": \"Activo\"}',NULL,'2026-06-10 03:33:06',NULL),(151,'Miembro_Directiva','INSERT','20',NULL,'{\"id_directiva\": 20, \"id_persona\": 3, \"id_cargo_directivo\": 2, \"estado\": \"Activo\"}',NULL,'2026-06-10 03:33:06',NULL),(152,'Miembro_Directiva','INSERT','21',NULL,'{\"id_directiva\": 21, \"id_persona\": 11, \"id_cargo_directivo\": 3, \"estado\": \"Activo\"}',NULL,'2026-06-10 03:33:06',NULL),(153,'Miembro_Directiva','INSERT','22',NULL,'{\"id_directiva\": 22, \"id_persona\": 17, \"id_cargo_directivo\": 4, \"estado\": \"Activo\"}',NULL,'2026-06-10 03:33:06',NULL),(154,'Miembro_Directiva','INSERT','23',NULL,'{\"id_directiva\": 23, \"id_persona\": 15, \"id_cargo_directivo\": 5, \"estado\": \"Activo\"}',NULL,'2026-06-10 03:33:06',NULL),(155,'Miembro_Directiva','INSERT','24',NULL,'{\"id_directiva\": 24, \"id_persona\": 21, \"id_cargo_directivo\": 6, \"estado\": \"Activo\"}',NULL,'2026-06-10 03:33:06',NULL),(156,'Miembro_Directiva','INSERT','25',NULL,'{\"id_directiva\": 25, \"id_persona\": 23, \"id_cargo_directivo\": 7, \"estado\": \"Activo\"}',NULL,'2026-06-10 03:33:06',NULL),(157,'Miembro_Directiva','INSERT','26',NULL,'{\"id_directiva\": 26, \"id_persona\": 20, \"id_cargo_directivo\": 8, \"estado\": \"Activo\"}',NULL,'2026-06-10 03:33:06',NULL),(158,'Miembro_Directiva','INSERT','27',NULL,'{\"id_directiva\": 27, \"id_persona\": 13, \"id_cargo_directivo\": 9, \"estado\": \"Activo\"}',NULL,'2026-06-10 03:33:06',NULL),(159,'Miembro_Directiva','UPDATE','19','{\"estado\": \"Activo\"}','{\"estado\": \"Finalizado\"}',NULL,'2026-06-10 03:34:35',NULL),(160,'Miembro_Directiva','UPDATE','20','{\"estado\": \"Activo\"}','{\"estado\": \"Finalizado\"}',NULL,'2026-06-10 03:34:35',NULL),(161,'Miembro_Directiva','UPDATE','21','{\"estado\": \"Activo\"}','{\"estado\": \"Finalizado\"}',NULL,'2026-06-10 03:34:35',NULL),(162,'Miembro_Directiva','UPDATE','22','{\"estado\": \"Activo\"}','{\"estado\": \"Finalizado\"}',NULL,'2026-06-10 03:34:35',NULL),(163,'Miembro_Directiva','UPDATE','23','{\"estado\": \"Activo\"}','{\"estado\": \"Finalizado\"}',NULL,'2026-06-10 03:34:35',NULL),(164,'Miembro_Directiva','UPDATE','24','{\"estado\": \"Activo\"}','{\"estado\": \"Finalizado\"}',NULL,'2026-06-10 03:34:35',NULL),(165,'Miembro_Directiva','UPDATE','25','{\"estado\": \"Activo\"}','{\"estado\": \"Finalizado\"}',NULL,'2026-06-10 03:34:35',NULL),(166,'Miembro_Directiva','UPDATE','26','{\"estado\": \"Activo\"}','{\"estado\": \"Finalizado\"}',NULL,'2026-06-10 03:34:35',NULL),(167,'Miembro_Directiva','UPDATE','27','{\"estado\": \"Activo\"}','{\"estado\": \"Finalizado\"}',NULL,'2026-06-10 03:34:35',NULL),(168,'Miembro_Directiva','UPDATE','10','{\"estado\": \"Finalizado\"}','{\"estado\": \"Activo\"}',NULL,'2026-06-10 03:34:35',NULL),(169,'Miembro_Directiva','UPDATE','11','{\"estado\": \"Finalizado\"}','{\"estado\": \"Activo\"}',NULL,'2026-06-10 03:34:35',NULL),(170,'Miembro_Directiva','UPDATE','12','{\"estado\": \"Finalizado\"}','{\"estado\": \"Activo\"}',NULL,'2026-06-10 03:34:35',NULL),(171,'Miembro_Directiva','UPDATE','13','{\"estado\": \"Finalizado\"}','{\"estado\": \"Activo\"}',NULL,'2026-06-10 03:34:35',NULL),(172,'Miembro_Directiva','UPDATE','14','{\"estado\": \"Finalizado\"}','{\"estado\": \"Activo\"}',NULL,'2026-06-10 03:34:35',NULL),(173,'Miembro_Directiva','UPDATE','15','{\"estado\": \"Finalizado\"}','{\"estado\": \"Activo\"}',NULL,'2026-06-10 03:34:35',NULL),(174,'Miembro_Directiva','UPDATE','16','{\"estado\": \"Finalizado\"}','{\"estado\": \"Activo\"}',NULL,'2026-06-10 03:34:35',NULL),(175,'Miembro_Directiva','UPDATE','17','{\"estado\": \"Finalizado\"}','{\"estado\": \"Activo\"}',NULL,'2026-06-10 03:34:35',NULL),(176,'Miembro_Directiva','UPDATE','18','{\"estado\": \"Finalizado\"}','{\"estado\": \"Activo\"}',NULL,'2026-06-10 03:34:35',NULL),(177,'Miembro_Directiva','UPDATE','10','{\"estado\": \"Activo\"}','{\"estado\": \"Finalizado\"}',NULL,'2026-06-10 03:35:31',NULL),(178,'Miembro_Directiva','UPDATE','11','{\"estado\": \"Activo\"}','{\"estado\": \"Finalizado\"}',NULL,'2026-06-10 03:35:31',NULL),(179,'Miembro_Directiva','UPDATE','12','{\"estado\": \"Activo\"}','{\"estado\": \"Finalizado\"}',NULL,'2026-06-10 03:35:31',NULL),(180,'Miembro_Directiva','UPDATE','13','{\"estado\": \"Activo\"}','{\"estado\": \"Finalizado\"}',NULL,'2026-06-10 03:35:31',NULL),(181,'Miembro_Directiva','UPDATE','14','{\"estado\": \"Activo\"}','{\"estado\": \"Finalizado\"}',NULL,'2026-06-10 03:35:31',NULL),(182,'Miembro_Directiva','UPDATE','15','{\"estado\": \"Activo\"}','{\"estado\": \"Finalizado\"}',NULL,'2026-06-10 03:35:31',NULL),(183,'Miembro_Directiva','UPDATE','16','{\"estado\": \"Activo\"}','{\"estado\": \"Finalizado\"}',NULL,'2026-06-10 03:35:31',NULL),(184,'Miembro_Directiva','UPDATE','17','{\"estado\": \"Activo\"}','{\"estado\": \"Finalizado\"}',NULL,'2026-06-10 03:35:31',NULL),(185,'Miembro_Directiva','UPDATE','18','{\"estado\": \"Activo\"}','{\"estado\": \"Finalizado\"}',NULL,'2026-06-10 03:35:31',NULL),(186,'Miembro_Directiva','UPDATE','19','{\"estado\": \"Finalizado\"}','{\"estado\": \"Activo\"}',NULL,'2026-06-10 03:35:31',NULL),(187,'Miembro_Directiva','UPDATE','20','{\"estado\": \"Finalizado\"}','{\"estado\": \"Activo\"}',NULL,'2026-06-10 03:35:31',NULL),(188,'Miembro_Directiva','UPDATE','21','{\"estado\": \"Finalizado\"}','{\"estado\": \"Activo\"}',NULL,'2026-06-10 03:35:31',NULL),(189,'Miembro_Directiva','UPDATE','22','{\"estado\": \"Finalizado\"}','{\"estado\": \"Activo\"}',NULL,'2026-06-10 03:35:31',NULL),(190,'Miembro_Directiva','UPDATE','23','{\"estado\": \"Finalizado\"}','{\"estado\": \"Activo\"}',NULL,'2026-06-10 03:35:31',NULL),(191,'Miembro_Directiva','UPDATE','24','{\"estado\": \"Finalizado\"}','{\"estado\": \"Activo\"}',NULL,'2026-06-10 03:35:31',NULL),(192,'Miembro_Directiva','UPDATE','25','{\"estado\": \"Finalizado\"}','{\"estado\": \"Activo\"}',NULL,'2026-06-10 03:35:31',NULL),(193,'Miembro_Directiva','UPDATE','26','{\"estado\": \"Finalizado\"}','{\"estado\": \"Activo\"}',NULL,'2026-06-10 03:35:31',NULL),(194,'Miembro_Directiva','UPDATE','27','{\"estado\": \"Finalizado\"}','{\"estado\": \"Activo\"}',NULL,'2026-06-10 03:35:31',NULL),(195,'Multa','INSERT','13',NULL,'{\"id_multa\": 13, \"id_persona\": 1, \"monto\": 150.00, \"estado_pago\": \"Pendiente\"}',NULL,'2026-06-10 03:37:37',NULL),(196,'Multa','UPDATE','3','{\"monto\": 120.00, \"estado_pago\": \"Pendiente\"}','{\"monto\": 120.00, \"estado_pago\": \"Pagada\"}',NULL,'2026-06-10 03:38:13',NULL),(197,'Caja_Comunitaria','INSERT','14',NULL,'{\"id_transaccion\": 14, \"tipo_movimiento\": \"Ingreso\", \"monto\": 120.00, \"id_planilla\": null}',NULL,'2026-06-10 03:38:13',NULL),(198,'Multa','UPDATE','13','{\"monto\": 150.00, \"estado_pago\": \"Pendiente\"}','{\"monto\": 150.00, \"estado_pago\": \"Pagada\"}',NULL,'2026-06-10 03:38:13',NULL),(199,'Caja_Comunitaria','INSERT','15',NULL,'{\"id_transaccion\": 15, \"tipo_movimiento\": \"Ingreso\", \"monto\": 150.00, \"id_planilla\": null}',NULL,'2026-06-10 03:38:13',NULL),(200,'Multa','INSERT','14',NULL,'{\"id_multa\": 14, \"id_persona\": 1, \"monto\": 54.00, \"estado_pago\": \"Pendiente\"}',NULL,'2026-06-10 03:44:17',NULL),(201,'Multa','UPDATE','14','{\"monto\": 54.00, \"estado_pago\": \"Pendiente\"}','{\"monto\": 54.00, \"estado_pago\": \"Pagada\"}',NULL,'2026-06-10 03:44:31',NULL),(202,'Caja_Comunitaria','INSERT','16',NULL,'{\"id_transaccion\": 16, \"tipo_movimiento\": \"Ingreso\", \"monto\": 54.00, \"id_planilla\": null}',NULL,'2026-06-10 03:44:31',NULL),(203,'Planilla_Cabecera','INSERT','10',NULL,'{\"id_planilla\": 10, \"id_persona\": 1, \"total_pagar\": 25.00, \"estado_pago\": \"Pendiente\"}',NULL,'2026-06-10 03:50:20',NULL),(204,'Planilla_Detalle_Terreno','INSERT','9',NULL,'{\"id_detalle\": 9, \"id_planilla\": 10, \"id_terreno\": 1, \"area_terreno_copia\": 5000.00, \"subtotal_calculado\": 25.00}',NULL,'2026-06-10 03:50:20',NULL),(205,'Planilla_Cabecera','UPDATE','10','{\"total_pagar\": 25.00, \"estado_pago\": \"Pendiente\"}','{\"total_pagar\": 25.00, \"estado_pago\": \"Pagada\"}',NULL,'2026-06-10 03:50:29',NULL),(206,'Caja_Comunitaria','INSERT','17',NULL,'{\"id_transaccion\": 17, \"tipo_movimiento\": \"Ingreso\", \"monto\": 25.00, \"id_planilla\": 10}',NULL,'2026-06-10 03:50:29',NULL),(207,'Planilla_Cabecera','INSERT','11',NULL,'{\"id_planilla\": 11, \"id_persona\": 1, \"total_pagar\": 25.00, \"estado_pago\": \"Pendiente\"}',NULL,'2026-06-10 03:54:10',NULL),(208,'Planilla_Detalle_Terreno','INSERT','10',NULL,'{\"id_detalle\": 10, \"id_planilla\": 11, \"id_terreno\": 1, \"area_terreno_copia\": 5000.00, \"subtotal_calculado\": 25.00}',NULL,'2026-06-10 03:54:10',NULL),(209,'Planilla_Cabecera','INSERT','12',NULL,'{\"id_planilla\": 12, \"id_persona\": 1, \"total_pagar\": 25.00, \"estado_pago\": \"Pendiente\"}',NULL,'2026-06-10 03:55:09',NULL),(210,'Planilla_Detalle_Terreno','INSERT','11',NULL,'{\"id_detalle\": 11, \"id_planilla\": 12, \"id_terreno\": 1, \"area_terreno_copia\": 5000.00, \"subtotal_calculado\": 25.00}',NULL,'2026-06-10 03:55:09',NULL),(211,'Persona','UPDATE','23','{\"cedula\": \"1850351071\", \"nombre\": \"LESLIE MADELEINE\", \"apellido\": \"SOLIS ROBALINO\", \"id_genero\": 2, \"id_sector\": 1, \"estado_vital\": \"Vivo\"}','{\"cedula\": \"1850351071\", \"nombre\": \"LESLIE MADELEINE\", \"apellido\": \"SOLIS ROBALINO\", \"id_genero\": 2, \"id_sector\": 1, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-10 04:10:30',NULL),(212,'Multa','INSERT','15',NULL,'{\"id_multa\": 15, \"id_persona\": 23, \"monto\": 50.00, \"estado_pago\": \"Pendiente\"}',NULL,'2026-06-10 04:17:28',NULL),(213,'Persona','INSERT','24',NULL,'{\"id_persona\": 24, \"cedula\": \"1804697652\", \"nombre\": \"Erick\", \"apellido\": \"Moreno\", \"id_genero\": 1, \"id_sector\": 7, \"estado_vital\": \"Vivo\"}',NULL,'2026-06-10 13:43:20',NULL);
/*!40000 ALTER TABLE `Auditoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Caja_Comunitaria`
--

DROP TABLE IF EXISTS `Caja_Comunitaria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Caja_Comunitaria` (
  `id_transaccion` int(11) NOT NULL AUTO_INCREMENT,
  `numero_comprobante` varchar(50) DEFAULT NULL,
  `tipo_movimiento` enum('Ingreso','Egreso') NOT NULL,
  `concepto` varchar(255) NOT NULL,
  `id_multa` int(11) DEFAULT NULL,
  `id_planilla` int(11) DEFAULT NULL,
  `monto` decimal(12,2) NOT NULL,
  `responsable_registro` int(11) NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_transaccion`),
  UNIQUE KEY `numero_comprobante` (`numero_comprobante`),
  KEY `fk_caja_multa` (`id_multa`),
  KEY `fk_caja_planilla` (`id_planilla`),
  KEY `fk_caja_usuario` (`responsable_registro`),
  KEY `idx_caja_fecha` (`fecha_registro`),
  CONSTRAINT `fk_caja_multa` FOREIGN KEY (`id_multa`) REFERENCES `Multa` (`id_multa`) ON DELETE SET NULL,
  CONSTRAINT `fk_caja_planilla` FOREIGN KEY (`id_planilla`) REFERENCES `Planilla_Cabecera` (`id_planilla`) ON DELETE SET NULL,
  CONSTRAINT `fk_caja_usuario` FOREIGN KEY (`responsable_registro`) REFERENCES `Usuario_Sistema` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Caja_Comunitaria`
--

LOCK TABLES `Caja_Comunitaria` WRITE;
/*!40000 ALTER TABLE `Caja_Comunitaria` DISABLE KEYS */;
INSERT INTO `Caja_Comunitaria` VALUES (3,'12345586','Ingreso','Pago de agua (Mes: 6/2026)',NULL,4,25.00,1,'2026-06-04 17:48:27'),(6,'561585632-M1','Ingreso','Cobro Multa: asdfghjkl',1,NULL,100.00,1,'2026-06-04 17:48:27'),(7,'561585632-P1','Ingreso','Cobro Planilla Agua 5/2026',NULL,1,25.00,1,'2026-06-04 17:48:27'),(8,'25984-M2','Ingreso','Cobro Multa: No fue a KD de Braulio',2,NULL,110.10,1,'2026-06-04 17:48:27'),(9,'265847','Egreso','pvc2',NULL,NULL,50.00,1,'2026-06-04 17:48:27'),(10,'51165265511511-M4','Ingreso','Cobro Multa: Inasistencia a Minga: Ir a dar mantenimiento (2026-06-06)',4,NULL,120.00,1,'2026-06-04 17:48:27'),(11,'651651651651','Egreso','2 Canecas de pintura',NULL,NULL,100.00,1,'2026-06-04 17:48:27'),(12,'5656103','Ingreso','Pago de agua (Mes: 6/2026)',NULL,5,276.40,1,'2026-06-04 17:48:27'),(13,'1205456','Egreso','Compra de computadoras',NULL,NULL,100.00,1,'2026-06-05 03:04:46'),(14,'1226584-M3','Ingreso','Cobro Multa: Inasistencia a Minga: Ir a dar mantenimiento (2026-06-06)',3,NULL,120.00,1,'2026-06-10 03:38:13'),(15,'1226584-M13','Ingreso','Cobro Multa: sedrftyghujkdrftygh',13,NULL,150.00,1,'2026-06-10 03:38:13'),(16,'45689412-M14','Ingreso','Cobro Multa: wsedrfgtyhjk',14,NULL,54.00,1,'2026-06-10 03:44:31'),(17,'1245678','Ingreso','Pago agua — Mes 9/2026',NULL,10,25.00,1,'2026-06-10 03:50:29');
/*!40000 ALTER TABLE `Caja_Comunitaria` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50003 TRIGGER trg_caja_insert AFTER INSERT ON Caja_Comunitaria FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Caja_Comunitaria', 'INSERT', NEW.id_transaccion, NULL, JSON_OBJECT(
        'id_transaccion', NEW.id_transaccion, 'tipo_movimiento', NEW.tipo_movimiento, 'monto', NEW.monto, 'id_planilla', NEW.id_planilla
    ), @id_usuario_actual);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50003 TRIGGER trg_caja_update AFTER UPDATE ON Caja_Comunitaria FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Caja_Comunitaria', 'UPDATE', NEW.id_transaccion,
    JSON_OBJECT('tipo_movimiento', OLD.tipo_movimiento, 'monto', OLD.monto), JSON_OBJECT('tipo_movimiento', NEW.tipo_movimiento, 'monto', NEW.monto), @id_usuario_actual);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50003 TRIGGER trg_caja_delete BEFORE DELETE ON Caja_Comunitaria FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Caja_Comunitaria', 'DELETE', OLD.id_transaccion, JSON_OBJECT('id_transaccion', OLD.id_transaccion, 'monto', OLD.monto), NULL, @id_usuario_actual);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `Catalogo_Actividad_Minga`
--

DROP TABLE IF EXISTS `Catalogo_Actividad_Minga`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Catalogo_Actividad_Minga` (
  `id_actividad` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_actividad` varchar(150) NOT NULL,
  PRIMARY KEY (`id_actividad`),
  UNIQUE KEY `nombre_actividad` (`nombre_actividad`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Catalogo_Actividad_Minga`
--

LOCK TABLES `Catalogo_Actividad_Minga` WRITE;
/*!40000 ALTER TABLE `Catalogo_Actividad_Minga` DISABLE KEYS */;
INSERT INTO `Catalogo_Actividad_Minga` VALUES (1,'General');
/*!40000 ALTER TABLE `Catalogo_Actividad_Minga` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Catalogo_Cargo_Directivo`
--

DROP TABLE IF EXISTS `Catalogo_Cargo_Directivo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Catalogo_Cargo_Directivo` (
  `id_cargo_directivo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_cargo` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  PRIMARY KEY (`id_cargo_directivo`),
  UNIQUE KEY `nombre_cargo` (`nombre_cargo`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Catalogo_Cargo_Directivo`
--

LOCK TABLES `Catalogo_Cargo_Directivo` WRITE;
/*!40000 ALTER TABLE `Catalogo_Cargo_Directivo` DISABLE KEYS */;
INSERT INTO `Catalogo_Cargo_Directivo` VALUES (1,'Presidente','Máxima autoridad de la directiva'),(2,'Vicepresidente','Segundo al mando'),(3,'Secretario','Encargado de actas'),(4,'Tesorero','Encargado financiero'),(5,'Vocal Principal 1','Primer vocal'),(6,'Vocal Principal 2','Segundo vocal'),(7,'Vocal Principal 3','Tercer vocal'),(8,'Vocal Suplente 1','Vocal Suplente 1'),(9,'Vocal Suplente 2','Vocal Suplente 2');
/*!40000 ALTER TABLE `Catalogo_Cargo_Directivo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Catalogo_Condicion_Especial`
--

DROP TABLE IF EXISTS `Catalogo_Condicion_Especial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Catalogo_Condicion_Especial` (
  `id_condicion` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_condicion` varchar(100) NOT NULL,
  PRIMARY KEY (`id_condicion`),
  UNIQUE KEY `nombre_condicion` (`nombre_condicion`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Catalogo_Condicion_Especial`
--

LOCK TABLES `Catalogo_Condicion_Especial` WRITE;
/*!40000 ALTER TABLE `Catalogo_Condicion_Especial` DISABLE KEYS */;
INSERT INTO `Catalogo_Condicion_Especial` VALUES (4,'Discapacidad Auditiva'),(1,'Discapacidad Física'),(2,'Discapacidad Intelectual'),(3,'Discapacidad Visual'),(6,'Enfermedad Catastrófica'),(5,'Tercera Edad');
/*!40000 ALTER TABLE `Catalogo_Condicion_Especial` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Catalogo_Estado_Asistencia`
--

DROP TABLE IF EXISTS `Catalogo_Estado_Asistencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Catalogo_Estado_Asistencia` (
  `id_estado_asistencia` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_estado` varchar(50) NOT NULL,
  PRIMARY KEY (`id_estado_asistencia`),
  UNIQUE KEY `nombre_estado` (`nombre_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Catalogo_Estado_Asistencia`
--

LOCK TABLES `Catalogo_Estado_Asistencia` WRITE;
/*!40000 ALTER TABLE `Catalogo_Estado_Asistencia` DISABLE KEYS */;
INSERT INTO `Catalogo_Estado_Asistencia` VALUES (3,'Faltó'),(4,'Justificado'),(1,'Pendiente'),(2,'Presente');
/*!40000 ALTER TABLE `Catalogo_Estado_Asistencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Catalogo_Estado_Construccion`
--

DROP TABLE IF EXISTS `Catalogo_Estado_Construccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Catalogo_Estado_Construccion` (
  `id_estado_construccion` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_estado` varchar(50) NOT NULL,
  PRIMARY KEY (`id_estado_construccion`),
  UNIQUE KEY `nombre_estado` (`nombre_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Catalogo_Estado_Construccion`
--

LOCK TABLES `Catalogo_Estado_Construccion` WRITE;
/*!40000 ALTER TABLE `Catalogo_Estado_Construccion` DISABLE KEYS */;
INSERT INTO `Catalogo_Estado_Construccion` VALUES (4,'Construida'),(3,'En Construcción'),(2,'En Planificación'),(1,'Lote Baldío');
/*!40000 ALTER TABLE `Catalogo_Estado_Construccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Catalogo_Estado_Minga`
--

DROP TABLE IF EXISTS `Catalogo_Estado_Minga`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Catalogo_Estado_Minga` (
  `id_estado_minga` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_estado` varchar(50) NOT NULL,
  PRIMARY KEY (`id_estado_minga`),
  UNIQUE KEY `nombre_estado` (`nombre_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Catalogo_Estado_Minga`
--

LOCK TABLES `Catalogo_Estado_Minga` WRITE;
/*!40000 ALTER TABLE `Catalogo_Estado_Minga` DISABLE KEYS */;
INSERT INTO `Catalogo_Estado_Minga` VALUES (5,'Cancelada'),(2,'En Ejecución'),(3,'Finalizada'),(1,'Programada'),(4,'Suspendida');
/*!40000 ALTER TABLE `Catalogo_Estado_Minga` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Catalogo_Genero`
--

DROP TABLE IF EXISTS `Catalogo_Genero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Catalogo_Genero` (
  `id_genero` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_genero` varchar(50) NOT NULL,
  PRIMARY KEY (`id_genero`),
  UNIQUE KEY `nombre_genero` (`nombre_genero`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Catalogo_Genero`
--

LOCK TABLES `Catalogo_Genero` WRITE;
/*!40000 ALTER TABLE `Catalogo_Genero` DISABLE KEYS */;
INSERT INTO `Catalogo_Genero` VALUES (2,'Femenino'),(1,'Masculino');
/*!40000 ALTER TABLE `Catalogo_Genero` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Catalogo_Nivel_Academico`
--

DROP TABLE IF EXISTS `Catalogo_Nivel_Academico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Catalogo_Nivel_Academico` (
  `id_nivel_academico` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_nivel` varchar(100) NOT NULL,
  PRIMARY KEY (`id_nivel_academico`),
  UNIQUE KEY `nombre_nivel` (`nombre_nivel`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Catalogo_Nivel_Academico`
--

LOCK TABLES `Catalogo_Nivel_Academico` WRITE;
/*!40000 ALTER TABLE `Catalogo_Nivel_Academico` DISABLE KEYS */;
INSERT INTO `Catalogo_Nivel_Academico` VALUES (4,'Cuarto Nivel'),(1,'No Especificado'),(5,'Quinto Nivel'),(2,'Técnico/Tecnológico'),(3,'Tercer Nivel');
/*!40000 ALTER TABLE `Catalogo_Nivel_Academico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Catalogo_Operadora`
--

DROP TABLE IF EXISTS `Catalogo_Operadora`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Catalogo_Operadora` (
  `id_operadora` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_operadora` varchar(50) NOT NULL,
  PRIMARY KEY (`id_operadora`),
  UNIQUE KEY `nombre_operadora` (`nombre_operadora`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Catalogo_Operadora`
--

LOCK TABLES `Catalogo_Operadora` WRITE;
/*!40000 ALTER TABLE `Catalogo_Operadora` DISABLE KEYS */;
INSERT INTO `Catalogo_Operadora` VALUES (1,'Claro'),(4,'CNT'),(2,'Movistar'),(3,'Tuenti');
/*!40000 ALTER TABLE `Catalogo_Operadora` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Catalogo_Tipo_Contacto`
--

DROP TABLE IF EXISTS `Catalogo_Tipo_Contacto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Catalogo_Tipo_Contacto` (
  `id_tipo_contacto` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_tipo` varchar(50) NOT NULL,
  PRIMARY KEY (`id_tipo_contacto`),
  UNIQUE KEY `nombre_tipo` (`nombre_tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Catalogo_Tipo_Contacto`
--

LOCK TABLES `Catalogo_Tipo_Contacto` WRITE;
/*!40000 ALTER TABLE `Catalogo_Tipo_Contacto` DISABLE KEYS */;
INSERT INTO `Catalogo_Tipo_Contacto` VALUES (1,'Celular'),(3,'Correo Electrónico'),(2,'Teléfono Fijo'),(4,'WhatsApp');
/*!40000 ALTER TABLE `Catalogo_Tipo_Contacto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Catalogo_Tipo_Evento`
--

DROP TABLE IF EXISTS `Catalogo_Tipo_Evento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Catalogo_Tipo_Evento` (
  `id_tipo_evento` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_tipo` varchar(100) NOT NULL,
  PRIMARY KEY (`id_tipo_evento`),
  UNIQUE KEY `nombre_tipo` (`nombre_tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Catalogo_Tipo_Evento`
--

LOCK TABLES `Catalogo_Tipo_Evento` WRITE;
/*!40000 ALTER TABLE `Catalogo_Tipo_Evento` DISABLE KEYS */;
INSERT INTO `Catalogo_Tipo_Evento` VALUES (2,'Asamblea General'),(4,'Inspección de Campo'),(1,'Minga Comunitaria'),(3,'Sesión de Directiva');
/*!40000 ALTER TABLE `Catalogo_Tipo_Evento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Catalogo_Titulo_Educativo`
--

DROP TABLE IF EXISTS `Catalogo_Titulo_Educativo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Catalogo_Titulo_Educativo` (
  `codigo` varchar(15) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `nivel_jerarquico` int(11) NOT NULL,
  `id_nivel_academico` int(11) NOT NULL DEFAULT 1,
  `parent_codigo` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`codigo`),
  KEY `fk_cat_titulo_parent` (`parent_codigo`),
  KEY `fk_cat_titulo_nivel` (`id_nivel_academico`),
  KEY `idx_cat_nivel_jerarquico` (`nivel_jerarquico`),
  FULLTEXT KEY `idx_cat_nombre` (`nombre`),
  CONSTRAINT `fk_cat_titulo_nivel` FOREIGN KEY (`id_nivel_academico`) REFERENCES `Catalogo_Nivel_Academico` (`id_nivel_academico`),
  CONSTRAINT `fk_cat_titulo_parent` FOREIGN KEY (`parent_codigo`) REFERENCES `Catalogo_Titulo_Educativo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Catalogo_Titulo_Educativo`
--

LOCK TABLES `Catalogo_Titulo_Educativo` WRITE;
/*!40000 ALTER TABLE `Catalogo_Titulo_Educativo` DISABLE KEYS */;
INSERT INTO `Catalogo_Titulo_Educativo` VALUES ('1','TÉCNICO SUPERIOR',1,2,NULL),('101','Técnico Superior en Educación',3,2,'1'),('1011','Técnico Superior en Ciencias de la Educación',4,2,'101'),('101101','Técnico Superior en Ciencias de la Educación',6,2,'1011'),('101101.01','Técnico Superior en Administración Educativa',9,2,'101101'),('101101.02','Técnico Superior en Ciencias de la Educación',9,2,'101101'),('101102','Técnico Superior en Formación para Docentes de Educación Preprimaria',6,2,'1011'),('101102.01','Técnico Superior en Educación Inicial  (preprimaria, parvulario)',9,2,'101102'),('101103','Técnico Superior en Formación para Docentes sin Asignaturas de Especialización',6,2,'1011'),('101103.01','Técnico Superior en Docencia en Educación Básica (Educación primaria)',9,2,'101103'),('101103.02','Técnico Superior en Educación Especial y  Psicorehabilitación',9,2,'101103'),('101103.03','Técnico Superior en Docencia Educación Básica Intercultural Bilingüe',9,2,'101103'),('101104','Técnico Superior en Formación para Docentes con Asignaturas de Especialización',6,2,'1011'),('101104.01','Técnico Superior en Formación para Docentes con Asignaturas de Especialización',9,2,'101104'),('101105','Técnico Superior en Psicopedagogía',6,2,'1011'),('101105.01','Técnico Superior Psicopedagogía y Orientador Integral',9,2,'101105'),('102','Técnico Superior en Artes y Humanidades',3,2,'1'),('1021','Técnico Superior en Artes',4,2,'102'),('102101','Técnico Superior en Técnicas  audiovisuales y producción para medios de Comunicación',6,2,'1021'),('102101.01','Técnico Superior Animación Digital',9,2,'102101'),('102101.02','Técnico Superior Auxiliar de Cine y Televisión',9,2,'102101'),('102101.03','Técnico Superior Camarógrafo',9,2,'102101'),('102101.04','Técnico Superior en Actualización para Televisión',9,2,'102101'),('102101.05','Técnico Superior en Audiovisuales',9,2,'102101'),('102101.06','Técnico Superior en Fotografía',9,2,'102101'),('102101.07','Técnico Superior en Iluminación',9,2,'102101'),('102101.08','Técnico Superior en Producción y Realización de Radio y Televisión',9,2,'102101'),('102101.09','Técnico Superior Maquillador  y Caracterizador',9,2,'102101'),('102101.1','Técnico Superior Post-productor de Imagen de Cine y Televisión',9,2,'102101'),('102102','Técnico Superior en Diseño',6,2,'1021'),('102102.01','Técnico Superior Decorador de Interiores',9,2,'102102'),('102102.02','Técnico Superior Diseñador de Calzado',9,2,'102102'),('102102.03','Técnico Superior Diseñador de Interiores',9,2,'102102'),('102102.04','Técnico Superior Diseñador de Jardines',9,2,'102102'),('102102.05','Técnico Superior Diseñador de Joyas',9,2,'102102'),('102102.06','Técnico Superior Diseñador de Metales',9,2,'102102'),('102102.07','Técnico Superior Diseñador de Modas',9,2,'102102'),('102102.08','Técnico Superior Diseñador Gráfico',9,2,'102102'),('102102.09','Técnico Superior Diseñador Marroquinería',9,2,'102102'),('102102.1','Técnico Superior en Diseño Textil',9,2,'102102'),('102102.11','Técnico Superior en Diseño',9,2,'102102'),('102103','Técnico Superior en Artes Plásticas y Curaduría',6,2,'1021'),('102103.01','Técnico Superior en  Artes Plásticas (escultura, artesanías, cerámica, etc.)',9,2,'102103'),('102103.02','Técnico Superior en Artes Visuales (pintura, dibujo, serigrafía, etc.)',9,2,'102103'),('102103.03','Técnico Superior en Curaduría',9,2,'102103'),('102103.04','Técnico Superior Ebanista (tallado y escultura de madera)',9,2,'102103'),('102103.05','Técnico Superior Escaparatista',9,2,'102103'),('102103.06','Técnico Superior en Imprenta, Prensa y Preprensa',9,2,'102103'),('102103.07','Técnico Superior en Impresión 3D',9,2,'102103'),('102103.08','Técnico Superior en Artes Gráficas',9,2,'102103'),('102103.09','Técnico Superior Ilustrador',9,2,'102103'),('102103.1','Técnico Superior Operario de Restauración Artística',9,2,'102103'),('102103.11','Técnico Superior Orfebre',9,2,'102103'),('102103.12','Técnico Superior Vitralista',9,2,'102103'),('102103.13','Técnico Superior en Manualidades',9,2,'102103'),('102103.14','Técnico Superior Grabador y Serigrafista',9,2,'102103'),('102103.15','Técnico Superior en Artes',9,2,'102103'),('102104','Técnico Superior en Música y Artes Escénicas',6,2,'1021'),('102104.01','Técnico Superior Cantante',9,2,'102104'),('102104.02','Técnico Superior en Arte Dramático',9,2,'102104'),('102104.03','Técnico Superior en Grabación y Producción Musical',9,2,'102104'),('102104.04','Técnico Superior en Música',9,2,'102104'),('102104.05','Técnico Superior en Ejecución de Instrumento Musical',9,2,'102104'),('1022','Técnico Superior en Humanidades',4,2,'102'),('102201','Técnico Superior en Religión y Teología',6,2,'1022'),('102201.01','Técnico Superior en Religión y Teología',9,2,'102201'),('1023','Técnico Superior en Idiomas',4,2,'102'),('102301','Técnico Superior en Idiomas',6,2,'1023'),('102301.01','Técnico Superior en Idiomas',9,2,'102301'),('102302','Técnico Superior en Literatura y lingüística',6,2,'1023'),('102302.01','Técnico Superior en Lenguaje y Literatura',9,2,'102302'),('103','Técnico Superior en Ciencias Sociales, Periodismo,  Información y Derecho',3,2,'1'),('1031','Técnico Superior en Ciencias Sociales y del Comportamiento',4,2,'103'),('103101','Técnico Superior en Economía',6,2,'1031'),('103101.01','Técnico Superior en Economía',9,2,'103101'),('103103','Técnico Superior en Ciencias Políticas',6,2,'1031'),('103103.01','Técnico Superior en Ciencias Políticas',9,2,'103103'),('103105','Técnico Superior en Estudios Sociales y Culturales',6,2,'1031'),('103105.01','Técnico Superior en Antropología',9,2,'103105'),('103105.02','Técnico Superior en Estudios Sociales',9,2,'103105'),('103105.03','Técnico Superior en Sociología',9,2,'103105'),('103105.04','Técnico Superior en Trabajo Social',9,2,'103105'),('103105.05','Técnico Superior Orientadora Familiar',9,2,'103105'),('1032','Técnico Superior en Periodismo e Información',4,2,'103'),('103201','Técnico Superior en Periodismo,  Comunicación y Publicidad',6,2,'1032'),('103201.01','Técnico Superior en Animación (locutor) de Actividades Físicas y Deportivas',9,2,'103201'),('103201.02','Técnico Superior en Animación (locutor) de Cine y Televisión',9,2,'103201'),('103201.03','Técnico Superior en Comunicación  Radiodifusor',9,2,'103201'),('103201.04','Técnico Superior en Comunicación para Televisión',9,2,'103201'),('103201.05','Técnico Superior en Comunicación y Audiovisuales',9,2,'103201'),('103201.06','Técnico Superior en Locución Profesional',9,2,'103201'),('103201.07','Técnico Superior en Periodismo',9,2,'103201'),('103201.08','Técnico Superior en Publicidad y Mercadeo',9,2,'103201'),('103201.09','Técnico Superior en Relaciones Públicas',9,2,'103201'),('103201.1','Técnico Superior en Comunicación Social',9,2,'103201'),('103202','Técnico Superior en Bibliotecología, Documentación  y Archivología',6,2,'1032'),('103202.01','Técnico Superior en Bibliotecología',9,2,'103202'),('103202.02','Técnico Superior en Documentación y Archivología',9,2,'103202'),('103202.03','Técnico Superior en Museos',9,2,'103202'),('1033','Técnico Superior en Derecho',4,2,'103'),('103301','Técnico Superior en Derecho',6,2,'1033'),('103301.01','Técnico Superior Asistente Jurídico',9,2,'103301'),('104','Técnico Superior en Administración',3,2,'1'),('1041','Técnico Superior en Educación Comercial y Administración',4,2,'104'),('104101','Técnico Superior en Contabilidad y Auditoría',6,2,'1041'),('104101.01','Técnico Superior en Contabilidad y Auditoría',9,2,'104101'),('104102','Técnico Superior en Gestión Financiera',6,2,'1041'),('104102.01','Técnico Superior en Administración, Banca y Finanzas',9,2,'104102'),('104102.02','Técnico Superior en Administración tributaria y  Aduanera',9,2,'104102'),('104102.03','Técnico Superior en Riesgos  y Seguros',9,2,'104102'),('104103','Técnico Superior en Administración Pública y de Empresas',6,2,'1041'),('104103.01','Técnico Superior en Administración Agroindustrial',9,2,'104103'),('104103.02','Técnico Superior en Administración de Centros Infantiles',9,2,'104103'),('104103.03','Técnico Superior en Administración de Empresas',9,2,'104103'),('104103.04','Técnico Superior en Administración de Fincas',9,2,'104103'),('104103.05','Técnico Superior en Administración de Negocios',9,2,'104103'),('104103.06','Técnico Superior en Administración Agropecuaria',9,2,'104103'),('104103.07','Técnico Superior en Administración Turística y Hotelera',9,2,'104103'),('104103.08','Técnico Superior en Administración Industrial',9,2,'104103'),('104103.09','Técnico Superior en Administración Microempresarial',9,2,'104103'),('104103.1','Técnico Superior en Administración de Servicios de Salud (hospitales, Centros de salud, etc.)',9,2,'104103'),('104103.11','Técnico Superior en Administración de Boticas y Farmacias',9,2,'104103'),('104103.12','Técnico Superior en Gestión de Bares y Restaurantes',9,2,'104103'),('104103.13','Técnico Superior en Administración Pública',9,2,'104103'),('104103.14','Técnico Superior en Gestión del Patrimonio Histórico Cultural',9,2,'104103'),('104103.15','Técnico Superior en  Administración Gastronómica',9,2,'104103'),('104103.16','Técnico Superior en Gestión de Calidad',9,2,'104103'),('104104','Técnico Superior en Mercadotecnia',6,2,'1041'),('104104.01','Técnico Superior en Mercadotecnia',9,2,'104104'),('104104.02','Técnico Superior en Operación de Centrales Telefónicas',9,2,'104104'),('104104.03','Técnico Superior Visitador Médico',9,2,'104104'),('104105','Técnico Superior en Gestión de la Información Gerencial',6,2,'1041'),('104105.01','Técnico Superior en Asistencia Administrativa en Información Gerencial',9,2,'104105'),('104105.02','Técnico Superior en Secretariado (Bilingüe, Ejecutivo, etc.)',9,2,'104105'),('104106','Técnico Superior en Comercio',6,2,'1041'),('104106.01','Técnico Superior en Bienes Raíces',9,2,'104106'),('104106.02','Técnico Superior en Comercio Exterior',9,2,'104106'),('104106.03','Técnico Superior en Gestión de Producción y Servicios',9,2,'104106'),('104106.04','Técnico Superior en Comercio (Ventas)',9,2,'104106'),('104107','Técnico Superior en Competencias laborales',6,2,'1041'),('104107.01','Técnico Superior en Gestión del Talento Humano',9,2,'104107'),('105','Técnico Superior en Ciencias Naturales, Matemáticas y Estadística',3,2,'1'),('1051','Técnico Superior en Ciencias Biológicas y afines',4,2,'105'),('105101','Técnico Superior en Biología',6,2,'1051'),('105101.01','Técnico Superior en Biología',9,2,'105101'),('105109','Técnico  en Ciencia y Tecnología de Alimentos',6,2,'1051'),('105109.01','Técnico  en Ciencia y Tecnología de Alimentos',9,2,'105109'),('105110','Técnico  en Biociencia Aplicada',6,2,'1051'),('105110.01','Técnico  en Biociencia Aplicada',9,2,'105110'),('1052','Técnico Superior en Medio Ambiente',4,2,'105'),('105201','Técnico Superior en  Medio Ambiente',6,2,'1052'),('105201.01','Técnico Superior en Desarrollo Ambiental',9,2,'105201'),('105202','Técnico Superior en Recursos Naturales Renovables',6,2,'1052'),('105202.01','Técnico Superior en  Promoción de Energías Renovables (conservación de suelos)',9,2,'105202'),('1053','Técnico Superior en Ciencias Físicas',4,2,'105'),('105301','Técnico Superior en Química',6,2,'1053'),('105301.01','Técnico Superior en Química',9,2,'105301'),('105301.02','Técnico  Superior en Química Ambiental',9,2,'105301'),('105301.03','Técnico Superior en Química Industrial',9,2,'105301'),('105302','Técnico Superior en Ciencias de la Tierra',6,2,'1053'),('105302.01','Técnico Superior en Cartografía',9,2,'105302'),('105302.02','Técnico Superior Topógrafo (geomensura)',9,2,'105302'),('105302.03','Técnico Superior en Meteorología',9,2,'105302'),('105302.04','Técnico Superior Analista de Suelos',9,2,'105302'),('105303','Técnico Superior en Física',6,2,'1053'),('105303.01','Técnico Superior en Astronomía',9,2,'105303'),('105303.02','Técnico Superior en Física',9,2,'105303'),('1054','Técnico Superior en Matemáticas y Estadística',4,2,'105'),('105401','Técnico Superior en Matemáticas',6,2,'1054'),('105401.01','Técnico Superior en Matemáticas',9,2,'105401'),('105402','Técnico Superior en Estadísticas',6,2,'1054'),('105402.01','Técnico Superior en Estadísticas',9,2,'105402'),('105402.02','Técnico Superior en Demografía',9,2,'105402'),('105403','Técnico Superior en Logística y Transporte',6,2,'1054'),('105403.01','Técnico Superior en Logística Multimodal',9,2,'105403'),('105403.02','Técnico Superior en Logística y Transporte',9,2,'105403'),('105403.03','Técnico Superior en Logística Portuario',9,2,'105403'),('105403.04','Técnico Superior en Logística de Almacenamiento y Distribución',9,2,'105403'),('106','Técnico Superior en Tecnologías de la Información y la Comunicación (TIC)',3,2,'1'),('1061','Técnico Superior en Tecnologías de la Información y la Comunicación (TIC)',4,2,'106'),('106101','Técnico Superior en Computación',6,2,'1061'),('106101.01','Técnico Superior en Ensamblaje y Mantenimiento de Equipos de Cómputo',9,2,'106101'),('106101.02','Técnico Superior en Informática (computación)',9,2,'106101'),('106102','Técnico Superior en Diseño y Administración de Redes y Bases de Datos',6,2,'1061'),('106102.01','Técnico Superior en Diseño y Administración de Redes y Bases de Datos',9,2,'106102'),('106102.02','Técnico Superior en Instalación y Mantenimiento de Redes',9,2,'106102'),('106103','Técnico Superior en Desarrollo y Análisis de Software y Aplicaciones',6,2,'1061'),('106103.01','Técnico Superior Analista Programador',9,2,'106103'),('106103.02','Técnico Superior en Mantenimiento de Software',9,2,'106103'),('106104','Técnico Superior en Sistemas de Información',6,2,'1061'),('106104.01','Técnico Superior  Administración de Sistemas y Tecnologías empresariales',9,2,'106104'),('106104.02','Técnico Superior Análisis de Sistemas Informáticos',9,2,'106104'),('106104.03','Técnico Superior Auditor de Sistemas Informáticos',9,2,'106104'),('107','Técnico Superior en Ingeniería, Industria y Construcción',3,2,'1'),('1071','Técnico Superior en Ingeniería y Profesiones afines',4,2,'107'),('107102','Técnico Superior en Tecnología de Protección del Medio Ambiente',6,2,'1071'),('107102.01','Técnico Superior en Protección del Medio Ambiente',9,2,'107102'),('107102.02','Técnico Superior en Agua y Saneamiento Ambiental',9,2,'107102'),('107103','Técnico Superior en Electricidad y Energía',6,2,'1071'),('107103.01','Técnico Superior en Electricidad',9,2,'107103'),('107103.02','Técnico Superior en Mantenimiento Eléctrico y Control Industrial',9,2,'107103'),('107104','Técnico Superior en Electrónica, Automatización y Sonido',6,2,'1071'),('107104.01','Técnico Superior en Automatización e Instrumentación',9,2,'107104'),('107104.02','Técnico Superior en Electromecánica',9,2,'107104'),('107104.03','Técnico Superior en Electromecánica Automotriz',9,2,'107104'),('107104.04','Técnico Superior en Electrónica',9,2,'107104'),('107104.05','Técnico Superior en Electrónica en Instrumentación Aviónica',9,2,'107104'),('107104.06','Técnico Superior en Electrónica Radio y TV',9,2,'107104'),('107104.07','Técnico Superior en Telemática',9,2,'107104'),('107104.08','Técnico Superior Operadores de Sonido y grabación',9,2,'107104'),('107105','Técnico Superior en Mecánica y Profesiones  afines a la Metalistería',6,2,'1071'),('107105.01','Técnico Superior en Mecánica  Aeronáutica',9,2,'107105'),('107105.02','Técnico Superior en Enderezada y Pintura Automotriz',9,2,'107105'),('107105.03','Técnico Superior en Mantenimiento Mecánico',9,2,'107105'),('107105.04','Técnico Superior en Mecánica Automotriz',9,2,'107105'),('107105.05','Técnico Superior en Mecánica Industrial',9,2,'107105'),('107105.06','Técnico Superior en Mecánica Naval',9,2,'107105'),('107105.07','Técnico Superior en Mecánica y Operación de Máquinas',9,2,'107105'),('107105.08','Técnico Superior en Metalmecánica automotriz',9,2,'107105'),('107105.09','Técnico Superior en Metalurgia',9,2,'107105'),('107105.1','Técnico Superior en Refrigeración y Aire Acondicionado',9,2,'107105'),('107105.11','Técnico Superior en Soldadura',9,2,'107105'),('107105.12','Técnico Superior en Motores de Combustión',9,2,'107105'),('107110','Técnico Superior en Telecomunicaciones',6,2,'1071'),('107110.01','Técnico Superior en Redes y Telecomunicaciones',9,2,'107110'),('107110.02','Técnico Superior en Telecomunicaciones',9,2,'107110'),('1072','Técnico Superior en Industria y producción',4,2,'107'),('107201','Técnico Superior en Procesamiento de  Alimentos',6,2,'1072'),('107201.01','Técnico Superior en Industria de Alimentos',9,2,'107201'),('107201.02','Técnico Superior en  Industrialización de Productos Lácteos',9,2,'107201'),('107202','Técnico Superior en Materiales',6,2,'1072'),('107202.01','Técnico Superior Carpintero',9,2,'107202'),('107202.02','Técnico Superior en Producción Maderera',9,2,'107202'),('107202.03','Técnico Superior en Procesamiento Industrial del Vidrio',9,2,'107202'),('107203','Técnico Superior en Productos Textiles',6,2,'1072'),('107203.01','Técnico Superior en Confección de prendas de vestir',9,2,'107203'),('107203.02','Técnico Superior en Fabricación de Calzado',9,2,'107203'),('107203.03','Técnico Superior en Producción Textil',9,2,'107203'),('107203.04','Técnico Superior en Procesamiento de Cuero',9,2,'107203'),('107204','Técnico Superior en Minería y Extracción',6,2,'1072'),('107204.01','Técnico Superior en Geología y Minas',9,2,'107204'),('107204.02','Técnico Superior en Hidrocarburos',9,2,'107204'),('107204.03','Técnico Superior en Procesos de Refinación de Petróleo',9,2,'107204'),('107205','Técnico Superior en Producción Industrial',6,2,'1072'),('107205.01','Técnico Superior en Control de Calidad en Producción Industrial',9,2,'107205'),('107205.02','Técnico Superior en Instrumentación Industrial',9,2,'107205'),('107205.03','Técnico Superior en Matricería',9,2,'107205'),('107205.04','Técnico Superior en Producción Industrial',9,2,'107205'),('107206','Técnico Superior en Seguridad Industrial',6,2,'1072'),('107206.01','Técnico Superior en Seguridad Industrial',9,2,'107206'),('107207','Técnico Superior en Diseño Industrial y de Procesos',6,2,'1072'),('107207.01','Técnico Superior en Diseño y Tecnología de la Construcción Industrial',9,2,'107207'),('107208','Técnico Superior en Mantenimiento Industrial',6,2,'1072'),('107208.01','Técnico Superior en Mantenimiento Industrial',9,2,'107208'),('1073','Técnico Superior en Arquitectura y Construcción',4,2,'107'),('107302','Técnico Superior en Construcción e Ingeniería Civil',6,2,'1073'),('107302.01','Técnico Superior en Obras Civiles (asistentes en edificaciones)',9,2,'107302'),('107303','Técnico Superior en Arquitectura',6,2,'1073'),('107303.01','Técnico Superior en Dibujo Arquitectónico',9,2,'107303'),('108','Técnico Superior en Agricultura, Silvicultura, Pesca y Veterinaria',3,2,'1'),('1081','Técnico Superior en Agricultura',4,2,'108'),('108101','Técnico Superior en Producción Agrícola y Ganadera',6,2,'1081'),('108101.01','Técnico Superior en  Agroecología',9,2,'108101'),('108101.02','Técnico Superior en  Floricultura',9,2,'108101'),('108101.03','Técnico Superior en Cultivos Agrícolas',9,2,'108101'),('108101.04','Técnico Superior en Industrialización de productos agrícolas',9,2,'108101'),('108101.05','Técnico Superior en Mecanización Agrícola',9,2,'108101'),('108101.06','Técnico Superior en Agronomía',9,2,'108101'),('108101.07','Técnico Superior en Producción Agropecuaria',9,2,'108101'),('108101.08','Técnico Superior Pecuaria',9,2,'108101'),('108101.09','Técnico Superior Zootecnista',9,2,'108101'),('1082','Técnico Superior en Silvicultura',4,2,'108'),('108201','Técnico Superior en Silvicultura',6,2,'1082'),('108201.01','Técnico Superior Forestal',9,2,'108201'),('108201.02','Técnico Superior Agroforestal',9,2,'108201'),('1083','Técnico Superior en Pesca',4,2,'108'),('108301','Técnico Superior en Pesca',6,2,'1083'),('108301.01','Técnico Superior en Acuicultura',9,2,'108301'),('108301.02','Técnico Superior en Pesca',9,2,'108301'),('1084','Técnico Superior en Veterinaria',4,2,'108'),('108401','Técnico Superior en Veterinaria',6,2,'1084'),('108401.01','Técnico Superior en Cuidado Canino',9,2,'108401'),('108401.02','Técnico Superior Auxiliar Veterinario',9,2,'108401'),('109','Técnico Superior en Salud y Bienestar',3,2,'1'),('1091','Técnico Superior en Salud',4,2,'109'),('109101','Técnico Superior en Odontología',6,2,'1091'),('109101.01','Técnico Superior en Mecánica Dental (laboratorio dental)',9,2,'109101'),('109101.02','Técnico Superior en Odontología (Auxiliar Asistente para Odontología)',9,2,'109101'),('109102','Técnico Superior en Medicina',6,2,'1091'),('109102.01','Técnico Superior en Emergencia Pre-Hospitalaria (Paramédico, urgencias médicas)',9,2,'109102'),('109102.02','Técnico Superior en Instrumentación Quirúrgica',9,2,'109102'),('109103','Técnico Superior en Enfermería y Obstetricia',6,2,'1091'),('109103.01','Técnico Superior en Enfermería y Obstetricia (Auxiliar)',9,2,'109103'),('109104','Técnico Superior en Técnicas de Diagnóstico',6,2,'1091'),('109104.01','Técnico Superior en Laboratorio Clínico',9,2,'109104'),('109104.02','Técnico Superior en Optometría',9,2,'109104'),('109104.03','Técnico Superior en Podología',9,2,'109104'),('109104.04','Técnico Superior en Radiología e Imagenología',9,2,'109104'),('109104.05','Técnico Superior en  Dietética y Nutrición',9,2,'109104'),('109104.06','Técnico Superior en Tecnología Médica',9,2,'109104'),('109105','Técnico Superior en Terapia, Rehabilitación y Tratamiento de la Salud',6,2,'1091'),('109105.01','Técnico Superior en Fisioterapia',9,2,'109105'),('109105.02','Técnico Superior en Rehabilitación Física',9,2,'109105'),('109105.03','Técnico Superior en Terapia del Lenguaje (Logopedia o Fonoaudiología)',9,2,'109105'),('109105.04','Técnico Superior en Estimulación Temprana en Salud',9,2,'109105'),('109106','Técnico Superior en Farmacia',6,2,'1091'),('109106.01','Técnico Superior en Farmacia',9,2,'109106'),('109107','Técnico Superior en Salud Pública',6,2,'1091'),('109107.01','Técnico Superior en Atención Primaria en Salud (TAPS)',9,2,'109107'),('109107.02','Técnico Superior en Salud Pública',9,2,'109107'),('109107.03','Técnico Superior en Educación y Promoción de Salud',9,2,'109107'),('109109','Técnico Superior en Terapias Alternativas  y Complementarias',6,2,'1091'),('109109.01','Técnico Superior en Naturaterapia',9,2,'109109'),('109109.02','Técnico Superior en Terapias Alternativas',9,2,'109109'),('1092','Técnico Superior en Bienestar',4,2,'109'),('109201','Técnico Superior en Asistencia a Adultos Mayores y Discapacitados',6,2,'1092'),('109201.01','Técnico Superior en Asistencia a Adultos Mayores y Discapacitados (Servicios de Gerontología)',9,2,'109201'),('109202','Técnico Superior en Asistencia a la Infancia y servicios para jóvenes',6,2,'1092'),('109202.01','Técnico Superior en Desarrollo Infantil Integral  y servicios para los jóvenes',9,2,'109202'),('110','Técnico Superior en Servicios',3,2,'1'),('1101','Técnico Superior en Servicios personales',4,2,'110'),('110101','Técnico Superior en Peluquería y Tratamientos de belleza',6,2,'1101'),('110101.01','Técnico Superior en Estética Integral (cosmetología, cosmiatría, estética capilar)',9,2,'110101'),('110101.02','Técnico Superior en Peluquería (Belleza)',9,2,'110101'),('110101.03','Técnico Superior en Tanatoestética (maquillaje a los muertos)',9,2,'110101'),('110101.04','Técnico Superior Maquillista Profesional',9,2,'110101'),('110102','Técnico Superior en Hotelería y Gastronomía',6,2,'1101'),('110102.01','Técnico Superior en Gastronomía y  Arte Culinario',9,2,'110102'),('110102.02','Técnico Superior Gestor de Eventos, Ferias y Convenciones',9,2,'110102'),('110102.03','Técnico Superior en Hospitalidad y Hotelería',9,2,'110102'),('110103','Técnico Superior en Deportes',6,2,'1101'),('110103.01','Técnico Superior Director Técnico en Deportes',9,2,'110103'),('110103.02','Técnico Superior Entrenador Deportivo',9,2,'110103'),('110103.03','Técnico Superior en Deportes, Actividad Física y Recreación',9,2,'110103'),('110103.04','Técnico Superior en Gimnasia Aeróbica',9,2,'110103'),('110104','Técnico Superior en Turismo',6,2,'1101'),('110104.01','Técnico Superior en Turismo',9,2,'110104'),('110104.02','Técnico Superior Guía Nacional de Turismo',9,2,'110104'),('1102','Técnico Superior en Servicios de Protección',4,2,'110'),('110201','Técnico Superior en Prevención y Gestión de Riesgos',6,2,'1102'),('110201.01','Técnico Superior en Emergencia para desastres',9,2,'110201'),('110201.02','Técnico Superior en Seguridad y Prevención de Riesgos Laborales',9,2,'110201'),('110202','Técnico Superior en Seguridad y Salud Ocupacional',6,2,'1102'),('110202.01','Técnico Superior en Seguridad e Higiene del Trabajo',9,2,'110202'),('110202.02','Técnico Superior en Seguridad Integral',9,2,'110202'),('110202.03','Técnico Superior en Terapia Ocupacional',9,2,'110202'),('110203','Técnico Superior en Gestión Ambiental',6,2,'1102'),('110203.01','Técnico Superior en Gestión Ambiental',9,2,'110203'),('1103','Técnico Superior en Servicios de Seguridad',4,2,'110'),('110301','Técnico Superior en Educación Policial, Militar y Defensa',6,2,'1103'),('110301.01','Técnico Superior en Ciencias Militares',9,2,'110301'),('110301.02','Técnico Superior en Ciencias Policiales',9,2,'110301'),('110301.03','Técnico Superior en Inteligencia Policial',9,2,'110301'),('110301.04','Técnico Superior en Investigaciones de Policía Judicial',9,2,'110301'),('110301.05','Técnico Superior en Operaciones de Rescate',9,2,'110301'),('110301.06','Técnico Superior en Ciencias Aéreas Militares',9,2,'110301'),('110301.07','Técnico Superior en Ciencias Navales',9,2,'110301'),('110301.08','Técnico Superior en Criminalística',9,2,'110301'),('110301.09','Técnico Superior en Criminología',9,2,'110301'),('110302','Técnico Superior en Seguridad Ciudadana y Orden Público',6,2,'1103'),('110302.01','Técnico Superior en Ciencias de la Seguridad',9,2,'110302'),('110302.02','Técnico Superior en Investigación de Accidentes de Tránsito',9,2,'110302'),('110302.03','Técnico Superior en Vigilancia y Seguridad Ciudadana',9,2,'110302'),('110302.04','Técnico Superior en Seguridad Ciudadana y Orden Público',9,2,'110302'),('110302.05','Técnico Superior en Seguridad Electrónica',9,2,'110302'),('110302.06','Técnico Superior en Seguridad Penitenciaria',9,2,'110302'),('110302.07','Técnico Superior en  Planificación y Gestión  del Tránsito',9,2,'110302'),('1104','Técnico Superior en Servicio de transporte',4,2,'110'),('110401','Técnico Superior en Gestión del Transporte',6,2,'1104'),('110401.01','Técnico Superior en Gestión del Transporte',9,2,'110401'),('110401.02','Técnico Superior en Tráfico Aéreo  (aeromoza, pilotos comercial, tránsito aéreo, operaciones de vuelo, etc.)',9,2,'110401'),('199','Otros Títulos profesionales de Técnicos Superiores n.c.p.',3,2,'1'),('1999','Otros Títulos profesionales de Técnicos Superiores n.c.p.',4,2,'199'),('199999','Otros Títulos profesionales de Técnicos Superiores n.c.p.',9,2,'1'),('2','TECNÓLOGO SUPERIOR',1,2,NULL),('201','Tecnólogo Superior en Educación',3,2,'2'),('2011','Tecnólogo Superior en Ciencias de la Educación',4,2,'201'),('201101','Tecnólogo Superior en Ciencia de la Educación',6,2,'2011'),('201101.01','Tecnólogo Superior Asistente en Educación Inclusiva',9,2,'201101'),('201101.02','Tecnólogo Superior Asistente Pedagógico',9,2,'201101'),('201101.03','Tecnólogo Superior en Ciencias de la Educación',9,2,'201101'),('201101.04','Tecnólogo Superior en Administración Educativa',9,2,'201101'),('201102','Tecnólogo Superior en Formación para Docentes de Educación Preprimaria',6,2,'2011'),('201102.01','Tecnólogo Superior en Educación Inicial (preprimaria, parvulario)',9,2,'201102'),('201103','Tecnólogo Superior en Formación para Docentes sin Asignaturas de Especialización',6,2,'2011'),('201103.01','Tecnólogo Superior  en Docencia en Educación Básica (Educación primaria)',9,2,'201103'),('201103.02','Tecnólogo Superior en Educación Especial y  Psicorehabilitación',9,2,'201103'),('201103.03','Tecnólogo Superior en Docencia Educación Básica Intercultural Bilingüe',9,2,'201103'),('201104','Tecnólogo Superior en Formación para Docentes con Asignaturas de Especialización',6,2,'2011'),('201104.01','Tecnólogo  Superior en Formación para Docentes con asignaturas de especialización',9,2,'201104'),('201105','Tecnólogo Superior en Psicopedagogía',6,2,'2011'),('201105.01','Tecnólogo Superior en Psicopedagogía',9,2,'201105'),('202','Tecnólogo Superior en Artes y Humanidades',3,2,'2'),('2021','Tecnólogo Superior en Artes',4,2,'202'),('202101','Tecnólogo Superior en Técnicas audiovisuales y producción para medios de Comunicación',6,2,'2021'),('202101.01','Tecnólogo Superior en Animación Multimedia',9,2,'202101'),('202101.02','Tecnólogo Superior Camarógrafo',9,2,'202101'),('202101.03','Tecnólogo Superior de Animación y Arte Digital',9,2,'202101'),('202101.04','Tecnólogo Superior en Arte Audiovisual',9,2,'202101'),('202101.05','Tecnólogo Superior en Dirección de Radio y Televisión',9,2,'202101'),('202101.06','Tecnólogo Superior en Realización cinematográfica',9,2,'202101'),('202101.07','Tecnólogo Superior en Fotografía',9,2,'202101'),('202101.08','Tecnólogo Superior Sonidista de Cine y Televisión',9,2,'202101'),('202101.09','Tecnólogo Superior Maquillador y caracterizador',9,2,'202101'),('202101.1','Tecnólogo Superior Maquillista y Vestuarista de Cine y Televisión',9,2,'202101'),('202101.11','Tecnólogo Superior Pos productor Audiovisual',9,2,'202101'),('202101.12','Tecnólogo Superior Productor en Multimedia',9,2,'202101'),('202101.13','Tecnólogo Superior Productor y Realizador Audiovisual',9,2,'202101'),('202101.14','Tecnólogo Superior Realizador y Actor de Cine y Televisión',9,2,'202101'),('202101.15','Tecnólogo Superior Vestuarista Cinematográfico',9,2,'202101'),('202102','Tecnólogo Superior en Diseño',6,2,'2021'),('202102.01','Tecnólogo Superior Decorador de Interiores',9,2,'202102'),('202102.02','Tecnólogo Superior Diseñador artesanal',9,2,'202102'),('202102.03','Tecnólogo Superior Diseñador de  Modas',9,2,'202102'),('202102.04','Tecnólogo Superior Diseñador de Calzado',9,2,'202102'),('202102.05','Tecnólogo Superior Diseñador de Interiores',9,2,'202102'),('202102.06','Tecnólogo Superior Diseñador de Jardines',9,2,'202102'),('202102.07','Tecnólogo Superior Diseñador de Joyas',9,2,'202102'),('202102.08','Tecnólogo Superior Diseñador de Marroquinería',9,2,'202102'),('202102.09','Tecnólogo Superior Diseñador de Metales',9,2,'202102'),('202102.1','Tecnólogo Superior Diseñador Gráfico',9,2,'202102'),('202102.11','Tecnólogo Superior Diseñador y Programador en iluminación',9,2,'202102'),('202102.12','Tecnólogo Superior Diseño de Muebles y Objetos',9,2,'202102'),('202102.13','Tecnólogo Superior Diseño Textil',9,2,'202102'),('202102.14','Tecnólogo Superior en Diseño de Productos',9,2,'202102'),('202102.15','Tecnólogo Superior en Diseño',9,2,'202102'),('202103','Tecnólogo Superior en Artes Plásticas y Curaduría',6,2,'2021'),('202103.01','Tecnólogo Superior en Artes Gráficas',9,2,'202103'),('202103.02','Tecnólogo Superior Ebanista (tallado y escultura de madera)',9,2,'202103'),('202103.03','Tecnólogo Superior en Artes Plásticas (escultura, artesanías, cerámica, etc.)',9,2,'202103'),('202103.04','Tecnólogo Superior en Artes Visuales (pintura, dibujo, serigrafía, etc.',9,2,'202103'),('202103.05','Tecnólogo Superior en Curaduría',9,2,'202103'),('202103.06','Tecnólogo Superior en Manualidades femeninas',9,2,'202103'),('202103.07','Tecnólogo Superior Orfebre',9,2,'202103'),('202103.08','Tecnólogo Superior Restaurador de Bienes Artísticos',9,2,'202103'),('202103.09','Tecnólogo Superior Vitralista',9,2,'202103'),('202103.1','Tecnólogo Superior Escaparatista',9,2,'202103'),('202103.11','Tecnólogo Superior Ilustrador',9,2,'202103'),('202103.12','Tecnólogo Superior en Artes',9,2,'202103'),('202104','Tecnólogo Superior en Música y Artes Escénicas',6,2,'2021'),('202104.01','Tecnólogo Superior Bailarín',9,2,'202104'),('202104.02','Tecnólogo Superior Cantante (canto)',9,2,'202104'),('202104.03','Tecnólogo Superior Compositor',9,2,'202104'),('202104.04','Tecnólogo Superior Coreógrafo',9,2,'202104'),('202104.05','Tecnólogo Superior Director de Orquesta',9,2,'202104'),('202104.06','Tecnólogo Superior en Actuación y Dirección Escénicas',9,2,'202104'),('202104.07','Tecnólogo Superior en Danza',9,2,'202104'),('202104.08','Tecnólogo Superior en Ejecución de Instrumentos Musicales',9,2,'202104'),('202104.09','Tecnólogo Superior en Teatro',9,2,'202104'),('202104.1','Tecnólogo Superior en Música',9,2,'202104'),('202104.11','Tecnólogo Superior en Grabación y producción Musical',9,2,'202104'),('2022','Tecnólogo Superior en Humanidades',4,2,'202'),('202201','Tecnólogo Superior en Religión y Teología',6,2,'2022'),('202201.01','Tecnólogo Superior en Ciencias Religiosas y Educación de Valores',9,2,'202201'),('202201.02','Tecnólogo Superior en Teología',9,2,'202201'),('202201.03','Tecnólogo Superior Teólogo Pastoral',9,2,'202201'),('202203','Tecnólogo Superior en Filosofía',6,2,'2022'),('202203.01','Tecnólogo Superior en Filosofía',9,2,'202203'),('2023','Tecnólogo Superior en Idiomas',4,2,'202'),('202301','Tecnólogo Superior en Idiomas',6,2,'2023'),('202301.01','Tecnólogo Superior en Idiomas',9,2,'202301'),('202302','Tecnólogo Superior en Literatura y lingüística',6,2,'2023'),('202302.01','Tecnólogo Superior en Lenguaje  y Literatura',9,2,'202302'),('202302.02','Tecnólogo Superior Promotor en creación Literaria',9,2,'202302'),('203','Tecnólogo Superior en Ciencias Sociales, Periodismo,  Información y Derecho',3,2,'2'),('2031','Tecnólogo Superior en Ciencias Sociales y del Comportamiento',4,2,'203'),('203101','Tecnólogo Superior en Economía',6,2,'2031'),('203101.01','Tecnólogo Superior en Ciencias Económicas y Administrativas',9,2,'203101'),('203101.02','Tecnólogo Superior en Economía',9,2,'203101'),('203103','Tecnólogo Superior en Ciencias Políticas',6,2,'2031'),('203103.01','Tecnólogo Superior en Ciencias Políticas',9,2,'203103'),('203103.02','Tecnólogo Superior en Gestión Social y Desarrollo',9,2,'203103'),('203104','Tecnólogo Superior en Psicología',6,2,'2031'),('203104.01','Tecnólogo Superior en Psicología',9,2,'203104'),('203105','Tecnólogo Superior en Estudios Sociales y Culturales',6,2,'2031'),('203105.01','Tecnólogo Superior en Antropología',9,2,'203105'),('203105.02','Tecnólogo Superior en Estudios Sociales',9,2,'203105'),('203105.03','Tecnólogo Superior en Promoción Cultural y Patrimonio',9,2,'203105'),('203105.04','Tecnólogo Superior en Sociología',9,2,'203105'),('203105.05','Tecnólogo Superior en Trabajo Social',9,2,'203105'),('203105.06','Tecnólogo Superior en Orientación Familiar',9,2,'203105'),('203109','Tecnólogo Superior en Desarrollo Territorial Rural',6,2,'2031'),('203109.01','Tecnólogo en Desarrollo rural',9,2,'203109'),('2032','Tecnólogo Superior en Periodismo e Información',4,2,'203'),('203201','Tecnólogo Superior en Periodismo,  Comunicación y Publicidad',6,2,'2032'),('203201.01','Tecnólogo Superior Comunicador Digital',9,2,'203201'),('203201.02','Tecnólogo Superior en Comunicación en Radio, Televisión y Medios Escritos',9,2,'203201'),('203201.03','Tecnólogo Superior en Comunicación Informática',9,2,'203201'),('203201.04','Tecnólogo Superior en Comunicación Social',9,2,'203201'),('203201.05','Tecnólogo Superior en Comunicación Audiovisual',9,2,'203201'),('203201.06','Tecnólogo Superior en Información de Noticias',9,2,'203201'),('203201.07','Tecnólogo Superior en Producción de Radio y Televisión',9,2,'203201'),('203201.08','Tecnólogo Superior en  Relaciones Públicas',9,2,'203201'),('203201.09','Tecnólogo Superior Locutor',9,2,'203201'),('203201.1','Tecnólogo Superior Productor de medios impresos',9,2,'203201'),('203201.11','Tecnólogo Superior Productor en Comunicación audiovisual',9,2,'203201'),('203201.12','Tecnólogo Superior Productor en Radio y Televisión Comunitaria',9,2,'203201'),('203201.13','Tecnólogo Superior Productor y Conductor de Radio',9,2,'203201'),('203201.14','Tecnólogo Superior Productor y Conductor de Televisión',9,2,'203201'),('203201.15','Tecnólogo Superior en Publicidad y Mercadeo',9,2,'203201'),('203201.16','Tecnólogo Superior en Periodismo',9,2,'203201'),('203202','Tecnólogo Superior en Bibliotecología, Documentación  y Archivología',6,2,'2032'),('203202.01','Tecnólogo Superior en Bibliotecología y Documento logia',9,2,'203202'),('203202.02','Tecnólogo Superior en Museos',9,2,'203202'),('203202.03','Tecnólogo Superior Grafólogo',9,2,'203202'),('2033','Tecnólogo Superior en Derecho',4,2,'203'),('203301','Tecnólogo Superior en Derecho',6,2,'2033'),('203301.01','Tecnólogo Superior Jurídico',9,2,'203301'),('203302','Tecnólogo Superior en Derechos Humanos',6,2,'2033'),('203302.01','Tecnólogo Superior en Derechos Humanos',9,2,'203302'),('204','Tecnólogo Superior en Administración',3,2,'2'),('2041','Tecnólogo Superior en Educación Comercial y Administración',4,2,'204'),('204101','Tecnólogo Superior en Contabilidad y Auditoría',6,2,'2041'),('204101.01','Tecnólogo Superior en Auditoría',9,2,'204101'),('204101.02','Tecnólogo Superior en Contabilidad',9,2,'204101'),('204102','Tecnólogo Superior en Gestión Financiera',6,2,'2041'),('204102.01','Tecnólogo Superior en Administración Aduanera',9,2,'204102'),('204102.02','Tecnólogo Superior en Administración Bancaria',9,2,'204102'),('204102.03','Tecnólogo Superior en Administración en Seguros',9,2,'204102'),('204102.04','Tecnólogo Superior en Administración Financiera',9,2,'204102'),('204102.05','Tecnólogo Superior en Tributación',9,2,'204102'),('204103','Tecnólogo Superior en Administración Pública y de Empresas',6,2,'2041'),('204103.01','Tecnólogo Superior en Administración de Bares y Restaurantes',9,2,'204103'),('204103.02','Tecnólogo Superior en Administración de Boticas y Farmacias',9,2,'204103'),('204103.03','Tecnólogo Superior en Administración de Centros Infantiles',9,2,'204103'),('204103.04','Tecnólogo Superior en Administración de Empresas',9,2,'204103'),('204103.05','Tecnólogo Superior en Gestión de Proyectos',9,2,'204103'),('204103.06','Tecnólogo Superior en Administración de Empresas Agropecuaria',9,2,'204103'),('204103.07','Tecnólogo Superior en Métodos de Organización Administrativa',9,2,'204103'),('204103.08','Tecnólogo Superior en Administración de Empresas y Negocios',9,2,'204103'),('204103.09','Tecnólogo Superior en Administración de Fincas',9,2,'204103'),('204103.1','Tecnólogo Superior en Administración de Servicios de Salud (hospitales, Centros de salud, etc.)',9,2,'204103'),('204103.11','Tecnólogo Superior en Administración para Economía Popular Solidaria, Micro y Pequeñas Empresas',9,2,'204103'),('204103.12','Tecnólogo Superior en Gestión de Calidad',9,2,'204103'),('204103.13','Tecnólogo Superior en Administración Hotelera',9,2,'204103'),('204103.14','Tecnólogo Superior en Administración de Empresas Industriales',9,2,'204103'),('204103.15','Tecnólogo Superior en Administración Pesquera',9,2,'204103'),('204103.16','Tecnólogo Superior en Administración Pública',9,2,'204103'),('204103.17','Tecnólogo Superior en Administración Turísticas',9,2,'204103'),('204103.18','Tecnólogo Superior en Creación y Planificación de Empresas',9,2,'204103'),('204103.19','Tecnólogo Superior en Dasónomo en Administración y  Manejo Forestal',9,2,'204103'),('204103.2','Tecnólogo Superior en Gestión  del Patrimonio Histórico Cultural',9,2,'204103'),('204103.21','Tecnólogo Superior en Administración Gastronómica',9,2,'204103'),('204104','Tecnólogo Superior en Mercadotecnia',6,2,'2041'),('204104.01','Tecnólogo Superior en Imagen Corporativa (empresarial)',9,2,'204104'),('204104.02','Tecnólogo Superior en Mercadotecnia (Marketing)',9,2,'204104'),('204105','Tecnólogo Superior en Gestión de la Información Gerencial',6,2,'2041'),('204105.01','Tecnólogo Superior en Asistencia Administrativa en Información Gerencial',9,2,'204105'),('204105.02','Tecnólogo Superior en Secretariado',9,2,'204105'),('204106','Tecnólogo Superior en Comercio',6,2,'2041'),('204106.01','Tecnólogo Superior en Bienes Raíces',9,2,'204106'),('204106.02','Tecnólogo Superior en Comercio Electrónico',9,2,'204106'),('204106.03','Tecnólogo Superior en Comercio Exterior',9,2,'204106'),('204106.04','Tecnólogo Superior en Comercio (ventas)',9,2,'204106'),('204106.05','Tecnólogo Superior en Gestión de Producción y Servicios',9,2,'204106'),('204107','Tecnólogo Superior en Competencias Laborales',6,2,'2041'),('204107.01','Tecnólogo Superior en Formación Ocupacional por Competencias',9,2,'204107'),('204107.02','Tecnólogo Superior en Gestión del Talento Humano',9,2,'204107'),('204108','Tecnólogo Superior en Negocios Internacionales',6,2,'2041'),('204108.01','Tecnólogo Superior en Negocios Internacionales',9,2,'204108'),('205','Tecnólogo Superior en Ciencias Naturales, Matemáticas y Estadística',3,2,'2'),('2051','Tecnólogo Superior en Ciencias Biológicas y afines',4,2,'205'),('205101','Tecnólogo Superior en Biología',6,2,'2051'),('205101.01','Tecnólogo Superior en Biología marina',9,2,'205101'),('205101.02','Tecnólogo Superior en Biotecnología',9,2,'205101'),('205105','Tecnólogo Superior en Bioquímica',6,2,'2051'),('205105.01','Tecnólogo Superior en Bioquímico/a',9,2,'205105'),('205109','Tecnólogo  en Ciencia y Tecnología de Alimentos',6,2,'2051'),('205109.01','Tecnólogo  en Ciencia y Tecnología de Alimentos',9,2,'205109'),('205110','Tecnólogo  en Biociencia Aplicada',6,2,'2051'),('205110.01','Tecnólogo  en Biociencia Aplicada',9,2,'205110'),('2052','Tecnólogo Superior en Medio Ambiente',4,2,'205'),('205201','Tecnólogo Superior en Medio Ambiente',6,2,'2052'),('205201.01','Tecnólogo Superior en Desarrollo Ambiental',9,2,'205201'),('205201.02','Tecnólogo Superior en Salubridad y Manejo Ambiental',9,2,'205201'),('205201.03','Tecnólogo Superior en Ecología',9,2,'205201'),('205202','Tecnólogo Superior en Recursos Naturales Renovables',6,2,'2052'),('205202.01','Tecnólogo Superior en  Promoción de Energías Renovables (conservación de suelos)',9,2,'205202'),('2053','Tecnólogo Superior en Ciencias Físicas',4,2,'205'),('205301','Tecnólogo Superior en Química',6,2,'2053'),('205301.01','Tecnólogo Superior en Química',9,2,'205301'),('205302','Tecnólogo Superior en Ciencias de la Tierra',6,2,'2053'),('205302.01','Tecnólogo Superior Analista de Suelos',9,2,'205302'),('205302.02','Tecnólogo Superior en Meteorología',9,2,'205302'),('205302.03','Tecnólogo Superior Topógrafo (agrimensor)',9,2,'205302'),('205302.04','Tecnólogo Superior en Geología',9,2,'205302'),('205302.05','Tecnólogo Superior en Cartografía',9,2,'205302'),('205303','Tecnólogo Superior en Física',6,2,'2053'),('205303.01','Tecnólogo Superior en Astronomía',9,2,'205303'),('205303.02','Tecnólogo Superior en Física',9,2,'205303'),('2054','Tecnólogo Superior en Matemáticas y Estadística',4,2,'205'),('205401','Tecnólogo Superior en Matemáticas',6,2,'2054'),('205401.01','Tecnólogo Superior en Matemáticas',9,2,'205401'),('205402','Tecnólogo Superior en Estadísticas',6,2,'2054'),('205402.01','Tecnólogo Superior en Estadística y Registros de la Salud',9,2,'205402'),('205402.02','Tecnólogo Superior en Estadísticas',9,2,'205402'),('205402.03','Tecnólogo Superior en Demografía',9,2,'205402'),('205403','Tecnólogo Superior en Logística y Transporte',6,2,'2054'),('205403.01','Tecnólogo Superior  en Logística y Transporte',9,2,'205403'),('205403.02','Tecnólogo Superior en Logística Multimodal',9,2,'205403'),('205403.03','Tecnólogo Superior en Logística del Transporte Marítimo y Portuario',9,2,'205403'),('205403.04','Tecnólogo Superior en Logística de Almacenamiento y Distribución',9,2,'205403'),('206','Tecnólogo Superior en Tecnologías de la Información y la Comunicación (TIC)',3,2,'2'),('2061','Tecnólogo Superior en Tecnologías de la Información y la Comunicación (TIC)',4,2,'206'),('206101','Tecnólogo Superior en Computación',6,2,'2061'),('206101.01','Tecnólogo Superior en  Ensamblaje y Mantenimiento de Equipos de Cómputo',9,2,'206101'),('206101.02','Tecnólogo Superior en Informática (computación)',9,2,'206101'),('206102','Tecnólogo Superior en Diseño y Administración de Redes y Bases de Datos',6,2,'2061'),('206102.01','Tecnólogo Superior en Diseño y Gestión de Base de Datos',9,2,'206102'),('206102.02','Tecnólogo Superior en Diseño y Mantenimiento de Redes',9,2,'206102'),('206103','Tecnólogo Superior en Desarrollo y Análisis de Software y Aplicaciones',6,2,'2061'),('206103.01','Tecnólogo Superior en Desarrollo de Aplicaciones Móviles',9,2,'206103'),('206103.02','Tecnólogo Superior en Desarrollo de Aplicaciones Web',9,2,'206103'),('206103.03','Tecnólogo Superior en Desarrollo de Software',9,2,'206103'),('206103.04','Tecnólogo Superior Analista Programador',9,2,'206103'),('206104','Tecnólogo Superior en Sistemas de Información',6,2,'2061'),('206104.01','Tecnólogo Superior Auditor de Sistemas',9,2,'206104'),('206104.02','Tecnólogo Superior en Análisis de Sistemas',9,2,'206104'),('206104.03','Tecnólogo Superior en Informática Empresarial',9,2,'206104'),('206104.04','Tecnólogo Superior en Sistema de Simulación Informática',9,2,'206104'),('206104.05','Tecnólogo Superior en Tecnologías de la Información',9,2,'206104'),('207','Tecnólogo Superior en Ingeniería, Industria y Construcción',3,2,'2'),('2071','Tecnólogo Superior en Ingeniería y Profesiones afines',4,2,'207'),('207101','Tecnólogo Superior en Química Aplicada',6,2,'2071'),('207101.01','Tecnólogo Superior en Polímeros',9,2,'207101'),('207101.02','Tecnólogo Superior en Petroquímica',9,2,'207101'),('207102','Tecnólogo Superior en Tecnología de Protección del Medio Ambiente',6,2,'2071'),('207102.01','Tecnólogo Superior en Agua Potable y Saneamiento Ambiental',9,2,'207102'),('207102.02','Tecnólogo Superior en Medición y Monitoreo Ambiental',9,2,'207102'),('207102.03','Tecnólogo Superior en Protección del Medio Ambiente',9,2,'207102'),('207102.04','Tecnólogo Superior en Tratamiento de Desechos',9,2,'207102'),('207103','Tecnólogo Superior en Electricidad y Energía',6,2,'2071'),('207103.01','Tecnólogo Superior en  Electricidad y Potencia',9,2,'207103'),('207103.02','Tecnólogo Superior en  Mantenimiento Eléctrico y Control Industrial',9,2,'207103'),('207103.03','Tecnólogo Superior en Electricidad',9,2,'207103'),('207103.04','Tecnólogo Superior en Energías Alternativas',9,2,'207103'),('207104','Tecnólogo Superior en Electrónica, Automatización y Sonido',6,2,'2071'),('207104.01','Tecnólogo Superior en Automatización e Instrumentación',9,2,'207104'),('207104.02','Tecnólogo Superior en Electromecánica',9,2,'207104'),('207104.03','Tecnólogo Superior en Electromecánica automotriz',9,2,'207104'),('207104.04','Tecnólogo Superior en Electrónica',9,2,'207104'),('207104.05','Tecnólogo Superior en Electrónica en Instrumentación Aviónica',9,2,'207104'),('207104.06','Tecnólogo Superior en Telemática',9,2,'207104'),('207104.07','Tecnólogo Superior Productor de Sonido',9,2,'207104'),('207105','Tecnólogo Superior en Mecánica y Profesiones  afines a la Metalistería',6,2,'2071'),('207105.01','Tecnólogo Superior  en Mecánica Naval',9,2,'207105'),('207105.02','Tecnólogo Superior en  Mantenimiento Mecánico',9,2,'207105'),('207105.03','Tecnólogo Superior en  Mantenimiento y Reparación de Motores a Diésel y Gasolina',9,2,'207105'),('207105.04','Tecnólogo Superior en  Metalmecánica',9,2,'207105'),('207105.05','Tecnólogo Superior en Mecánica Aeronáutica',9,2,'207105'),('207105.06','Tecnólogo Superior en Mecánica Automotriz',9,2,'207105'),('207105.07','Tecnólogo Superior en Mecánica Industrial',9,2,'207105'),('207105.08','Tecnólogo Superior en Procesos de Producción Mecánica',9,2,'207105'),('207105.09','Tecnólogo Superior en Refrigeración y Aíre Acondicionado',9,2,'207105'),('207105.1','Tecnólogo Superior en Soldadura',9,2,'207105'),('207105.11','Tecnólogo Superior en Mecánica y Operación de Máquinas',9,2,'207105'),('207105.12','Tecnólogo Superior en Mecánica',9,2,'207105'),('207105.13','Tecnólogo Superior en Metalurgia',9,2,'207105'),('207106','Tecnólogo Superior en Diseño y Construcción de vehículos, barcos y aeronaves motorizadas',6,2,'2071'),('207106.01','Tecnólogo Superior en Autotronica y Gerencia de Servicio Automotriz',9,2,'207106'),('207106.02','Tecnólogo Superior en Sistemas de Inyección a Diésel',9,2,'207106'),('207106.03','Tecnólogo Superior en Sistemas de Inyección a Gasolina',9,2,'207106'),('207108','Tecnólogo Superior en Mecatrónica',6,2,'2071'),('207108.01','Tecnólogo Superior en Mecatrónica Automotriz',9,2,'207108'),('207110','Tecnólogo Superior en  Telecomunicaciones',6,2,'2071'),('207110.01','Tecnólogo Superior en Redes y Telecomunicaciones',9,2,'207110'),('207110.02','Tecnólogo Superior en Telecomunicaciones',9,2,'207110'),('2072','Tecnólogo Superior en Industria y Producción',4,2,'207'),('207201','Tecnólogo Superior en Procesamiento de  Alimentos',6,2,'2072'),('207201.01','Tecnólogo Superior en Enología (elaboración de vinos)',9,2,'207201'),('207201.02','Tecnólogo Superior en Industrialización de Alimentos Agrícolas',9,2,'207201'),('207201.03','Tecnólogo Superior en Industrialización de Productos Lácteos',9,2,'207201'),('207201.04','Tecnólogo Superior en Procesamiento de Alimentos',9,2,'207201'),('207202','Tecnólogo Superior en Materiales',6,2,'2072'),('207202.01','Tecnólogo Superior Carpintero',9,2,'207202'),('207202.02','Tecnólogo Superior en Procesamiento Industrial de la Madera',9,2,'207202'),('207202.03','Tecnólogo Superior en Procesamiento Industrial del Plástico',9,2,'207202'),('207202.04','Tecnólogo Superior en Procesamiento Industrial del Vidrio',9,2,'207202'),('207203','Tecnólogo Superior en Productos Textiles',6,2,'2072'),('207203.01','Tecnólogo Superior en Confección Textil (prendas de vestir, etc.)',9,2,'207203'),('207203.02','Tecnólogo Superior en Fabricación de Calzado',9,2,'207203'),('207203.03','Tecnólogo Superior en Procesamiento de Cuero',9,2,'207203'),('207203.04','Tecnólogo Superior en Producción  Textil',9,2,'207203'),('207204','Tecnólogo Superior en Minería y Extracción',6,2,'2072'),('207204.01','Tecnólogo Superior en Minería',9,2,'207204'),('207204.02','Tecnólogo Superior en Petróleos',9,2,'207204'),('207205','Tecnólogo Superior en Producción Industrial',6,2,'2072'),('207205.01','Tecnólogo Superior en Gestión de la Calidad en la Producción Industrial',9,2,'207205'),('207205.02','Tecnólogo Superior en Impresión Offset y Acabados',9,2,'207205'),('207205.03','Tecnólogo Superior en Matricería',9,2,'207205'),('207205.04','Tecnólogo Superior en Producción Industrial',9,2,'207205'),('207207','Tecnólogo Superior en Diseño Industrial y de Procesos',6,2,'2072'),('207207.01','Tecnólogo Superior en Diseño Industrial y de Procesos',9,2,'207207'),('207208','Tecnólogo Superior en Mantenimiento Industrial',6,2,'2072'),('207208.01','Tecnólogo Superior en Mantenimiento y Seguridad Industrial',9,2,'207208'),('2073','Tecnólogo Superior en Arquitectura y construcción',4,2,'207'),('207302','Tecnólogo Superior en Construcción e Ingeniería Civil',6,2,'2073'),('207302.01','Tecnólogo Superior en administración de proyectos de construcción',9,2,'207302'),('207302.02','Tecnólogo Superior en Catastros',9,2,'207302'),('207302.03','Tecnólogo Superior en Construcción',9,2,'207302'),('207302.04','Tecnólogo Superior en Domótica',9,2,'207302'),('207303','Tecnólogo Superior en Arquitectura',6,2,'2073'),('207303.01','Tecnólogo Superior en Arquitectura',9,2,'207303'),('208','Tecnólogo Superior en Agricultura, Silvicultura, Pesca y Veterinaria',3,2,'2'),('2081','Tecnólogo Superior en Agricultura',4,2,'208'),('208101','Tecnólogo Superior en Producción Agrícola y Ganadera',6,2,'2081'),('208101.01','Tecnólogo Superior Agropecuario',9,2,'208101'),('208101.02','Tecnólogo Superior en Agrozootecnia',9,2,'208101'),('208101.03','Tecnólogo Superior en Agroecología',9,2,'208101'),('208101.04','Tecnólogo Superior en Agroindustria',9,2,'208101'),('208101.05','Tecnólogo Superior en Agronomía',9,2,'208101'),('208101.06','Tecnólogo Superior en Cunicultura y Especies Menores',9,2,'208101'),('208101.07','Tecnólogo Superior en Floricultura',9,2,'208101'),('208101.08','Tecnólogo Superior en Flori-fruticultura',9,2,'208101'),('208101.09','Tecnólogo Superior en Fruticultura',9,2,'208101'),('208101.1','Tecnólogo Superior en Mecanización Agrícola Riego y Drenaje',9,2,'208101'),('208101.11','Tecnólogo Superior en Permacultura',9,2,'208101'),('208101.12','Tecnólogo Superior en Producción Agrícola  (Cultivos)',9,2,'208101'),('208101.13','Tecnólogo Superior en Producción Animal',9,2,'208101'),('208101.14','Tecnólogo Superior en Producción Pecuaria',9,2,'208101'),('208101.15','Tecnólogo Superior en Zootécnica',9,2,'208101'),('2082','Tecnólogo Superior en Silvicultura',4,2,'208'),('208201','Tecnólogo Superior en Silvicultura',6,2,'2082'),('208201.01','Tecnólogo Superior en Agroforestal',9,2,'208201'),('208201.02','Tecnólogo Superior Forestal',9,2,'208201'),('208201.03','Tecnólogo Superior Silvoagropecuario',9,2,'208201'),('2083','Tecnólogo Superior en Pesca',4,2,'208'),('208301','Tecnólogo Superior en Pesca',6,2,'2083'),('208301.01','Tecnólogo Superior en Acuicultura',9,2,'208301'),('208301.02','Tecnólogo Superior en Pesca',9,2,'208301'),('2084','Tecnólogo Superior en Veterinaria',4,2,'208'),('208401','Tecnólogo Superior en Veterinaria',6,2,'2084'),('208401.01','Tecnólogo Superior en Cuidado Canino',9,2,'208401'),('208401.02','Tecnólogo Superior en Nutrición Animal',9,2,'208401'),('208401.03','Tecnólogo Superior en Veterinaria',9,2,'208401'),('209','Tecnólogo Superior en Salud y Bienestar',3,2,'2'),('2091','Tecnólogo Superior en Salud',4,2,'209'),('209101','Tecnólogo Superior en Odontología',6,2,'2091'),('209101.01','Tecnólogo Superior en Laboratorio Dental (mecánica dental)',9,2,'209101'),('209101.02','Tecnólogo en Salud Oral',9,2,'209101'),('209102','Tecnólogo Superior en Medicina',6,2,'2091'),('209102.01','Tecnólogo Superior en Emergencia Pre-Hospitalaria (paramédico, urgencias médicas)',9,2,'209102'),('209102.02','Tecnólogo Superior en Instrumentación Quirúrgica',9,2,'209102'),('209103','Tecnólogo Superior en Enfermería y Obstetricia',6,2,'2091'),('209103.01','Tecnólogo Superior en Enfermería',9,2,'209103'),('209104','Tecnólogo Superior en Técnicas de Diagnóstico',6,2,'2091'),('209104.01','Tecnólogo Superior en Tecnología Médica',9,2,'209104'),('209104.02','Tecnólogo Superior en  Dietética y Nutrición',9,2,'209104'),('209104.03','Tecnólogo Superior en Anatomía Patológica',9,2,'209104'),('209104.04','Tecnólogo Superior en Anestesiología',9,2,'209104'),('209104.05','Tecnólogo Superior en Audioterapeuta',9,2,'209104'),('209104.06','Tecnólogo Superior en Citotecnia',9,2,'209104'),('209104.07','Tecnólogo Superior en Medicina Nuclear',9,2,'209104'),('209104.08','Tecnólogo Superior en Imagenología y Radiología',9,2,'209104'),('209104.09','Tecnólogo Superior en Laboratorio Clínico',9,2,'209104'),('209104.1','Tecnólogo Superior en Podología',9,2,'209104'),('209104.11','Tecnólogo Superior en Optometría',9,2,'209104'),('209104.12','Tecnólogo Superior en Ortesis y Prótesis',9,2,'209104'),('209104.13','Tecnólogo Superior en Ortoptica',9,2,'209104'),('209104.14','Tecnólogo Superior en Patología',9,2,'209104'),('209105','Tecnólogo Superior en Terapias, Rehabilitación y Tratamiento de la Salud',6,2,'2091'),('209105.01','Tecnólogo  Médico en Terapia del Lenguaje (logopedia o Fonoaudiología)',9,2,'209105'),('209105.02','Tecnólogo Superior en Fisioterapia en Medicina del Deporte',9,2,'209105'),('209105.03','Tecnólogo Superior en Pedagogía Terapeuta',9,2,'209105'),('209105.04','Tecnólogo Superior en Rehabilitación  Física',9,2,'209105'),('209105.05','Tecnólogo Superior en Terapia Cardio-Respiratoria',9,2,'209105'),('209105.06','Tecnólogo Superior en Terapia Física',9,2,'209105'),('209105.07','Tecnólogo Superior Fisioterapeuta o Fisioterapista',9,2,'209105'),('209105.08','Tecnólogo Superior en Estimulación Temprana en Salud',9,2,'209105'),('209106','Tecnólogo Superior en Farmacia',6,2,'2091'),('209106.01','Tecnólogo Superior en Farmacia (Química y Farmacia)',9,2,'209106'),('209107','Tecnólogo Superior en Salud Pública',6,2,'2091'),('209107.01','Tecnólogo Superior  en Educación y Promoción para la Salud',9,2,'209107'),('209107.02','Tecnólogo Superior en Atención Primaria de Salud',9,2,'209107'),('209107.03','Tecnólogo Superior en Salud Pública',9,2,'209107'),('209107.04','Tecnólogo Superior Medicina Familiar y Comunitaria',9,2,'209107'),('209109','Tecnólogo en Terapias Alternativas  y Complementarias',6,2,'2091'),('209109.01','Tecnólogo Superior en Ciencias Ancestrales, Medicina Andina',9,2,'209109'),('209109.02','Tecnólogo Superior en Naturopatía',9,2,'209109'),('209109.03','Tecnólogo Superior Terapista en Reiki',9,2,'209109'),('2092','Tecnólogo Superior en Bienestar',4,2,'209'),('209201','Tecnólogo Superior en Asistencia a Adultos Mayores y Discapacitados',6,2,'2092'),('209201.01','Tecnólogo Superior en  Atención Integral a Adultos Mayores (Servicios de Gerontología)',9,2,'209201'),('209202','Tecnólogo Superior en Asistencia a la Infancia y Servicios para jóvenes',6,2,'2092'),('209202.01','Tecnólogo Superior en Desarrollo Infantil Integral y servicios para los jóvenes',9,2,'209202'),('210','Tecnólogo Superior en Servicios',3,2,'2'),('2101','Tecnólogo Superior en Servicios personales',4,2,'210'),('210101','Tecnólogo Superior en Peluquería y Tratamientos de belleza',6,2,'2101'),('210101.01','Tecnólogo Superior Asesor de Imagen',9,2,'210101'),('210101.02','Tecnólogo Superior en Estética Integral (cosmetología, cosmiatría, estética capilar)',9,2,'210101'),('210101.03','Tecnólogo Superior en Peluquería (belleza)',9,2,'210101'),('210102','Tecnólogo Superior en Hotelería y Gastronomía',6,2,'2101'),('210102.01','Tecnólogo Superior en Gastronomía',9,2,'210102'),('210102.02','Tecnólogo Superior en Dietética y Cocina Light',9,2,'210102'),('210102.03','Tecnólogo Superior Gestor de Eventos, Ferias y Convenciones',9,2,'210102'),('210102.04','Tecnólogo Superior en Hotelería y Turismo',9,2,'210102'),('210102.05','Tecnólogo Superior en Panadería y Repostería',9,2,'210102'),('210103','Tecnólogo Superior en Deportes',6,2,'2101'),('210103.01','Tecnólogo Superior Deportivo Preparador Físico',9,2,'210103'),('210103.02','Tecnólogo Superior Director Técnico en Deportes',9,2,'210103'),('210103.03','Tecnólogo Superior en  Deportes, Actividad Física y Recreación.',9,2,'210103'),('210103.04','Tecnólogo Superior en Dirección Técnica de Fútbol',9,2,'210103'),('210103.05','Tecnólogo Superior Entrenador Deportivo',9,2,'210103'),('210104','Tecnólogo Superior en Turismo',6,2,'2101'),('210104.01','Tecnólogo Superior en Ecoturismo',9,2,'210104'),('210104.02','Tecnólogo Superior en Guía de Turismo',9,2,'210104'),('210104.03','Tecnólogo Superior en Operaciones Turísticas',9,2,'210104'),('210104.04','Tecnólogo Superior en Turismo',9,2,'210104'),('2102','Tecnólogo Superior en Servicios de Protección',4,2,'210'),('210201','Tecnólogo Superior en Prevención y Gestión de Riesgos',6,2,'2102'),('210201.01','Tecnólogo Superior en Riesgos y desastres',9,2,'210201'),('210202','Tecnólogo Superior en Seguridad y Salud Ocupacional',6,2,'2102'),('210202.01','Tecnólogo Superior en Seguridad e Higiene del Trabajo',9,2,'210202'),('210202.02','Tecnólogo Superior en Seguridad Integral',9,2,'210202'),('210202.03','Tecnólogo Superior en Seguridad y Prevención de Riesgos Laborales',9,2,'210202'),('210202.04','Tecnólogo Superior en Terapia Ocupacional',9,2,'210202'),('210203','Tecnólogo Superior en Gestión Ambiental',6,2,'2102'),('210203.01','Tecnólogo Superior en  Gestión Ambiental',9,2,'210203'),('2103','Tecnólogo Superior en Servicios de Seguridad',4,2,'210'),('210301','Tecnólogo Superior en Educación Policial, Militar y Defensa',6,2,'2103'),('210301.01','Tecnólogo Superior en Análisis Delictual',9,2,'210301'),('210301.02','Tecnólogo Superior en Búsqueda de Personas y Rescate Personal',9,2,'210301'),('210301.03','Tecnólogo Superior en Ciencias Policiales',9,2,'210301'),('210301.04','Tecnólogo Superior en Ciencias Militares',9,2,'210301'),('210301.05','Tecnólogo Superior en Ciencias Navales Militares',9,2,'210301'),('210301.06','Tecnólogo Superior en Criminalística',9,2,'210301'),('210301.07','Tecnólogo Superior en Criminología',9,2,'210301'),('210301.08','Tecnólogo Superior en Ciencia Aérea Militares',9,2,'210301'),('210301.09','Tecnólogo Superior en Investigaciones de Policía Judicial',9,2,'210301'),('210301.1','Tecnólogo Superior en Operaciones de Rescate',9,2,'210301'),('210301.11','Tecnólogo Superior en Operaciones Militares de Selva Iwia',9,2,'210301'),('210302','Tecnólogo Superior en Seguridad Ciudadana y Orden Público',6,2,'2103'),('210302.01','Tecnólogo Superior en Investigación de Accidentes de Tránsito',9,2,'210302'),('210302.02','Tecnólogo Superior en Planificación y Gestión  del Tránsito',9,2,'210302'),('210302.03','Tecnólogo Superior en Seguridad Ciudadana y orden Público',9,2,'210302'),('210302.04','Tecnólogo Superior en Seguridad Electrónica',9,2,'210302'),('210302.05','Tecnólogo Superior en Seguridad Penitenciaria',9,2,'210302'),('210302.06','Tecnólogo Superior en Vigilancia y Seguridad Ciudadana',9,2,'210302'),('210302.07','Tecnólogo Superior en Vigilancia y Seguridad de Bosques',9,2,'210302'),('210302.08','Tecnólogo Superior Guardacostas',9,2,'210302'),('210302.09','Tecnólogo Superior Guarda parques',9,2,'210302'),('210302.1','Tecnólogo Superior en Ciencias de la Seguridad',9,2,'210302'),('2104','Tecnólogo Superior en Servicio de transporte',4,2,'210'),('210401','Tecnólogo Superior en Gestión del Transporte',6,2,'2104'),('210401.01','Tecnólogo Superior en Planificación y Gestión del Transporte Terrestre',9,2,'210401'),('210401.02','Tecnólogo Superior en Tráfico Aéreo (aeromoza, pilotos comercial, tránsito aéreo, operaciones de vuelo, etc.)',9,2,'210401'),('299','Otros Títulos profesionales de Tecnólogos Superiores n.c.p.',3,2,'2'),('2999','Otros Títulos profesionales de Tecnólogos Superiores n.c.p.',4,2,'299'),('299999','Otros Títulos profesionales de Tecnólogos Superiores n.c.p.',9,2,'2'),('3','TERCER NIVEL',1,3,NULL),('301','Tercer Nivel en Educación',3,3,'3'),('3011','Tercer Nivel en Ciencias de la Educación',4,3,'301'),('301101','Tercer Nivel en Ciencias de la Educación',6,3,'3011'),('301101.01','Licenciado/a en Ciencias de la Educación',9,3,'301101'),('301101.02','Licenciado/a en Ciencias de la Educación en Administración y Supervisión Educativa',9,3,'301101'),('301101.03','Licenciado/a en Innovación Educativa',9,3,'301101'),('301102','Tercer Nivel en Formación para Docentes de Educación Preprimaria',6,3,'3011'),('301102.01','Licenciado/a en Ciencias de la Educación  Inicial (preprimaria, parvulario)',9,3,'301102'),('301103','Tercer Nivel en Formación para Docentes sin Asignaturas de Especialización',6,3,'3011'),('301103.01','Licenciado/a en Ciencias de la Educación Básica (Educación primaria)',9,3,'301103'),('301103.02','Licenciado/a en Ciencias de la Educación Especial y Psicorehabilitación',9,3,'301103'),('301103.03','Licenciado/a en Ciencias de la Educación Intercultural Bilingüe.',9,3,'301103'),('301104','Tercer Nivel en Formación para Docentes con Asignaturas de Especialización',6,3,'3011'),('301104.01','Licenciado/a en Pedagogía de la Historia y las Ciencias Sociales',9,3,'301104'),('301104.02','Licenciado/a en Pedagogía de la Lengua y Literatura',9,3,'301104'),('301104.03','Licenciado/a en Pedagogía de la Química y Biología',9,3,'301104'),('301104.04','Licenciado/a en Pedagogía de las Matemáticas y la Física',9,3,'301104'),('301104.05','Licenciado/a en Educación en Ciencias Experimentales',9,3,'301104'),('301104.06','Licenciado/a en Pedagogía  Idioma',9,3,'301104'),('301104.07','Licenciado/a en Pedagogía de la Filosofía',9,3,'301104'),('301104.08','Licenciado/a en Pedagogía de la Informática',9,3,'301104'),('301104.09','Licenciado/a en Pedagogía de las Artes',9,3,'301104'),('301104.1','Otros Licenciado/a en Pedagogía con Asignaturas de Especialización',9,3,'301104'),('301105','Tercer Nivel en Psicopedagogía',6,3,'3011'),('301105.01','Licenciado/a en Psicopedagogía',9,3,'301105'),('302','Tercer Nivel en Artes y Humanidades',3,3,'3'),('3021','Tercer Nivel en Artes',4,3,'302'),('302101','Tercer Nivel en Técnicas audiovisuales y producción para medios de Comunicación',6,3,'3021'),('302101.01','Licenciado/a en Animación Digital',9,3,'302101'),('302101.02','Licenciado/a en Cine',9,3,'302101'),('302101.03','Licenciado/a en Comunicación Audiovisual',9,3,'302101'),('302101.04','licenciado/a en Fotografía',9,3,'302101'),('302101.05','Licenciado/a en Producción para Medios de Comunicación',9,3,'302101'),('302101.06','Licenciado/a en Técnicas Audiovisuales',9,3,'302101'),('302101.07','Licenciado/a en Producción y Realización de Radio y Televisión',9,3,'302101'),('302102','Tercer Nivel en Diseño',6,3,'3021'),('302102.01','Licenciado en Diseño de Modas',9,3,'302102'),('302102.02','Licenciado en Diseño y Multimedia',9,3,'302102'),('302102.03','Licenciado/a en Diseño de Interiores',9,3,'302102'),('302102.04','licenciado/a en Diseño de Productos',9,3,'302102'),('302102.05','Licenciado/a en Diseño Gráfico',9,3,'302102'),('302102.06','Licenciado/a en Diseño Textil e Indumentaria',9,3,'302102'),('302102.07','Licenciado/a en Decoración de Interiores',9,3,'302102'),('302102.08','Licenciado/a en Diseño',9,3,'302102'),('302103','Tercer Nivel en Artes Plásticas y Curaduría',6,3,'3021'),('302103.01','Licenciado/a en Artes Plásticas (escultura, artesanías, cerámica, etc.)',9,3,'302103'),('302103.02','Licenciado/a en Artes Visuales (pintura, dibujo, serigrafía, etc.)',9,3,'302103'),('302103.03','Licenciado/a en Curaduría',9,3,'302103'),('302103.04','Licenciado/a en Restauración Artística',9,3,'302103'),('302103.05','Licenciado/a en Artes Gráficas',9,3,'302103'),('302103.06','Licenciado/a en Arte',9,3,'302103'),('302104','Tercer Nivel en Música y Artes Escénicas',6,3,'3021'),('302104.01','Licenciado/a en Artes Escénicas',9,3,'302104'),('302104.02','Licenciado/a en Artes Musicales',9,3,'302104'),('302104.03','Licenciado/a en Canto',9,3,'302104'),('302104.04','Licenciado/a en Creación Teatral',9,3,'302104'),('302104.05','Licenciado/a en Danza',9,3,'302104'),('302104.06','Licenciado/a en Producción Musical y Sonora',9,3,'302104'),('302104.07','Licenciado/a en Ejecución de Instrumento Musical',9,3,'302104'),('3022','Tercer Nivel en Humanidades',4,3,'302'),('302201','Tercer Nivel en Religión y Teología',6,3,'3022'),('302201.01','Licenciado/a en Ciencias Religiosas',9,3,'302201'),('302201.02','Licenciado/a en Teología',9,3,'302201'),('302202','Tercer Nivel en Historia y Arqueología',6,3,'3022'),('302202.01','Licenciado/a en Arqueología',9,3,'302202'),('302202.02','Licenciado/a en Crítica e Historia del Arte',9,3,'302202'),('302202.03','Licenciado/a en Historia',9,3,'302202'),('302203','Tercer Nivel en Filosofía',6,3,'3022'),('302203.01','Licenciado/a en Filosofía',9,3,'302203'),('3023','Tercer Nivel en Idiomas',4,3,'302'),('302301','Tercer Nivel en Idiomas',6,3,'3023'),('302301.01','Licenciado /a en Idioma (Castellano-Inglés- Francés, etc.)',9,3,'302301'),('302302','Tercer Nivel en Literatura y Lingüística',6,3,'3023'),('302302.01','Licenciado/a en Lingüística',9,3,'302302'),('302302.02','Licenciado/a en Lengua y Literatura',9,3,'302302'),('303','Tercer Nivel en Ciencias Sociales, Periodismo,  Información y Derecho',3,3,'3'),('3031','Tercer Nivel en Ciencias Sociales y del Comportamiento',4,3,'303'),('303101','Tercer Nivel en Economía',6,3,'3031'),('303101.01','Economista (Licenciado/a en Economía)',9,3,'303101'),('303102','Tercer Nivel en Economía Matemática',6,3,'3031'),('303102.01','Licenciado/a en Economía Matemática',9,3,'303102'),('303103','Tercer Nivel en Ciencias Políticas',6,3,'3031'),('303103.01','Licenciado/a en Ciencias Políticas',9,3,'303103'),('303103.02','Licenciado/a en Desarrollo Local',9,3,'303103'),('303103.03','Licenciado/a en Gestión Social y Desarrollo',9,3,'303103'),('303103.04','Licenciado/a en Relaciones Internacionales',9,3,'303103'),('303103.05','Licenciado/a en Gobernanza y Gobernabilidad',9,3,'303103'),('303104','Tercer Nivel en Psicología',6,3,'3031'),('303104.01','Licenciado /a en Psicología Clínica',9,3,'303104'),('303104.02','Licenciado /a en Psicología Organizacional (laboral)',9,3,'303104'),('303104.03','Licenciado/a en Psicología',9,3,'303104'),('303105','Tercer Nivel en Estudios Sociales y Culturales',6,3,'3031'),('303105.01','Licenciado/a en Antropología',9,3,'303105'),('303105.02','Licenciado/a en Artes Liberales',9,3,'303105'),('303105.03','Licenciado/a en Estudios Culturales y Patrimonio',9,3,'303105'),('303105.04','Licenciado/a en Estudios Sociales',9,3,'303105'),('303105.05','Licenciado/a en Orientación Familiar',9,3,'303105'),('303105.06','Licenciado/a en Sociología',9,3,'303105'),('303105.07','Licenciado/a en Trabajo Social',9,3,'303105'),('303105.08','Licenciado/a en Estudios Internacionales',9,3,'303105'),('303106','Tercer Nivel en Estudios de Género',6,3,'3031'),('303106.01','Licenciado/a en Género y Desarrollo',9,3,'303106'),('303107','Tercer Nivel en Geografía y Territorio',6,3,'3031'),('303107.01','Licenciado/a en Geografía y Territorio',9,3,'303107'),('3032','Tercer Nivel en Periodismo e Información',4,3,'303'),('303201','Tercer Nivel en Periodismo, Comunicación y Publicidad',6,3,'3032'),('303201.01','Licenciado/a  Comunicación Social',9,3,'303201'),('303201.02','Licenciado/a en Periodismo',9,3,'303201'),('303201.03','Licenciado/a en Publicidad',9,3,'303201'),('303201.04','Licenciado/a en Relaciones Públicas',9,3,'303201'),('303202','Tercer Nivel en Bibliotecología, Documentación  y Archivología',6,3,'3032'),('303202.01','Licenciado/a en Bibliotecología, Documentación y Archivo',9,3,'303202'),('303202.02','Licenciado/a en Museos',9,3,'303202'),('3033','Tercer Nivel en Derecho',4,3,'303'),('303301','Tercer Nivel en Derecho',6,3,'3033'),('303301.01','Abogado/a',9,3,'303301'),('303302','Licenciado en Derechos Humanos',6,3,'3033'),('303302.01','Licenciado en Derechos Humanos',9,3,'303302'),('304','Tercer Nivel en Administración',3,3,'3'),('3041','Tercer Nivel en Educación Comercial y Administración',4,3,'304'),('304101','Tercer Nivel en Contabilidad y Auditoría',6,3,'3041'),('304101.01','Licenciado en Auditoría y Control de Gestión',9,3,'304101'),('304101.02','Licenciado/a en Contabilidad y Auditoría',9,3,'304101'),('304102','Tercer Nivel en Gestión Financiera',6,3,'3041'),('304102.01','Licenciado/a en Administración Banca y Finanzas',9,3,'304102'),('304102.02','Licenciado/a en Administración en Seguros y Bursátil',9,3,'304102'),('304102.03','Licenciado/a en Finanzas y Tributación',9,3,'304102'),('304102.04','Licenciado/a en Administración Aduanera',9,3,'304102'),('304103','Tercer Nivel en Administración Pública y de Empresas',6,3,'3041'),('304103.01','Licenciado/a en Administración  Pública',9,3,'304103'),('304103.02','Licenciado/a en Administración de Empresas',9,3,'304103'),('304103.03','Licenciado/a en Administración de Empresas Agroindustriales',9,3,'304103'),('304103.04','Licenciado/a en Administración de Servicios de Salud (hospitales, Centros de salud, etc.)',9,3,'304103'),('304103.05','Licenciado/a en Administración Industrial',9,3,'304103'),('304103.06','Licenciado/a en Administración Turística y Hotelera',9,3,'304103'),('304103.07','Licenciado/a en Administración de Negocios',9,3,'304103'),('304103.08','Licenciado/a en  Métodos de Organización Administrativa',9,3,'304103'),('304103.09','Licenciado/a en Gestión de Proyectos',9,3,'304103'),('304103.1','Licenciado/a en Administración de Centros Infantiles',9,3,'304103'),('304103.11','Licenciado/a en Gestión del Patrimonio Histórico Cultural',9,3,'304103'),('304103.12','Licenciado/a en Administración Gastronómica',9,3,'304103'),('304103.13','Licenciado/a en Gerencia y Liderazgo',9,3,'304103'),('304104','Tercer Nivel en Mercadotecnia',6,3,'3041'),('304104.01','Licenciado/a en Mercadotecnia (Marketing)',9,3,'304104'),('304105','Tercer Nivel en Gestión de la Información Gerencial',6,3,'3041'),('304105.01','Licenciado/a en Gestión de la Información Gerencial',9,3,'304105'),('304105.02','Licenciado/a en Secretariado',9,3,'304105'),('304106','Tercer Nivel en Comercio',6,3,'3041'),('304106.01','Licenciado/a en Comercio (ventas)',9,3,'304106'),('304106.02','Licenciado/a en Comercio Electrónico',9,3,'304106'),('304106.03','Licenciado/a en Comercio Exterior',9,3,'304106'),('304106.04','Licenciado/a en Gestión de Producción y Servicios',9,3,'304106'),('304106.05','Licenciado/a en Bienes y Raíces',9,3,'304106'),('304107','Tercer Nivel en Competencias laborales',6,3,'3041'),('304107.01','Licenciado/a en Gestión del Talento Humano',9,3,'304107'),('304108','Tercer Nivel en Negocios internacionales',6,3,'3041'),('304108.01','Licenciado/a en Negocios Internacionales',9,3,'304108'),('305','Tercer Nivel en Ciencias Naturales, Matemáticas y Estadística',3,3,'3'),('3051','Tercer Nivel en Ciencias Biológicas y afines',4,3,'305'),('305101','Tercer Nivel en Biología',6,3,'3051'),('305101.01','Tercer Nivel Biólogo/ a botánica',9,3,'305101'),('305101.02','Tercer Nivel Biólogo/a',9,3,'305101'),('305101.03','Tercer Nivel Biólogo/a Clínica',9,3,'305101'),('305101.04','Tercer Nivel Biólogo/a Marino',9,3,'305101'),('305101.05','Ingeniero/ a Biomolecular y Biocombustibles',9,3,'305101'),('305101.06','Ingeniero/a Biotecnología/a',9,3,'305101'),('305101.07','Licenciado/a Bacteriología',9,3,'305101'),('305101.08','Licenciado/a en Microbiología',9,3,'305101'),('305102','Tercer Nivel en Biofísica',6,3,'3051'),('305102.01','Licenciado/a en Biofísica',9,3,'305102'),('305103','Tercer Nivel en Biofarmacéutica',6,3,'3051'),('305103.01','Licenciado/a en Biofarmacéutica',9,3,'305103'),('305104','Tercer Nivel en Biomedicina',6,3,'3051'),('305104.01','Ingeniero/a Biomédico/a',9,3,'305104'),('305105','Tercer Nivel en Bioquímica',6,3,'3051'),('305105.01','Tercer Nivel Bioquímico/a',9,3,'305105'),('305106','Tercer Nivel en Genética',6,3,'3051'),('305106.01','Ingeniero/a Genético/a',9,3,'305106'),('305107','Tercer Nivel en Biodiversidad y Recursos Genéticos',6,3,'3051'),('305107.01','Ingeniero/a en Biodiversidad y Recursos Genéticos',9,3,'305107'),('305108','Tercer Nivel en Neurociencias',6,3,'3051'),('305108.01','Licenciado/a en Neurociencias',9,3,'305108'),('305109','Tercer Nivel  en Ciencia y Tecnología de Alimentos',6,3,'3051'),('305109.01','Tercer Nivel   en Ciencia y Tecnología de Alimentos',9,3,'305109'),('305110','Tercer Nivel  en Biociencia Aplicada',6,3,'3051'),('305110.01','Tercer Nivel  en Biociencia Aplicada',9,3,'305110'),('3052','Tercer Nivel en Medio Ambiente',4,3,'305'),('305201','Tercer Nivel en Medio Ambiente',6,3,'3052'),('305201.01','Ingeniero en Ecosistemas',9,3,'305201'),('305201.02','Ingeniero/a Sanitario',9,3,'305201'),('305201.03','Licenciado/a en Ecología y Medio Ambiente',9,3,'305201'),('305202','Tercer Nivel en Recursos Naturales Renovables',6,3,'3052'),('305202.01','Ingeniero/a en Recursos Naturales Renovables (conservación de suelos)',9,3,'305202'),('3053','Tercer Nivel en Ciencias Físicas',4,3,'305'),('305301','Tercer Nivel en Química',6,3,'3053'),('305301.01','Tercer Nivel Químico/a',9,3,'305301'),('305302','Tercer Nivel en Ciencias de la Tierra',6,3,'3053'),('305302.01','Tercer Nivel Geólogo/a',9,3,'305302'),('305302.02','Ingeniero/a en Ciencias del Agua',9,3,'305302'),('305302.03','Ingeniero/a en Geociencias',9,3,'305302'),('305302.04','Ingeniero/a en Geotecnia',9,3,'305302'),('305302.05','Ingeniero/a en Tecnologías Geoespaciales',9,3,'305302'),('305302.06','Ingeniero/a Geógrafo',9,3,'305302'),('305302.07','Ingeniero/a Geólogo/a',9,3,'305302'),('305302.08','Ingeniero/a Geomático',9,3,'305302'),('305302.09','Ingeniero/a Hidrólogo/a',9,3,'305302'),('305302.1','Ingeniero/a Meteorólogo/a',9,3,'305302'),('305302.11','Ingeniero/a Oceanográfico/a',9,3,'305302'),('305302.12','Ingeniero/a Topógrafo',9,3,'305302'),('305302.13','Ingeniero/a Geodesia y Cartografía',9,3,'305302'),('305302.14','Ingeniero/a Hídrico',9,3,'305302'),('305303','Tercer Nivel en Física',6,3,'3053'),('305303.01','Físico/a (tercer Nivel)',9,3,'305303'),('305303.02','Ingeniero/a en Astronomía',9,3,'305303'),('305303.03','Ingeniero/a Físico/a',9,3,'305303'),('3054','Tercer Nivel en Matemáticas y Estadística',4,3,'305'),('305401','Tercer Nivel en Matemáticas',6,3,'3054'),('305401.01','Ingeniero/a  Matemático/a',9,3,'305401'),('305401.02','Matemático/a (Tercer Nivel)',9,3,'305401'),('305402','Tercer Nivel en Estadísticas',6,3,'3054'),('305402.01','Licenciado/a Estadística/a',9,3,'305402'),('305402.02','Licenciado/a Demografía',9,3,'305402'),('305403','Tercer Nivel en Logística y Transporte',6,3,'3054'),('305403.01','Ingeniero/a en Logística y Transporte',9,3,'305403'),('305403.02','Licenciado/a en Logística de transporte Maritímo y Portuaria',9,3,'305403'),('305403.03','Licenciado/a en logística del Transporte Aeronáutico',9,3,'305403'),('305403.04','Licenciado/a en Logística de Almacenamiento y Distribución',9,3,'305403'),('306','Tercer Nivel en Tecnologías de la Información y la Comunicación (TIC)',3,3,'3'),('3061','Tercer Nivel en Tecnologías de la Información y la Comunicación (TIC)',4,3,'306'),('306101','Tercer Nivel en Computación',6,3,'3061'),('306101.01','Ingeniero/a en Computación (Informática)',9,3,'306101'),('306102','Tercer Nivel en Diseño y Administración de Redes y Bases de Datos',6,3,'3061'),('306102.01','Ingeniero en Redes y Sistemas Operativos',9,3,'306102'),('306103','Tercer Nivel en Desarrollo y Análisis de Software y Aplicaciones',6,3,'3061'),('306103.01','Ingeniero/ a de Software (Desarrollo y Análisis de Software y Aplicaciones)',9,3,'306103'),('306104','Tercer Nivel en Sistemas de Información',6,3,'3061'),('306104.01','Ingeniero/a en Sistemas de Información',9,3,'306104'),('306104.02','Ingeniero/a en Tecnologías de la Información',9,3,'306104'),('307','Tercer Nivel en Ingeniería, Industria y Construcción',3,3,'3'),('3071','Tercer Nivel en Ingeniería y Profesiones afines',4,3,'307'),('307101','Tercer Nivel en Química Aplicada',6,3,'3071'),('307101.01','Ingeniero/a de Polímeros',9,3,'307101'),('307101.02','Ingeniero/a Químico/a',9,3,'307101'),('307101.03','Tercer Nivel Petroquímico/a',9,3,'307101'),('307102','Tercer Nivel en Tecnología de Protección del Medio Ambiente',6,3,'3071'),('307102.01','Ingeniero/a Ambiental',9,3,'307102'),('307103','Tercer Nivel en Electricidad y Energía',6,3,'3071'),('307103.01','Ingeniero/a Eléctrico/a',9,3,'307103'),('307104','Tercer Nivel en Electrónica, Automatización y Sonido',6,3,'3071'),('307104.01','Ingeniero/a Electromecánico/a',9,3,'307104'),('307104.02','Ingeniero/a en Electrónica',9,3,'307104'),('307104.03','Ingeniero/a en Electrónica  y Automatización',9,3,'307104'),('307104.04','Ingeniero/a en Electrónica  y Telecomunicaciones',9,3,'307104'),('307104.05','Ingeniero/a en Sonido y Acústica',9,3,'307104'),('307104.06','Ingeniero/a en Telemática',9,3,'307104'),('307104.07','Ingeniero/a en  Electrónica en Instrumentación Aviónica',9,3,'307104'),('307105','Tercer Nivel en Mecánica y Profesiones  afines a la Metalistería',6,3,'3071'),('307105.01','Ingeniero/a en Metalurgia',9,3,'307105'),('307105.02','Ingeniero/a Mantenimiento Mecánico',9,3,'307105'),('307105.03','Ingeniero/a Mecánico/a',9,3,'307105'),('307105.04','Ingeniero/a Metalmecánica',9,3,'307105'),('307105.05','Ingeniero/a  en Refrigeración y Aire Acondicionado',9,3,'307105'),('307106','Tercer Nivel en Diseño y Construcción de Vehículos, Barcos y Aeronaves motorizadas',6,3,'3071'),('307106.01','Ingeniero/a Aeronáutico/a',9,3,'307106'),('307106.02','Ingeniero/a Automotriz',9,3,'307106'),('307106.03','Ingeniero/a Naval',9,3,'307106'),('307106.04','Licenciado en Diseño Automotriz',9,3,'307106'),('307107','Tercer Nivel en Tecnologías Nucleares y Energéticas',6,3,'3071'),('307107.01','Ingeniero/a en Tecnologías Nucleares y Energéticas',9,3,'307107'),('307108','Tercer Nivel en Mecatrónica',6,3,'3071'),('307108.01','Ingeniero/a en Mecatrónica y Robótica',9,3,'307108'),('307109','Tercer Nivel en Hidráulica',6,3,'3071'),('307109.01','Ingeniero/a en Hidráulica',9,3,'307109'),('307110','Tercer Nivel en Telecomunicaciones',6,3,'3071'),('307110.01','Ingeniero/a en Telecomunicaciones',9,3,'307110'),('307110.02','Ingeniero/a en Redes y Telecomunicaciones',9,3,'307110'),('307111','Tercer Nivel en Nanotecnología',6,3,'3071'),('307111.01','Ingeniero/a en Nanotecnología',9,3,'307111'),('3072','Tercer Nivel en Industria y producción',4,3,'307'),('307201','Tercer Nivel en Procesamiento de  alimentos',6,3,'3072'),('307201.01','Ingeniero/a en Alimentos',9,3,'307201'),('307202','Tercer Nivel en Materiales',6,3,'3072'),('307202.01','Ingeniero/a en Materiales',9,3,'307202'),('307202.02','Ingeniero/a en Madera',9,3,'307202'),('307203','Tercer Nivel en Productos Textiles',6,3,'3072'),('307203.01','Ingeniero/a Textil - Cueros',9,3,'307203'),('307203.02','Licenciado en Confección de Prendas de Vestir',9,3,'307203'),('307204','Tercer Nivel en Minería y Extracción',6,3,'3072'),('307204.01','Ingeniero/a en Minas',9,3,'307204'),('307204.02','Ingeniero/a en Minería y Extracción',9,3,'307204'),('307204.03','Ingeniero/a en Petróleos',9,3,'307204'),('307205','Tercer Nivel en Producción Industrial',6,3,'3072'),('307205.01','Ingeniero/a en Producción Industrial',9,3,'307205'),('307205.02','Ingeniero/a en Matricería',9,3,'307205'),('307205.03','Ingeniero/a en Gestión de la Calidad en la Producción Industrial',9,3,'307205'),('307206','Tercer Nivel en Seguridad Industrial',6,3,'3072'),('307206.01','Ingeniero/a en Seguridad  e Higiene Industrial',9,3,'307206'),('307206.02','Licenciado/a en Seguridad Industrial',9,3,'307206'),('307207','Tercer Nivel en Diseño Industrial y de Procesos',6,3,'3072'),('307207.01','Ingeniero /a en Procesos Industrial',9,3,'307207'),('307207.02','Ingeniero/a en Diseño Industrial',9,3,'307207'),('307207.03','Ingeniero/a Industrial',9,3,'307207'),('307208','Tercer Nivel en Mantenimiento Industrial',6,3,'3072'),('307208.01','Ingeniero/a en Mantenimiento Industrial',9,3,'307208'),('3073','Tercer Nivel en Arquitectura y construcción',4,3,'307'),('307301','Tercer Nivel de Urbanismo y restauración',6,3,'3073'),('307301.01','Licenciado/a en Urbanismo',9,3,'307301'),('307301.02','Licenciado Restaurador/a  y Conservador/a de Bienes Culturales',9,3,'307301'),('307302','Tercer Nivel en Construcción e Ingeniería Civil',6,3,'3073'),('307302.01','Ingeniero/a Civil',9,3,'307302'),('307302.02','Ingeniero/a en Avalúos y Catastros',9,3,'307302'),('307303','Tercer Nivel en Arquitectura',6,3,'3073'),('307303.01','Arquitecto/a',9,3,'307303'),('308','Tercer Nivel en Agricultura, Silvicultura, Pesca y Veterinaria',3,3,'3'),('3081','Tercer Nivel en Agricultura',4,3,'308'),('308101','Tercer Nivel en Producción Agrícola y Ganadera',6,3,'3081'),('308101.01','Ingeniero Agrícola',9,3,'308101'),('308101.02','Ingeniero/a  Agropecuario/a',9,3,'308101'),('308101.03','Ingeniero/a Agrícola y Biológico/a',9,3,'308101'),('308101.04','Ingeniero/a Agroecología',9,3,'308101'),('308101.05','Ingeniero/a Agroindustrial',9,3,'308101'),('308101.06','Ingeniero/a Agrónomo/a',9,3,'308101'),('308101.07','Ingeniero/a Zootecnista',9,3,'308101'),('3082','Tercer Nivel en Silvicultura',4,3,'308'),('308201','Tercer Nivel en Silvicultura',6,3,'3082'),('308201.01','Ingeniero/a Forestal',9,3,'308201'),('3083','Tercer Nivel en Pesca',4,3,'308'),('308301','Tercer Nivel en Pesca',6,3,'3083'),('308301.01','Ingeniero/a Acuícola',9,3,'308301'),('308301.02','Ingeniero/a en Pesca',9,3,'308301'),('3084','Tercer Nivel en Veterinaria',4,3,'308'),('308401','Tercer Nivel en Veterinaria',6,3,'3084'),('308401.01','Médico/a Veterinario/a',9,3,'308401'),('309','Tercer Nivel en Salud y bienestar',3,3,'3'),('3091','Tercer Nivel en Salud',4,3,'309'),('309101','Tercer Nivel en Odontología',6,3,'3091'),('309101.01','Odontólogo/a',9,3,'309101'),('309102','Tercer Nivel en Medicina',6,3,'3091'),('309102.01','Médico/a Legista',9,3,'309102'),('309102.02','Médico/a en Máximo Facial',9,3,'309102'),('309102.03','Médico/a Cirujano',9,3,'309102'),('309102.04','Médico/a en Medicina Natural',9,3,'309102'),('309102.05','Médico/a General',9,3,'309102'),('309103','Tercer Nivel en Enfermería y obstetricia',6,3,'3091'),('309103.01','Licenciado/ a en Enfermería',9,3,'309103'),('309103.02','Obstetriz/Obstetra (Tercer Nivel)',9,3,'309103'),('309104','Tercer Nivel en Técnicas de Diagnóstico',6,3,'3091'),('309104.01','Licenciado en Nutrición y Dietética',9,3,'309104'),('309104.02','Licenciado/a Atención Prehospitalaria y Emergencias médicas',9,3,'309104'),('309104.03','Licenciado/a en Atención Estomatológica',9,3,'309104'),('309104.04','Licenciado/a en Bioanálisis',9,3,'309104'),('309104.05','Licenciado/a en Citotecnología',9,3,'309104'),('309104.06','Licenciado/a en Imagenología y Radiología',9,3,'309104'),('309104.07','Licenciado/a en Laboratorio Clínico y Hepatológico',9,3,'309104'),('309104.08','Licenciado/a en Medicina Nuclear',9,3,'309104'),('309104.09','Licenciado/a en Optometría',9,3,'309104'),('309104.1','Licenciado/a en Ortesis y Prótesis',9,3,'309104'),('309104.11','Licenciado/a en Podología',9,3,'309104'),('309104.12','Licenciado/a en Tecnología Médica',9,3,'309104'),('309105','Tercer Nivel en Terapia, Rehabilitación y Tratamiento de la Salud',6,3,'3091'),('309105.01','Licenciado/a en Electromedicina',9,3,'309105'),('309105.02','Licenciado/a en Fisioterapia y Rehabilitación Física',9,3,'309105'),('309105.03','Licenciado/a en Fonoaudiología o Terapia del Lenguaje',9,3,'309105'),('309105.04','Licenciado/a en Tecnología de la Salud en Traumatología',9,3,'309105'),('309105.05','Licenciado/a en Terapia Cardiorrespiratoria',9,3,'309105'),('309105.06','Licenciado/a en Terapia Respiratoria',9,3,'309105'),('309105.07','Licenciado/a en Estimulación Temprana en Salud',9,3,'309105'),('309106','Tercer Nivel en Farmacia',6,3,'3091'),('309106.01','Licenciado/en Farmacia (química y farmacia)',9,3,'309106'),('309107','Tercer Nivel en Salud Pública',6,3,'3091'),('309107.01','Licenciado/a en Atención Primaria de Salud',9,3,'309107'),('309107.02','Licenciado/a en Educación y Promoción de Salud',9,3,'309107'),('309107.03','Licenciado/a en Salud Pública',9,3,'309107'),('309107.04','Licenciado/a en Medicina Familiar y Comunitaria',9,3,'309107'),('309108','Tercer Nivel en Bioquímica y Farmacia',6,3,'3091'),('309108.01','Tercer Nivel Bioquímico/a Farmacéutico/a',9,3,'309108'),('309109','Tercer Nivel en Terapias Alternativas  y Complementarias',6,3,'3091'),('309109.01','Licenciado/a en Terapias Alternativas',9,3,'309109'),('309109.02','Licenciado/a en Naturaterapia',9,3,'309109'),('3092','Tercer Nivel Bienestar',4,3,'309'),('309201','Tercer Nivel en Asistencia a Adultos Mayores y Discapacitados',6,3,'3092'),('309201.01','Licenciado/a en Gerontología',9,3,'309201'),('309202','Tercer Nivel en Asistencia a la Infancia y Servicios para jóvenes',6,3,'3092'),('309202.01','Licenciado /a en Desarrollo Infantil Integral y servicios para los jóvenes',9,3,'309202'),('310','Tercer Nivel en Servicios',3,3,'3'),('3101','Tercer Nivel en Servicios personales',4,3,'310'),('310101','Tercer Nivel en Peluquería y Tratamientos de belleza',6,3,'3101'),('310101.01','Tercer Nivel en Estética Integral (cosmetología, cosmiatría, estética capilar)',9,3,'310101'),('310101.02','Licenciado/a en Peluquería (belleza)',9,3,'310101'),('310102','Tercer Nivel en Hotelería y Gastronomía',6,3,'3101'),('310102.01','Licenciado/a en Gastronomía',9,3,'310102'),('310102.02','Licenciado/a en Hospitalidad y Hotelería',9,3,'310102'),('310102.03','Licenciado/a Gestor de Eventos, Ferias y Convenciones',9,3,'310102'),('310103','Tercer Nivel en Deportes',6,3,'3101'),('310103.01','Licenciado/a Actividad Física, Deportes y Recreación',9,3,'310103'),('310103.02','Licenciado/a en Entrenamiento Deportivo',9,3,'310103'),('310103.03','Licenciado/a Gestión Deportiva',9,3,'310103'),('310103.04','Licenciado/a en Deporte Adaptado',9,3,'310103'),('310104','Tercer Nivel en Turismo',6,3,'3101'),('310104.01','Licenciado/a en Ecoturismo',9,3,'310104'),('310104.02','Licenciado/a en Turismo',9,3,'310104'),('310104.03','Licenciado/a Guía de Turismo Nacional',9,3,'310104'),('3102','Tercer Nivel en Servicios de Protección',4,3,'310'),('310201','Tercer Nivel en Prevención y Gestión de Riesgos',6,3,'3102'),('310201.01','Licenciado/a en Gestión de Riesgos y Desastres',9,3,'310201'),('310202','Tercer Nivel en Seguridad y Salud Ocupacional',6,3,'3102'),('310202.01','Licenciado/a en Salud y Seguridad Ocupacional',9,3,'310202'),('310202.02','Licenciado/a en Terapia Ocupacional',9,3,'310202'),('310203','Tercer Nivel en Gestión Ambiental',6,3,'3102'),('310203.01','Licenciado/a en Gestión Ambiental',9,3,'310203'),('3103','Tercer Nivel de Servicios de Seguridad',4,3,'310'),('310301','Tercer Nivel en Educación Policial, Militar y Defensa',6,3,'3103'),('310301.01','Licenciado en Criminalística',9,3,'310301'),('310301.02','Licenciado/a en Ciencias Aéreas Militares',9,3,'310301'),('310301.03','Licenciado/a en Ciencias Militares',9,3,'310301'),('310301.04','Licenciado/a en Ciencias Policiales',9,3,'310301'),('310301.05','Licenciado/a en Ciencias Navales (Oficial de Marina)',9,3,'310301'),('310302','Tercer Nivel en Seguridad Ciudadana  y Orden Público',6,3,'3103'),('310302.01','Licenciado/a en Seguridad Ciudadana',9,3,'310302'),('3104','Tercer Nivel en Servicio de transporte',4,3,'310'),('310401','Tercer Nivel en Gestión de transporte',6,3,'3104'),('310401.01','Licenciado/a en Gestión del Transporte Terrestre',9,3,'310401'),('399','Otros Títulos profesionales de Tercer Nivel n.c.p.',3,3,'3'),('3999','Otros Títulos profesionales de Tercer Nivel n.c.p.',4,3,'399'),('399999','Otros Títulos profesionales de Tercer Nivel n.c.p.',9,3,'3'),('4','ESPECIALISTA',1,4,NULL),('401','Especialista en Educación',3,4,'4'),('4011','Especialista de Ciencias de la Educación',4,4,'401'),('401101','Especialista en Ciencias de la Educación',6,4,'4011'),('401101.01','Especialista en  Ciencias de la Educación',9,4,'401101'),('401101.02','Especialista en Diseño Curricular por competencias',9,4,'401101'),('401101.03','Especialista en Educación y Nuevas Tecnologías de la Información y la Comunicación',9,4,'401101'),('401101.04','Especialista en Gerencia Educativa y liderazgo Educacional',9,4,'401101'),('401101.05','Especialista en Gestión de la Calidad en Educación',9,4,'401101'),('401101.06','Especialista en Gestión de Procesos Educativos',9,4,'401101'),('401101.07','Especialista en Innovación Educativa',9,4,'401101'),('401101.08','Especialista en Gerencia de Proyectos Educativos y Sociales',9,4,'401101'),('401102','Especialista en Formación para Docentes de Educación Preprimaria',6,4,'4011'),('401102.01','Especialista en Educación Inicial (preprimaria, parvulario)',9,4,'401102'),('401103','Especialista en Formación para Docentes sin Asignaturas de Especialización',6,4,'4011'),('401103.01','Especialista en Educación Básica (Educación primaria)',9,4,'401103'),('401103.02','Especialista en Educación Especial y  Psicorehabilitación',9,4,'401103'),('401103.03','Especialista en Educación intercultural Bilingüe',9,4,'401103'),('401104','Especialista en Formación para Docentes con asignaturas de especialización',6,4,'4011'),('401104.01','Especialista en Docencia Universitaria',9,4,'401104'),('401104.02','Especialista en Pedagogía con Asignaturas de Especialización',9,4,'401104'),('401104.03','Especialista en Pedagogía de las Artes',9,4,'401104'),('401104.04','Especialista en Pedagogía de los Idiomas',9,4,'401104'),('401104.05','Especialista en Educación a Distancia',9,4,'401104'),('401105','Especialista en Psicopedagogía',6,4,'4011'),('401105.01','Especialista en Psicopedagogía',9,4,'401105'),('402','Especialista en Artes y Humanidades',3,4,'4'),('4021','Especialista en Artes',4,4,'402'),('402101','Especialista en Técnicas Audiovisuales y Producción para Medios de Comunicación',6,4,'4021'),('402101.01','Especialista en Animación Digital',9,4,'402101'),('402101.02','Especialista en Cine',9,4,'402101'),('402101.03','Especialista en Producción para Medios de Comunicación',9,4,'402101'),('402101.04','Especialista en Técnicas Audiovisuales',9,4,'402101'),('402102','Especialista en Diseño',6,4,'4021'),('402102.01','Especialista en Diseño de Interiores',9,4,'402102'),('402102.02','Especialista en Diseño de Modas',9,4,'402102'),('402102.03','Especialista en Diseño de Productos',9,4,'402102'),('402102.04','Especialista en Diseño Gráfico',9,4,'402102'),('402102.05','Especialista en Diseño Textil',9,4,'402102'),('402102.06','Especialista en Diseño y Gestión de Marcas',9,4,'402102'),('402102.07','Especialista en Diseño y Multimedia',9,4,'402102'),('402102.08','Especialista en Decoración de Interiores (mobiliario)',9,4,'402102'),('402103','Especialista en Artes Plásticas y Curaduría',6,4,'4021'),('402103.01','Especialista en Artes Plásticas (escultura, artesanías, cerámica, etc.)',9,4,'402103'),('402103.02','Especialista en Artes Visuales (pintura, dibujo, serigrafía, etc.)',9,4,'402103'),('402103.03','Especialista en Curaduría',9,4,'402103'),('402103.04','Especialista en Artes',9,4,'402103'),('402104','Especialista en Música y Artes Escénicas',6,4,'4021'),('402104.01','Especialista en Artes Escénicas',9,4,'402104'),('402104.02','Especialista en Artes Musicales',9,4,'402104'),('402104.03','Especialista en Creación Teatral',9,4,'402104'),('4022','Especialista en Humanidades',4,4,'402'),('402201','Especialista en Religión y Teología',6,4,'4022'),('402201.01','Especialista en  Teología',9,4,'402201'),('402201.02','Especialista en Religión',9,4,'402201'),('402202','Especialista en Historia y Arqueología',6,4,'4022'),('402202.01','Especialista en Arqueología',9,4,'402202'),('402202.02','Especialista en Arqueología del Neotrópico',9,4,'402202'),('402202.03','Especialista en Crítica e Historia del Arte',9,4,'402202'),('402202.04','Especialista en Historia',9,4,'402202'),('402203','Especialista en Filosofía',6,4,'4022'),('402203.01','Especialista en Filosofía',9,4,'402203'),('402203.02','Especialista en Filosofía y Pensamiento Social',9,4,'402203'),('4023','Especialista en Idiomas',4,4,'402'),('402301','Especialista en Idiomas',6,4,'4023'),('402301.01','Especialista en Idiomas',9,4,'402301'),('402302','Especialista en Literatura y lingüística',6,4,'4023'),('402302.01','Especialista en Lingüística',9,4,'402302'),('402302.02','Especialista en Lengua y Literatura',9,4,'402302'),('403','Especialista en Ciencias Sociales, Periodismo,  Información y Derecho',3,4,'4'),('4031','Especialista en Ciencias Sociales y del Comportamiento',4,4,'403'),('403101','Especialista en Economía',6,4,'4031'),('403101.01','Especialista en Economía',9,4,'403101'),('403101.02','Especialista en Economía y Administración Agrícola',9,4,'403101'),('403101.03','Especialista en Economía y Dirección de Empresas',9,4,'403101'),('403102','Especialista en Economía Matemática',6,4,'4031'),('403102.01','Especialista en Economía Matemática',9,4,'403102'),('403103','Especialista en Ciencias Políticas',6,4,'4031'),('403103.01','Especialista en Ciencias Políticas',9,4,'403103'),('403103.02','Especialista en Cooperación Internacional',9,4,'403103'),('403103.03','Especialista en Desarrollo Local',9,4,'403103'),('403103.04','Especialista en Gestión Social y Desarrollo',9,4,'403103'),('403103.05','Especialista en Políticas de Comunicación',9,4,'403103'),('403103.06','Especialista en Políticas Públicas',9,4,'403103'),('403103.07','Especialista en Relaciones Internacionales',9,4,'403103'),('403103.08','Especialista en Gobernanza y Gobernabilidad',9,4,'403103'),('403104','Especialista en Psicología',6,4,'4031'),('403104.01','Especialista  en Psicología',9,4,'403104'),('403105','Especialista en Estudios Sociales y Culturales',6,4,'4031'),('403105.01','Especialista  en Antropología',9,4,'403105'),('403105.02','Especialista  en Antropología Visual',9,4,'403105'),('403105.03','Especialista en Antropología de lo Contemporáneo',9,4,'403105'),('403105.04','Especialista en Ciencias Sociales',9,4,'403105'),('403105.05','Especialista en Estudios Culturales',9,4,'403105'),('403105.06','Especialista en Estudios Latinoamericanos',9,4,'403105'),('403105.07','Especialista en Estudios Urbanos',9,4,'403105'),('403105.08','Especialista en Trabajo Social',9,4,'403105'),('403105.09','Especialista en Políticas de Cambio Climático, Biodiversidad y Servicios Ecosistemicos',9,4,'403105'),('403105.1','Especialista en Sociología',9,4,'403105'),('403105.11','Especialista en Orientación Familiar Integral',9,4,'403105'),('403105.12','Especialista en Conservación y Gestión del Patrimonio Cultural Edificado',9,4,'403105'),('403105.13','Especialista en Estudios Internacionales',9,4,'403105'),('403106','Especialista en Estudios de Género',6,4,'4031'),('403106.01','Especialista en Género y Desarrollo',9,4,'403106'),('403106.02','Especialista en Género, Desarrollo, Salud Sexual y Reproductivo',9,4,'403106'),('403106.03','Especialista en Género, Violencia',9,4,'403106'),('403107','Especialista en Geografía y Territorio',6,4,'4031'),('403107.01','Especialista en Geografía  y Territorio',9,4,'403107'),('403108','Especialista en Estudios Socio ambientales',6,4,'4031'),('403108.01','Especialista en Estudios Socioambientales',9,4,'403108'),('403109','Especialista en Desarrollo Territorial Rural',6,4,'4031'),('403109.01','Especialista en Desarrollo Territorial Rural',9,4,'403109'),('4032','Especialista en Periodismo e Información',4,4,'403'),('403201','Especialista en Periodismo, Comunicación y Publicidad',6,4,'4032'),('403201.01','Especialista en Comunicación',9,4,'403201'),('403201.02','Especialista en Comunicación Audiovisual',9,4,'403201'),('403201.03','Especialista en Comunicación Empresarial e Institucional',9,4,'403201'),('403201.04','Especialista en Comunicación Estratégica',9,4,'403201'),('403201.05','Especialista en Comunicación y Opinión Pública',9,4,'403201'),('403201.06','Especialista en Periodismo',9,4,'403201'),('403201.07','Especialista en Publicidad',9,4,'403201'),('403201.08','Especialista en Relaciones Públicas',9,4,'403201'),('403202','Especialista en Bibliotecología, Documentación  y Archivología',6,4,'4032'),('403202.01','Especialista en Bibliotecología',9,4,'403202'),('403202.02','Especialista en Documentación y archivo',9,4,'403202'),('4033','Especialista en Derecho',4,4,'403'),('403301','Especialista en Derecho',6,4,'4033'),('403301.01','Especialista en Derecho',9,4,'403301'),('403301.02','Especialista en Derecho Administrativo',9,4,'403301'),('403301.03','Especialista en Derecho Civil y Procesal',9,4,'403301'),('403301.04','Especialista en Derecho Constitucional',9,4,'403301'),('403301.05','Especialista en Derecho Empresarial',9,4,'403301'),('403301.06','Especialista en Derecho en Contratación Pública',9,4,'403301'),('403301.07','Especialista en Derecho Financiero Bursátil y de Seguros',9,4,'403301'),('403301.08','Especialista en Derecho Notarial y Registral',9,4,'403301'),('403301.09','Especialista en Derecho Penal',9,4,'403301'),('403301.1','Especialista en Litigio y Arbitraje Internacional',9,4,'403301'),('403301.11','Especialista en Derecho Ambiental',9,4,'403301'),('403301.12','Especialista en Derecho Tributario',9,4,'403301'),('403302','Especialista en Derechos Humanos',6,4,'4033'),('403302.01','Especialista en Derechos Humanos',9,4,'403302'),('404','Especialista en Administración',3,4,'4'),('4041','Especialista en Educación Comercial y Administración',4,4,'404'),('404101','Especialista en Contabilidad y Auditoría',6,4,'4041'),('404101.01','Especialista en  Auditoría y Control de Gestión',9,4,'404101'),('404101.02','Especialista en Auditoria Gubernamental y Control',9,4,'404101'),('404101.03','Especialista en Contabilidad y Auditoría',9,4,'404101'),('404102','Especialista en Gestión Financiera',6,4,'4041'),('404102.01','Especialista en Finanzas',9,4,'404102'),('404102.02','Especialista en Finanzas Públicas',9,4,'404102'),('404102.03','Especialista en Gerencia Bancaria y Financiera',9,4,'404102'),('404102.04','Especialista en Tributación',9,4,'404102'),('404102.05','Especialista en Administración Aduanera',9,4,'404102'),('404102.06','Especialista en Riesgos, Seguros y Bursátil',9,4,'404102'),('404103','Especialista en Administración Pública y de Empresas',6,4,'4041'),('404103.01','Especialista en Administración de Agroempresas y Agronegocios',9,4,'404103'),('404103.02','Especialista en Administración de Empresas',9,4,'404103'),('404103.03','Especialista en Administración de las Organizaciones de la Economía Social y Solidaria, Micro y Pequeñas Empresas',9,4,'404103'),('404103.04','Especialista en Administración Pública',9,4,'404103'),('404103.05','Especialista en Gestión del Patrimonio Histórico y Cultural',9,4,'404103'),('404103.06','Especialista en Administración de Servicios de Salud (hospitales, Centros de salud, etc.)',9,4,'404103'),('404103.07','Especialista en Gerencia Integrada de la  Calidad',9,4,'404103'),('404103.08','Especialista en Gestión de Empresas Turísticas y Hoteleras',9,4,'404103'),('404103.09','Especialista en Gestión de Proyectos',9,4,'404103'),('404103.1','Especialista en Administración y Gerencia Organizacional',9,4,'404103'),('404103.11','Especialista en Administración de Negocios',9,4,'404103'),('404103.12','Especialista en Gerencia y Liderazgo',9,4,'404103'),('404104','Especialista en Mercadotecnia',6,4,'4041'),('404104.01','Especialista en Mercadotecnia',9,4,'404104'),('404104.02','Especialista en Imagen Corporativa (empresarial)',9,4,'404104'),('404105','Especialista en Gestión de la Información Gerencial',6,4,'4041'),('404105.01','Especialista en Gestión de la Información',9,4,'404105'),('404105.02','Especialista en Sistemas de Información Gerencial',9,4,'404105'),('404106','Especialista en Comercio',6,4,'4041'),('404106.01','Especialista en Comercio (ventas)',9,4,'404106'),('404106.02','Especialista en Comercio Exterior',9,4,'404106'),('404107','Especialista en Competencias laborales',6,4,'4041'),('404107.01','Especialista en Gestión del Talento Humano',9,4,'404107'),('404108','Especialista en Negocios Internacionales',6,4,'4041'),('404108.01','Especialista en Negocios Internacionales',9,4,'404108'),('405','Especialista en Ciencias Naturales, Matemáticas y Estadística',3,4,'4'),('4051','Especialista en Ciencias Biológicas y afines',4,4,'405'),('405101','Especialista en Biología',6,4,'4051'),('405101.01','Especialista en Biología',9,4,'405101'),('405101.02','Especialista en Biología de la Conservación y Ecología Tropical',9,4,'405101'),('405101.03','Especialista en Biotecnología',9,4,'405101'),('405101.04','Especialista en Microbiología',9,4,'405101'),('405102','Especialista en Biofísica',6,4,'4051'),('405102.01','Especialista en Biofísica',9,4,'405102'),('405103','Especialista en Biofarmacéutica',6,4,'4051'),('405103.01','Especialista en Biofarmacéutica química',9,4,'405103'),('405104','Especialista en Biomedicina',6,4,'4051'),('405104.01','Especialista en Biomedicina química',9,4,'405104'),('405105','Especialista en Bioquímica',6,4,'4051'),('405105.01','Especialista en Bioquímica',9,4,'405105'),('405106','Especialista en Genética',6,4,'4051'),('405106.01','Especialista en Genética',9,4,'405106'),('405107','Especialista en Biodiversidad y Recursos Genéticos',6,4,'4051'),('405107.01','Especialista en Biodiversidad y Recursos Genéticos química',9,4,'405107'),('405108','Especialista en Neurociencias',6,4,'4051'),('405108.01','Especialista en Neurociencias química',9,4,'405108'),('405109','Especialista  en Ciencia y Tecnología de Alimentos',6,4,'4051'),('405109.01','Especialista  en Ciencia y Tecnología de Alimentos',9,4,'405109'),('405110','Especialista  en Biociencia Aplicada',6,4,'4051'),('405110.01','Especialista  en Biociencia Aplicada',9,4,'405110'),('4052','Especialista en Medio Ambiente',4,4,'405'),('405201','Especialista en Medio Ambiente',6,4,'4052'),('405201.01','Especialista en Ecología',9,4,'405201'),('405201.02','Especialista en Gestión  Integral de Residuos Sólidos',9,4,'405201'),('405201.03','Especialista en Cambio Climático',9,4,'405201'),('405201.04','Especialista en Desarrollo Ambiental',9,4,'405201'),('405202','Especialista en Recursos Naturales Renovables',6,4,'4052'),('405202.01','Especialista en Recursos Naturales Renovables (conservación de suelos)',9,4,'405202'),('4053','Especialista en Ciencias Físicas',4,4,'405'),('405301','Especialista en Química',6,4,'4053'),('405301.01','Especialista en Química',9,4,'405301'),('405302','Especialista en Ciencias de la Tierra',6,4,'4053'),('405302.01','Especialista en Geografía',9,4,'405302'),('405302.02','Especialista en Geología',9,4,'405302'),('405302.03','Especialista en Geomática',9,4,'405302'),('405302.04','Especialista en Geotécnia',9,4,'405302'),('405302.05','Especialista en Gestión Integrada de Recursos Hídricos y Riego',9,4,'405302'),('405302.06','Especialista en Hidrología',9,4,'405302'),('405302.07','Especialista en Meteorología',9,4,'405302'),('405302.08','Especialista en Oceanografía',9,4,'405302'),('405303','Especialista en Física',6,4,'4053'),('405303.01','Especialista en  Astronomía',9,4,'405303'),('405303.02','Especialista en  Física Aplicada',9,4,'405303'),('405303.03','Especialista en Física',9,4,'405303'),('4054','Especialista en Matemáticas y Estadística',4,4,'405'),('405401','Especialista en Matemáticas',6,4,'4054'),('405401.01','Especialista en Matemática',9,4,'405401'),('405401.02','Especialista en Matemática Aplicada',9,4,'405401'),('405402','Especialista en Estadísticas',6,4,'4054'),('405402.01','Especialista en Estadística',9,4,'405402'),('405402.02','Especialista en Demografía',9,4,'405402'),('405403','Especialista en Logística y Transporte',6,4,'4054'),('405403.01','Especialista en Logística y Transporte',9,4,'405403'),('406','Especialista en Tecnologías de la Información y la Comunicación (TIC)',3,4,'4'),('4061','Especialista en Tecnologías de la Información y la Comunicación (TIC)',4,4,'406'),('406101','Especialista en Computación',6,4,'4061'),('406101.01','Especialista en Computación  (Informática)',9,4,'406101'),('406102','Especialista en Diseño y Administración de Redes y Bases de Datos',6,4,'4061'),('406102.01','Especialista en Diseño y Administración de Redes y Bases de Datos',9,4,'406102'),('406103','Especialista en Desarrollo y Análisis de Software y Aplicaciones',6,4,'4061'),('406103.01','Especialista en Software',9,4,'406103'),('406104','Especialista en Sistemas de Información',6,4,'4061'),('406104.01','Especialista en Gerencia de Sistemas y Tecnología Empresarial',9,4,'406104'),('406104.02','Especialista en Sistemas de Información',9,4,'406104'),('406104.03','Especialista en Tecnologías de la Información',9,4,'406104'),('407','Especialista en Ingeniería, Industria y Construcción',3,4,'4'),('4071','Especialista en Ingeniería y Profesiones afines',4,4,'407'),('407101','Especialista en Química Aplicada',6,4,'4071'),('407101.01','Especialista en Ingeniería Química',9,4,'407101'),('407101.02','Especialista en Ingeniería Química Aplicada',9,4,'407101'),('407101.03','Especialista en Petroquímica',9,4,'407101'),('407101.04','Especialista en Polímeros',9,4,'407101'),('407102','Especialista en Tecnología de Protección del Medio Ambiente',6,4,'4071'),('407102.01','Especialista en Ecoefiencia Industrial',9,4,'407102'),('407102.02','Especialista en Ingeniería Ambiental',9,4,'407102'),('407102.03','Especialista en Tecnologías de Protección del Medio Ambiente',9,4,'407102'),('407102.04','Especialista en Agua Potable y Saneamiento',9,4,'407102'),('407103','Especialista en Electricidad y Energía',6,4,'4071'),('407103.01','Especialista en Electricidad y Energía',9,4,'407103'),('407104','Especialista en Electrónica, Automatización y Sonido',6,4,'4071'),('407104.01','Especialista en  Electromecánica',9,4,'407104'),('407104.02','Especialista en Automatización y Control Industrial',9,4,'407104'),('407104.03','Especialista en Electrónica',9,4,'407104'),('407104.04','Especialista en Electrónica y Automatización',9,4,'407104'),('407104.05','Especialista en Sonido y Acústica',9,4,'407104'),('407104.06','Especialista en Telemática',9,4,'407104'),('407105','Especialista en Mecánica y Profesiones  afines a la Metalistería',6,4,'4071'),('407105.01','Especialista en Mecánica y Operaciones de máquinas',9,4,'407105'),('407105.02','Especialista en Metalurgia',9,4,'407105'),('407106','Especialista en Diseño y Construcción de Vehículos, Barcos y Aeronaves Motorizadas',6,4,'4071'),('407106.01','Especialista en Diseño Mecánico',9,4,'407106'),('407106.02','Especialista en Ingeniería Aeronáutica',9,4,'407106'),('407106.03','Especialista en Ingeniería Automotriz',9,4,'407106'),('407106.04','Especialista en Ingeniería Naval',9,4,'407106'),('407106.05','Especialista en Sistema Automotriz',9,4,'407106'),('407107','Especialista en Tecnologías Nucleares y Energéticas',6,4,'4071'),('407107.01','Especialista en Tecnologías Nucleares y Energéticas',9,4,'407107'),('407108','Especialista en Mecatrónica',6,4,'4071'),('407108.01','Especialista en Mecatrónica y Robótica',9,4,'407108'),('407109','Especialista en Hidráulica',6,4,'4071'),('407109.01','Especialista en Hidráulica',9,4,'407109'),('407110','Especialista en Telecomunicaciones',6,4,'4071'),('407110.01','Especialista en Telecomunicaciones',9,4,'407110'),('407110.02','Especialista en Redes y Telecomunicaciones',9,4,'407110'),('407111','Especialista en Nanotecnología',6,4,'4071'),('407111.01','Especialista  Nanotecnología',9,4,'407111'),('407111.02','Especialista Nanoelectrónica',9,4,'407111'),('4072','Especialista en Industria y Producción',4,4,'407'),('407201','Especialista en Procesamiento de  Alimentos',6,4,'4072'),('407201.01','Especialista en Alimentos',9,4,'407201'),('407202','Especialista en Materiales',6,4,'4072'),('407202.01','Especialista en Materiales',9,4,'407202'),('407203','Especialista en Productos Textiles',6,4,'4072'),('407203.01','Especialista en Textiles',9,4,'407203'),('407203.02','Especialista en fabricación de Calzado',9,4,'407203'),('407204','Especialista en Minería y Extracción',6,4,'4072'),('407204.01','Especialista en Minas',9,4,'407204'),('407204.02','Especialista en Petróleos',9,4,'407204'),('407205','Especialista en Producción Industrial',6,4,'4072'),('407205.01','Especialista en Mejoramiento de Procesos',9,4,'407205'),('407205.02','Especialista en Producción y Operaciones Industriales',9,4,'407205'),('407205.03','Especialista en Gestión de la Calidad en la Producción Industrial',9,4,'407205'),('407206','Especialista en Seguridad Industrial',6,4,'4072'),('407206.01','Especialista en Seguridad Industrial',9,4,'407206'),('407207','Especialista en Diseño Industrial y de Procesos',6,4,'4072'),('407207.01','Especialista en Diseño Industrial y de Procesos',9,4,'407207'),('407207.02','Especialista en Diseño y Simulación',9,4,'407207'),('407207.03','Especialista en  Ingeniería Industrial',9,4,'407207'),('407208','Especialista en Mantenimiento Industrial',6,4,'4072'),('407208.01','Especialista en Mantenimiento Industrial',9,4,'407208'),('4073','Especialista en Arquitectura y construcción',4,4,'407'),('407301','Especialista en Urbanismo y restauración',6,4,'4073'),('407301.01','Especialista en Restauración y Conservación de Bienes Culturales',9,4,'407301'),('407301.02','Especialista en Urbanismo',9,4,'407301'),('407302','Especialista en Construcción e Ingeniería Civil',6,4,'4073'),('407302.01','Especialista en Ingeniería Civil',9,4,'407302'),('407303','Especialista en Arquitectura',6,4,'4073'),('407303.01','Especialista en Arquitectura',9,4,'407303'),('408','Especialista en Agricultura, Silvicultura, Pesca y Veterinaria',3,4,'4'),('4081','Especialista en Agricultura',4,4,'408'),('408101','Especialista en Producción Agrícola y Ganadera',6,4,'4081'),('408101.01','Especialista en Agroecología',9,4,'408101'),('408101.02','Especialista en Agroindustria',9,4,'408101'),('408101.03','Especialista en Agronomía',9,4,'408101'),('408101.04','Especialista en Agropecuaria',9,4,'408101'),('408101.05','Especialista en Ingeniería Agrícola',9,4,'408101'),('408101.06','Especialista en Zootecnia',9,4,'408101'),('408101.07','Especialista en Producción Animal',9,4,'408101'),('4082','Especialista en Silvicultura',4,4,'408'),('408201','Especialista en Silvicultura',6,4,'4082'),('408201.01','Especialista en Ingeniería Forestal',9,4,'408201'),('408201.02','Especialista en Manejo Forestal Sostenible',9,4,'408201'),('408201.03','Especialista en Silvicultura',9,4,'408201'),('4083','Especialista en Pesca',4,4,'408'),('408301','Especialista en Pesca',6,4,'4083'),('408301.01','Especialista en Acuicultura',9,4,'408301'),('408301.02','Especialista en Pesca',9,4,'408301'),('4084','Especialista en Veterinaria',4,4,'408'),('408401','Especialista en Veterinaria',6,4,'4084'),('408401.01','Especialista en Medicina Veterinaria',9,4,'408401'),('409','Especialista en Salud y Bienestar',3,4,'4'),('4091','Especialista en Salud',4,4,'409'),('409101','Especialista en Odontología',6,4,'4091'),('409101.01','Especialista en Cirugía Oral',9,4,'409101'),('409101.02','Especialista en Endodoncia',9,4,'409101'),('409101.03','Especialista en Odontopediatría',9,4,'409101'),('409101.04','Especialista en Ortodoncia',9,4,'409101'),('409101.05','Especialista en Periodoncia',9,4,'409101'),('409101.06','Especialista en Odontología',9,4,'409101'),('409102','Especialista en Medicina',6,4,'4091'),('409102.01','Especialista en Acupuntura y Moxibustion (Médico)',9,4,'409102'),('409102.02','Especialista en Alergología',9,4,'409102'),('409102.03','Especialista en Anatomía Patológica',9,4,'409102'),('409102.04','Especialista en Anestesiología',9,4,'409102'),('409102.05','Especialista en Angiología y Cirugía Vascular',9,4,'409102'),('409102.06','Especialista en Cardiología',9,4,'409102'),('409102.07','Especialista en Cirugía General',9,4,'409102'),('409102.08','Especialista en Cirugía Plástica y Reconstructiva',9,4,'409102'),('409102.09','Especialista en Coloproctología',9,4,'409102'),('409102.1','Especialista en Dermatología',9,4,'409102'),('409102.11','Especialista en Diabetología',9,4,'409102'),('409102.12','Especialista en Endocrinología',9,4,'409102'),('409102.13','Especialista en Linfología',9,4,'409102'),('409102.14','Especialista en Estomatología',9,4,'409102'),('409102.15','Especialista en Fisiatría',9,4,'409102'),('409102.16','Especialista en Gastroenterología',9,4,'409102'),('409102.17','Especialista en Geriatría',9,4,'409102'),('409102.18','Especialista en Ginecología y Obstetricia',9,4,'409102'),('409102.19','Especialista en Inmunología',9,4,'409102'),('409102.2','Especialista en Medicina Critica',9,4,'409102'),('409102.21','Especialista en Medicina de Emergencias y Desastres',9,4,'409102'),('409102.22','Especialista en Medicina del Deporte',9,4,'409102'),('409102.23','Especialista en Medicina Forense',9,4,'409102'),('409102.24','Especialista en Medicina Interna',9,4,'409102'),('409102.25','Especialista en Medicina Legal',9,4,'409102'),('409102.26','Especialista en Medicina Perinatal',9,4,'409102'),('409102.27','Especialista en Nefrología',9,4,'409102'),('409102.28','Especialista en Neonatología',9,4,'409102'),('409102.29','Especialista en Neumología',9,4,'409102'),('409102.3','Especialista en Neurocirugía',9,4,'409102'),('409102.31','Especialista en Neurología',9,4,'409102'),('409102.32','Especialista en Oftalmología',9,4,'409102'),('409102.33','Especialista en Oncología',9,4,'409102'),('409102.34','Especialista en Ortopedia y Traumatología',9,4,'409102'),('409102.35','Especialista en Otorrinolaringología',9,4,'409102'),('409102.36','Especialista en Patología Clínica',9,4,'409102'),('409102.37','Especialista en Pediatría',9,4,'409102'),('409102.38','Especialista en Perinatología',9,4,'409102'),('409102.39','Especialista  en Medicina',9,4,'409102'),('409102.4','Especialista en Proctología',9,4,'409102'),('409102.41','Especialista en Psiquiatría',9,4,'409102'),('409102.42','Especialista en Reproducción Humana',9,4,'409102'),('409102.43','Especialista en Reumatología',9,4,'409102'),('409102.44','Especialista en Toxicología Clínica',9,4,'409102'),('409102.45','Especialista en Terapia Intensiva',9,4,'409102'),('409102.46','Especialista en Urología',9,4,'409102'),('409103','Especialista en Enfermería y Obstetricia',6,4,'4091'),('409103.01','Especialista en Enfermería en Medicina Crítica',9,4,'409103'),('409103.02','Especialista en Enfermería en Perineonatología',9,4,'409103'),('409103.03','Especialista en Enfermería Oncológica',9,4,'409103'),('409103.04','Especialista en Enfermería Quirúrgica',9,4,'409103'),('409103.05','Especialista en Enfermería Obstetrica',9,4,'409103'),('409103.06','Especialista en Enfermería',9,4,'409103'),('409104','Especialista en Técnicas de Diagnóstico',6,4,'4091'),('409104.01','Especialista en Hematología  (medicina transfuncional)',9,4,'409104'),('409104.02','Especialista en Imagenología y Radiología',9,4,'409104'),('409104.03','Especialista en Laboratorio Clínico',9,4,'409104'),('409104.04','Especialista en Nutrición y Dietética',9,4,'409104'),('409104.05','Especialista en Optometría',9,4,'409104'),('409104.06','Especialista en Radioterapia',9,4,'409104'),('409105','Especialista en Terapia, Rehabilitación y Tratamiento de la Salud',6,4,'4091'),('409105.01','Especialista en Terapia del Lenguaje (logopedia o Fonoaudiología)',9,4,'409105'),('409105.02','Especialista en Fisioterapia',9,4,'409105'),('409105.03','Especialista en Estimulación Temprana en Salud',9,4,'409105'),('409106','Especialista en Farmacia',6,4,'4091'),('409106.01','Especialista en Farmacia (químico y farmacia)',9,4,'409106'),('409107','Especialista en Salud Pública',6,4,'4091'),('409107.01','Especialista en Atención Primaria de la Salud',9,4,'409107'),('409107.02','Especialista en Medicina Familiar y Comunitaria',9,4,'409107'),('409107.03','Especialista en Educación y Promoción de Salud',9,4,'409107'),('409107.04','Especialista en Salud Pública',9,4,'409107'),('409107.05','Especialista en Epidemiologia, Medicina Tropical',9,4,'409107'),('409108','Especialista en Bioquímica y Farmacia',6,4,'4091'),('409108.01','Especialista en Bioquímica y Farmacia',9,4,'409108'),('409109','Especialista en Terapias Alternativas  y Complementarias',6,4,'4091'),('409109.01','Especialista en Terapias Alternativas  y Complementarias',9,4,'409109'),('409109.02','Especialista en Homeopatía',9,4,'409109'),('4092','Especialista en Bienestar',4,4,'409'),('409201','Especialista en Asistencia a Adultos Mayores y Discapacitados',6,4,'4092'),('409201.01','Especialista en Asistencia a Adultos Mayores y Discapacitados (Servicios de Gerontología)',9,4,'409201'),('409202','Especialista en Asistencia a la Infancia y servicios para jóvenes',6,4,'4092'),('409202.01','Especialista en asistencia Infantil Integral y servicios para los jóvenes',9,4,'409202'),('410','Especialización en Servicios',3,4,'4'),('4101','Especialista en Servicios Personales',4,4,'410'),('410101','Especialista en Peluquería y Tratamientos de belleza',6,4,'4101'),('410101.01','Especialista en  Estética Integral (cosmetología, cosmiatría, estética capilar)',9,4,'410101'),('410102','Especialista en Hotelería y Gastronomía',6,4,'4101'),('410102.01','Especialista en Gastronomía',9,4,'410102'),('410102.02','Especialista en Hospitalidad y Hotelería',9,4,'410102'),('410103','Especialista en Deportes',6,4,'4101'),('410103.01','Especialista en Deporte',9,4,'410103'),('410103.02','Especialista en Entrenamiento Deportivo',9,4,'410103'),('410103.03','Especialista en Recreación y Tiempo libre',9,4,'410103'),('410103.04','Especialista en Cultura Física',9,4,'410103'),('410104','Especialista en Turismo',6,4,'4101'),('410104.01','Especialista en Turismo',9,4,'410104'),('4102','Especialista en Servicios de Protección',4,4,'410'),('410201','Especialista en Prevención y Gestión de Riesgos',6,4,'4102'),('410201.01','Especialista en Gestión de Riesgos  y Desastres',9,4,'410201'),('410201.02','Especialista en Prevención y Gestión de Riesgos',9,4,'410201'),('410202','Especialista en Seguridad y Salud Ocupacional',6,4,'4102'),('410202.01','Especialista en Gerencia de Seguridad y Salud en el Trabajo',9,4,'410202'),('410202.02','Especialista en Salud y Seguridad Ocupacional',9,4,'410202'),('410202.03','Especialista en Terapia Ocupacional',9,4,'410202'),('410203','Especialista en Gestión Ambiental',6,4,'4102'),('410203.01','Especialista en Gestión Ambiental',9,4,'410203'),('4103','Especialista en Servicios de Seguridad',4,4,'410'),('410301','Especialista en Educación Policial, Militar y Defensa',6,4,'4103'),('410301.01','Especialista en Ciencias Militares',9,4,'410301'),('410301.02','Especialista en Ciencias Policiales',9,4,'410301'),('410301.03','Especialista en Seguridad y Defensa',9,4,'410301'),('410301.04','Especialista en Criminalística',9,4,'410301'),('410301.05','Especialista en Criminología',9,4,'410301'),('410301.06','Especialista en Ciencias Navales Militares',9,4,'410301'),('410301.07','Especialista en Ciencias Aéreas Militares',9,4,'410301'),('410302','Especialista en Seguridad Ciudadana  y Orden Público',6,4,'4103'),('410302.01','Especialista en Seguridad Ciudadana',9,4,'410302'),('4104','Especialista en Servicio de Transporte',4,4,'410'),('410401','Especialista en Gestión del Transporte',6,4,'4104'),('410401.01','Especialista en  Planificación y  Gestión del Transporte',9,4,'410401'),('410401.02','Especialista en Gestión Logística de Almacenamiento, Distribución',9,4,'410401'),('499','Otros Títulos profesionales Especialistas n.c.p.',3,4,'4'),('4999','Otros Títulos profesionales Especialistas n.c.p.',4,4,'499'),('499999','Otros Títulos profesionales Especialistas n.c.p.',9,4,'4'),('5','MAGÍSTER',1,4,NULL),('501','Magíster en Educación',3,4,'5'),('5011','Magíster de Ciencias de la Educación',4,4,'501'),('501101','Magíster en Ciencias de la Educación',6,4,'5011'),('501101.01','Magíster en  Gerencia y liderazgo Educacional',9,4,'501101'),('501101.02','Magíster en Desarrollo de la Inteligencia y Educación',9,4,'501101'),('501101.03','Magíster en Diseño Curricular por Competencias',9,4,'501101'),('501101.04','Magíster en Ciencias de la  Educación',9,4,'501101'),('501101.05','Magíster en Gerencia de Proyectos Educativos y Sociales',9,4,'501101'),('501101.06','Magíster en Administración y Supervisión Educativa',9,4,'501101'),('501101.07','Magíster en Diseño y Evaluación de Modelo de la  Educación',9,4,'501101'),('501101.08','Magíster en  Innovación Educativa',9,4,'501101'),('501101.09','Magíster en Tecnología para la Gestión Docente',9,4,'501101'),('501102','Magíster en Formación para Docentes de Educación Preprimaria',6,4,'5011'),('501102.01','Magíster en Educación Inicial (preprimaria, parvulario)',9,4,'501102'),('501103','Magíster en Formación para Docentes sin Asignaturas de Especialización',6,4,'5011'),('501103.01','Magíster en Educación Básica (Educación primaria)',9,4,'501103'),('501103.02','Magíster en Educación Especial  y Psicorehabilitación',9,4,'501103'),('501103.03','Magíster en Educación Intercultural Bilingüe',9,4,'501103'),('501104','Magíster en Formación para Docentes con Asignaturas de Especialización',6,4,'5011'),('501104.01','Magíster en Docencia Universitaria',9,4,'501104'),('501104.02','Magíster en Educación a Distancia',9,4,'501104'),('501104.03','Magíster en Pedagogía con Asignaturas de Especialización',9,4,'501104'),('501104.04','Magíster en Pedagogía de las Ciencias Experimentales',9,4,'501104'),('501105','Magíster en Psicopedagogía',6,4,'5011'),('501105.01','Magíster en Psicopedagogía',9,4,'501105'),('502','Magíster en Artes y Humanidades',3,4,'5'),('5021','Magíster en Artes',4,4,'502'),('502101','Magíster en Técnicas audiovisuales y Producción para Medios de Comunicación',6,4,'5021'),('502101.01','Magíster en Cine',9,4,'502101'),('502101.02','Magíster en Técnicas Audiovisuales',9,4,'502101'),('502101.03','Magíster en Fotografía',9,4,'502101'),('502102','Magíster en Diseño',6,4,'5021'),('502102.01','Magister en Diseño de Calzado',9,4,'502102'),('502102.02','Magíster en Diseño de Interiores',9,4,'502102'),('502102.03','Magíster en Diseño de Productos',9,4,'502102'),('502102.04','Magíster en Diseño Gráfico',9,4,'502102'),('502102.05','Magíster en Diseño Textil y de Indumentaria',9,4,'502102'),('502102.06','Magíster en Diseño y Gestión de Marcas',9,4,'502102'),('502102.07','Magíster en Diseño y Multimedia',9,4,'502102'),('502102.08','Magister en Decorador de interiores (mobiliario)',9,4,'502102'),('502102.09','Magister en Diseño',9,4,'502102'),('502103','Magíster en Artes Plásticas y Curaduría',6,4,'5021'),('502103.01','Magíster en Artes Plásticas (escultura, artesanías, cerámica, etc.)',9,4,'502103'),('502103.02','Magíster en Artes Visuales (pintura, dibujo, serigrafía, etc.)',9,4,'502103'),('502103.03','Magíster en Curaduría',9,4,'502103'),('502103.04','Magíster en Arte',9,4,'502103'),('502104','Magíster en Música y Artes Escénicas',6,4,'5021'),('502104.01','Magíster en Artes Escénicas',9,4,'502104'),('502104.02','Magíster en Artes Musicales',9,4,'502104'),('502104.03','Magíster en Creación Teatral',9,4,'502104'),('5022','Magíster en Humanidades',4,4,'502'),('502201','Magíster en Religión y Teología',6,4,'5022'),('502201.01','Magíster en Religión',9,4,'502201'),('502201.02','Magíster en Teología',9,4,'502201'),('502202','Magíster en Historia y Arqueología',6,4,'5022'),('502202.01','Magíster en Arqueología',9,4,'502202'),('502202.02','Magíster en Arqueología del Neotrópico',9,4,'502202'),('502202.03','Magíster en Crítica e Historia del Arte',9,4,'502202'),('502202.04','Magíster en Historia',9,4,'502202'),('502203','Magíster en Filosofía',6,4,'5022'),('502203.01','Magíster en Filosofía',9,4,'502203'),('502203.02','Magíster en Filosofía y Pensamiento Social',9,4,'502203'),('5023','Magíster en Idiomas',4,4,'502'),('502301','Magíster en Idiomas',6,4,'5023'),('502301.01','Magíster en Idiomas',9,4,'502301'),('502302','Magíster en Literatura y lingüística',6,4,'5023'),('502302.01','Magíster en Lingüística',9,4,'502302'),('502302.02','Magíster en Lenguaje y Literatura',9,4,'502302'),('503','Magíster en Ciencias Sociales, Periodismo,  Información y Derecho',3,4,'5'),('5031','Magíster en Ciencias Sociales y del Comportamiento',4,4,'503'),('503101','Magíster en Economía',6,4,'5031'),('503101.01','Magíster en Economía',9,4,'503101'),('503102','Magíster en Economía Matemática',6,4,'5031'),('503102.01','Magíster en Economía Matemática',9,4,'503102'),('503103','Magíster en Ciencias Políticas',6,4,'5031'),('503103.01','Magíster en Ciencias Políticas',9,4,'503103'),('503103.02','Magíster en Desarrollo',9,4,'503103'),('503103.03','Magíster en Desarrollo Local',9,4,'503103'),('503103.04','Magíster en Gerencia Política, Gobernanza y Gobernabilidad',9,4,'503103'),('503103.05','Magíster en Política Comparada',9,4,'503103'),('503103.06','Magíster en Políticas Culturales y Gestión de las Artes',9,4,'503103'),('503103.07','Magíster en Políticas Públicas',9,4,'503103'),('503103.08','Magíster en Políticas Públicas para la Prevención Integral de Drogas',9,4,'503103'),('503103.09','Magíster en Relaciones Internacionales',9,4,'503103'),('503103.1','Magíster en Políticas de Cambio Climático, Biodiversidad y Servicios Ecosistemicos',9,4,'503103'),('503104','Magíster en Psicología',6,4,'5031'),('503104.01','Magíster en Neuropsicología',9,4,'503104'),('503104.02','Magíster en Psicología',9,4,'503104'),('503104.03','Magíster en Psicología Clínica',9,4,'503104'),('503104.04','Magíster en Psicología Industrial',9,4,'503104'),('503104.05','Magíster en Psicología Organizacional (laboral)',9,4,'503104'),('503105','Magíster en Estudios Sociales y Culturales',6,4,'5031'),('503105.01','Magíster  en Antropología',9,4,'503105'),('503105.02','Magíster  en Antropología Visual',9,4,'503105'),('503105.03','Magíster en Antropología de lo Contemporáneo',9,4,'503105'),('503105.04','Magíster en Conservación y Gestión del Patrimonio Cultural Edificado',9,4,'503105'),('503105.05','Magíster en Estudios Culturales',9,4,'503105'),('503105.06','Magíster en Estudios Latinoamericanos',9,4,'503105'),('503105.07','Magíster en Estudios Sociales',9,4,'503105'),('503105.08','Magíster en Estudios Urbanos',9,4,'503105'),('503105.09','Magíster en Orientación Familiar Integral',9,4,'503105'),('503105.1','Magíster en Sociología',9,4,'503105'),('503105.11','Magíster en Sociología Política',9,4,'503105'),('503105.12','Magíster en Trabajo Social',9,4,'503105'),('503105.13','Magíster en Artes Liberales',9,4,'503105'),('503105.14','Magíster en Estudios Internacionales',9,4,'503105'),('503106','Magíster en Estudios de Género',6,4,'5031'),('503106.01','Magíster en Ciencia Sociales en Género y Desarrollo',9,4,'503106'),('503107','Magíster en Geografía y Territorio',6,4,'5031'),('503107.01','Magíster en Geografía  y Territorio',9,4,'503107'),('503108','Magíster en Estudios Socioambientales',6,4,'5031'),('503108.01','Magíster en Estudios Socioambientales',9,4,'503108'),('503109','Magíster en Desarrollo Territorial Rural',6,4,'5031'),('503109.01','Magíster en Desarrollo Territorial Rural',9,4,'503109'),('5032','Magíster en Periodismo e Información',4,4,'503'),('503201','Magíster en Periodismo, Comunicación y Publicidad',6,4,'5032'),('503201.01','Magíster en Comunicación',9,4,'503201'),('503201.02','Magíster en Comunicación Audiovisual',9,4,'503201'),('503201.03','Magíster en Comunicación Estratégica',9,4,'503201'),('503201.04','Magíster en Comunicación y Opinión Pública',9,4,'503201'),('503201.05','Magíster en Dirección de Comunicación Empresarial e Institucional',9,4,'503201'),('503201.06','Magíster en Periodismo',9,4,'503201'),('503201.07','Magíster en Periodismo y Gestión de Comunicación',9,4,'503201'),('503201.08','Magíster en Políticas de Comunicación',9,4,'503201'),('503201.09','Magíster en Producción para Medios de Comunicación',9,4,'503201'),('503201.1','Magíster en Publicidad',9,4,'503201'),('503201.11','Magíster en Relaciones Públicas',9,4,'503201'),('503202','Magíster en Bibliotecología, Documentación  y Archivología',6,4,'5032'),('503202.01','Magíster en Archivista y Sistemas de Gestión Documental',9,4,'503202'),('503202.02','Magíster en Bibliotecología',9,4,'503202'),('5033','Magíster en Derecho',4,4,'503'),('503301','Magíster en Derecho',6,4,'5033'),('503301.01','Magíster en Derecho',9,4,'503301'),('503301.02','Magíster en Derecho Constitucional',9,4,'503301'),('503301.03','Magíster en Derecho en Contratación Pública',9,4,'503301'),('503301.04','Magíster en Derecho Financiero Bursátil y de Seguros',9,4,'503301'),('503301.05','Magíster en Derecho Laboral Administrativo',9,4,'503301'),('503301.06','Magíster en Derecho Seguridad Social',9,4,'503301'),('503301.07','Magíster en Derecho Penal',9,4,'503301'),('503301.08','Magíster en Derecho Civil y  Procesal',9,4,'503301'),('503301.09','Magíster en Litigio y Arbitraje Internacional',9,4,'503301'),('503302','Magíster en Derechos Humanos',6,4,'5033'),('503302.01','Magíster en Derechos Humanos',9,4,'503302'),('504','Magíster en  Administración',3,4,'5'),('5041','Magíster en Educación Comercial y Administración',4,4,'504'),('504101','Magíster en Contabilidad y Auditoría',6,4,'5041'),('504101.01','Magíster en Auditoria Gubernamental y Control de Gestión',9,4,'504101'),('504101.02','Magíster en Contabilidad y Auditoria',9,4,'504101'),('504101.03','Magíster en Auditoria',9,4,'504101'),('504102','Magíster en Gestión Financiera',6,4,'5041'),('504102.01','Magíster en Administración Tributaria',9,4,'504102'),('504102.02','Magíster en Finanzas',9,4,'504102'),('504102.03','Magíster en Finanzas Públicas',9,4,'504102'),('504102.04','Magíster en Gerencia Bancaria y Financiera',9,4,'504102'),('504102.05','Magíster en Planificación Tributaria y Fiscalidad Internacional',9,4,'504102'),('504102.06','Magíster en Riesgos y Seguros',9,4,'504102'),('504103','Magíster en Administración Pública y de Empresas',6,4,'5041'),('504103.01','Magíster en Administración de Empresas',9,4,'504103'),('504103.02','Magíster en Administración de las Organizaciones de la Economía Social y Solidaria, Micro y Pequeñas Empresas',9,4,'504103'),('504103.03','Magíster en Administración Pública',9,4,'504103'),('504103.04','Magíster en Administración y Gerencia Organizacional',9,4,'504103'),('504103.05','Magíster en Gerencia de Empresas Públicas',9,4,'504103'),('504103.06','Magíster en Gerencia de la Calidad e Innovación',9,4,'504103'),('504103.07','Magíster en Gerencia de Sistemas y Tecnología Empresarial',9,4,'504103'),('504103.08','Magíster en Gerencia en Servicios de Salud (hospitales, centros de salud, etc.)',9,4,'504103'),('504103.09','Magíster en Gestión de Agroempresas y Agronegocios',9,4,'504103'),('504103.1','Magíster en Gestión de Empresas Turísticas y Hoteleras',9,4,'504103'),('504103.11','Magister en Dirección Estratégica de Proyectos',9,4,'504103'),('504103.12','Maestría en Sistemas de Gestión Integral',9,4,'504103'),('504103.13','Magíster en Negocios',9,4,'504103'),('504103.14','Magíster en Administración de Centros Infantiles',9,4,'504103'),('504103.15','Magíster en Gerencia y Liderazgo',9,4,'504103'),('504103.16','Magíster en Administración de Sectores Estratégicos',9,4,'504103'),('504104','Magíster en Mercadotecnia',6,4,'5041'),('504104.01','Magíster en Mercadotecnia (Marketing)',9,4,'504104'),('504104.02','Magíster en Mercadotecnia  Estratégica y Gerencia de Marcas',9,4,'504104'),('504105','Magíster en Gestión de la Información Gerencial',6,4,'5041'),('504105.01','Magíster en Gestión de la Información (Secretaria Gerencial)',9,4,'504105'),('504105.02','Magíster en Sistemas de Información  Gerencial',9,4,'504105'),('504106','Magíster en Comercio',6,4,'5041'),('504106.01','Magíster en Comercio  (ventas)',9,4,'504106'),('504106.02','Magíster en Comercio Exterior',9,4,'504106'),('504106.03','Magíster en Bienes Raíces',9,4,'504106'),('504107','Magíster en Competencias laborales',6,4,'5041'),('504107.01','Magíster en Gestión del Talento Humano',9,4,'504107'),('504108','Magíster en Negocios Internacionales',6,4,'5041'),('504108.01','Magíster en Negocios Internacionales',9,4,'504108'),('505','Magíster en Ciencias Naturales, Matemáticas y Estadística',3,4,'5'),('5051','Magíster en Ciencias Biológicas y afines',4,4,'505'),('505101','Magíster en Biología',6,4,'5051'),('505101.01','Magíster en Bioética',9,4,'505101'),('505101.02','Magíster en Biología',9,4,'505101'),('505101.03','Magíster en Biología de la Conservación y Ecología Tropical',9,4,'505101'),('505101.04','Magíster en Biología de las Enfermedades Infeccionas',9,4,'505101'),('505101.05','Magíster en Biología Molecular',9,4,'505101'),('505101.06','Magíster en Bioloquímica-Génetica',9,4,'505101'),('505101.07','Magíster en Biotecnología',9,4,'505101'),('505101.08','Magíster en Citogenética',9,4,'505101'),('505101.09','Magíster en Microbiología',9,4,'505101'),('505102','Magíster en Biofísica',6,4,'5051'),('505102.01','Magíster en Biofísica',9,4,'505102'),('505103','Magíster en Biofarmacéutica',6,4,'5051'),('505103.01','Magíster en Biofarmacéutica',9,4,'505103'),('505104','Magíster en Biomedicina',6,4,'5051'),('505104.01','Magíster en Biomedicina',9,4,'505104'),('505105','Magíster en Bioquímica',6,4,'5051'),('505105.01','Magíster en Bioquímica',9,4,'505105'),('505106','Magíster en Genética',6,4,'5051'),('505106.01','Magíster en Genética',9,4,'505106'),('505106.02','Magíster en Genética Clínica',9,4,'505106'),('505106.03','Magíster en Genética Forense',9,4,'505106'),('505106.04','Magíster en Genética Nuclear',9,4,'505106'),('505107','Magíster en Biodiversidad y Recursos Genéticos',6,4,'5051'),('505107.01','Magíster en Biodiversidad y Recursos Genéticos',9,4,'505107'),('505108','Magíster en Neurociencias',6,4,'5051'),('505108.01','Magíster en Neurociencias',9,4,'505108'),('505109','Magister  en Ciencia y Tecnología de Alimentos',6,4,'5051'),('505109.01','Magister  en Ciencia y Tecnología de Alimentos',9,4,'505109'),('505110','Magister  en Biociencia Aplicada',6,4,'5051'),('505110.01','Magister  en Biociencia Aplicada',9,4,'505110'),('5052','Magíster en Medio Ambiente',4,4,'505'),('505201','Magíster en Medio Ambiente',6,4,'5052'),('505201.01','Magíster en Cambio Climático',9,4,'505201'),('505201.02','Magíster en Ecología',9,4,'505201'),('505201.03','Magíster en Gestión  Integral de Residuos Sólidos',9,4,'505201'),('505201.04','Magíster en Desarrollo Ambiental',9,4,'505201'),('505201.05','Magíster en Ecosistemas',9,4,'505201'),('505202','Magíster en Recursos Naturales Renovables',6,4,'5052'),('505202.01','Magíster en Recursos Naturales Renovables (conservación de suelos)',9,4,'505202'),('5053','Magíster en Ciencias Físicas',4,4,'505'),('505301','Magíster en Química',6,4,'5053'),('505301.01','Magíster en Química',9,4,'505301'),('505302','Magíster en Ciencias de la Tierra',6,4,'5053'),('505302.01','Magíster en Geografía  aplicada',9,4,'505302'),('505302.02','Magíster en Geología Aplicada',9,4,'505302'),('505302.03','Magíster en Geomática',9,4,'505302'),('505302.04','Magíster en Geotecnia Aplicada',9,4,'505302'),('505302.05','Magíster en Gestión Integrada de Recursos Hídricos y Riego',9,4,'505302'),('505302.06','Magíster en Hidrología',9,4,'505302'),('505302.07','Magíster en Meteorología',9,4,'505302'),('505302.08','Magíster en Oceanografía',9,4,'505302'),('505302.09','Magíster en Recursos Hídricos',9,4,'505302'),('505303','Magíster en Física',6,4,'5053'),('505303.01','Magíster en Astronomía',9,4,'505303'),('505303.02','Magíster en Física',9,4,'505303'),('505303.03','Magíster en Física  aplicada',9,4,'505303'),('5054','Magíster en Matemáticas y Estadística',4,4,'505'),('505401','Magíster en Matemáticas',6,4,'5054'),('505401.01','Magíster en Matemática',9,4,'505401'),('505401.02','Magíster en Matemática Aplicada',9,4,'505401'),('505401.03','Magíster en Matemática Optimización Matemática',9,4,'505401'),('505402','Magíster en Estadística',6,4,'5054'),('505402.01','Magíster en Estadísticas',9,4,'505402'),('505402.02','Magíster en Demografía',9,4,'505402'),('505403','Magíster en Logística y Transporte',6,4,'5054'),('505403.01','Magíster en Logística y Transporte',9,4,'505403'),('505403.02','Magíster en Logística de Transporte Aeronáutico',9,4,'505403'),('505403.03','Magíster en Logística de Transporte Marítimo y Portuaria',9,4,'505403'),('506','Magíster en Tecnologías de la Información y la Comunicación (TIC)',3,4,'5'),('5061','Magíster en Tecnologías de la Información y la Comunicación (TIC)',4,4,'506'),('506101','Magíster en Computación',6,4,'5061'),('506101.01','Magíster en Computación  (Informática)',9,4,'506101'),('506102','Magíster en Diseño y Administración de Redes y Bases de Datos',6,4,'5061'),('506102.01','Magíster en Diseño y Administración de Redes de la Información y bases de datos',9,4,'506102'),('506103','Magíster en Desarrollo y Análisis de Software y Aplicaciones',6,4,'5061'),('506103.01','Magíster en Software',9,4,'506103'),('506104','Magíster en Sistemas de Información',6,4,'5061'),('506104.01','Magíster en Auditoría de Tecnologías de la Información',9,4,'506104'),('506104.02','Magíster en Seguridad Informática',9,4,'506104'),('506104.03','Magíster en Sistemas de la  Información',9,4,'506104'),('506104.04','Magíster en Tecnologías de la Información',9,4,'506104'),('507','Magíster en Ingeniería, Industria y Construcción',3,4,'5'),('5071','Magíster en Ingeniería y profesiones afines',4,4,'507'),('507101','Magíster en Química Aplicada',6,4,'5071'),('507101.01','Magíster en Ingeniería Química aplicada',9,4,'507101'),('507101.02','Magíster en Petroquímica',9,4,'507101'),('507101.03','Magíster en Polímeros',9,4,'507101'),('507102','Magíster en Tecnología de Protección del Medio Ambiente',6,4,'5071'),('507102.01','Magister en Ciencias Marinas',9,4,'507102'),('507102.02','Magíster en Ecoefiencia Industrial',9,4,'507102'),('507102.03','Magíster en Ingeniería Ambiental',9,4,'507102'),('507102.04','Magíster en Tecnologías de Protección del Medio Ambiente',9,4,'507102'),('507102.05','Magíster en Tecnologías de Agua Potable y Saneamiento',9,4,'507102'),('507103','Magíster en Electricidad y Energía',6,4,'5071'),('507103.01','Magíster en Electricidad y Energía',9,4,'507103'),('507104','Magíster en Electrónica, Automatización y Sonido',6,4,'5071'),('507104.01','Magíster en Automatización y Control Industrial',9,4,'507104'),('507104.02','Magíster en Electromecánica',9,4,'507104'),('507104.03','Magíster en Electrónica y Automatización',9,4,'507104'),('507104.04','Magíster en Sonido y Acústica',9,4,'507104'),('507104.05','Magíster en Telemática',9,4,'507104'),('507105','Magíster en Mecánica y Profesiones  afines a la Metalistería',6,4,'5071'),('507105.01','Magíster en Mecánica',9,4,'507105'),('507105.02','Magíster en Metalurgia',9,4,'507105'),('507106','Magíster en Diseño y construcción de vehículos, barcos y aeronaves motorizadas',6,4,'5071'),('507106.01','Magíster en Diseño Mecánico',9,4,'507106'),('507106.02','Magíster en Ingeniería Automotriz',9,4,'507106'),('507106.03','Magíster en Ingeniería Naval',9,4,'507106'),('507106.04','Magíster en Sistemas Automotrices',9,4,'507106'),('507106.05','Magíster en Ingeniería Aeronaves',9,4,'507106'),('507107','Magíster en Tecnologías Nucleares y Energéticas',6,4,'5071'),('507107.01','Magíster en Tecnologías Nucleares y Energéticas',9,4,'507107'),('507108','Magíster en Mecatrónica',6,4,'5071'),('507108.01','Magíster en Mecatrónica y Robótica',9,4,'507108'),('507109','Magíster en Hidráulica',6,4,'5071'),('507109.01','Magíster en Hidráulica',9,4,'507109'),('507110','Magíster en Telecomunicaciones',6,4,'5071'),('507110.01','Magíster en Redes y Telecomunicaciones',9,4,'507110'),('507110.02','Magíster en Telecomunicaciones',9,4,'507110'),('507111','Magíster en Nanotecnología',6,4,'5071'),('507111.01','Magíster en Nanotecnología',9,4,'507111'),('5072','Magíster en Industria y producción',4,4,'507'),('507201','Magíster en Procesamiento de  alimentos',6,4,'5072'),('507201.01','Magíster en Procesamiento de Alimentos',9,4,'507201'),('507202','Magíster en Materiales',6,4,'5072'),('507202.01','Magíster en Materiales',9,4,'507202'),('507203','Magíster en Productos Textiles',6,4,'5072'),('507203.01','Magíster en Textiles',9,4,'507203'),('507204','Magíster en Minería y Extracción',6,4,'5072'),('507204.01','Magíster en Ingeniería de Petróleos',9,4,'507204'),('507204.02','Magíster en Minas',9,4,'507204'),('507204.03','Magíster en Petróleos',9,4,'507204'),('507205','Magíster en Producción Industrial',6,4,'5072'),('507205.01','Magíster en Gestión de la Calidad en la Producción  Industrial',9,4,'507205'),('507205.02','Magíster en Producción y Operaciones Industriales',9,4,'507205'),('507206','Magíster en Seguridad Industrial',6,4,'5072'),('507206.01','Magíster en Seguridad Industrial',9,4,'507206'),('507207','Magister en Diseño Industrial y de Procesos',6,4,'5072'),('507207.01','Magíster en Diseño Industrial y de Procesos',9,4,'507207'),('507207.02','Magíster en Diseño y Simulación',9,4,'507207'),('507207.03','Magíster en Mejoramiento de Procesos',9,4,'507207'),('507207.04','Magíster en Ingeniería Industrial',9,4,'507207'),('507208','Magíster en Mantenimiento Industrial',6,4,'5072'),('507208.01','Magíster en Mantenimiento Industrial',9,4,'507208'),('5073','Magíster en Arquitectura y Construcción',4,4,'507'),('507301','Magíster en Urbanismo y Restauración',6,4,'5073'),('507301.01','Magíster en Restauración y Conservación de Bienes Culturales',9,4,'507301'),('507301.02','Magíster en Urbanismo',9,4,'507301'),('507302','Magíster en Construcción e Ingeniería Civil',6,4,'5073'),('507302.01','Magíster en Ingeniería Civil',9,4,'507302'),('507303','Magíster en Arquitectura',6,4,'5073'),('507303.01','Magíster en Arquitectura',9,4,'507303'),('508','Magíster en Agricultura, Silvicultura, Pesca y Veterinaria',3,4,'5'),('5081','Magíster en Agricultura',4,4,'508'),('508101','Magíster en Producción Agrícola y Ganadera',6,4,'5081'),('508101.01','Magíster en Agroecología',9,4,'508101'),('508101.02','Magíster en Agroindustria',9,4,'508101'),('508101.03','Magíster en Agronomía',9,4,'508101'),('508101.04','Magíster en Ciencias Agropecuarias',9,4,'508101'),('508101.05','Magíster en Ingeniería Agrícola',9,4,'508101'),('508101.06','Magíster en Reproducción Animal',9,4,'508101'),('508101.07','Magíster en Zootecnia',9,4,'508101'),('5082','Magíster en Silvicultura',4,4,'508'),('508201','Magíster en Silvicultura',6,4,'5082'),('508201.01','Magíster en Ingeniería Forestal',9,4,'508201'),('508201.02','Magíster en Manejo Forestal Sostenible',9,4,'508201'),('508201.03','Magíster en Silvicultura',9,4,'508201'),('5083','Magister en Pesca',4,4,'508'),('508301','Magister en Pesca',6,4,'5083'),('508301.01','Magíster en Acuicultura',9,4,'508301'),('508301.02','Magíster en Pesca',9,4,'508301'),('5084','Magíster en Veterinaria',4,4,'508'),('508401','Magíster en Veterinaria',6,4,'5084'),('508401.01','Magíster en Medicina Veterinaria',9,4,'508401'),('509','Magíster en Salud y bienestar',3,4,'5'),('5091','Magíster en Salud',4,4,'509'),('509101','Magíster en Odontología',6,4,'5091'),('509101.01','Magíster en Odontología',9,4,'509101'),('509102','Magíster en Medicina',6,4,'5091'),('509102.01','Magíster en Asesoría Genética',9,4,'509102'),('509102.02','Magíster en Física Médica',9,4,'509102'),('509102.03','Magíster en Hebiatría',9,4,'509102'),('509102.04','Magíster en Medicina',9,4,'509102'),('509102.05','Magíster en Salud Sexual y Reproductiva',9,4,'509102'),('509102.06','Magíster en Acupuntura y Moxibustion',9,4,'509102'),('509103','Magíster en Enfermería y obstetricia',6,4,'5091'),('509103.01','Magíster en Enfermería y Obstetricia',9,4,'509103'),('509103.02','Magíster en Enfermería Clínico Quirúrgica',9,4,'509103'),('509104','Magíster en Técnicas de Diagnóstico',6,4,'5091'),('509104.01','Magíster en Imagenologia y Radiología',9,4,'509104'),('509104.02','Magíster en Nutrición Clínica',9,4,'509104'),('509104.03','Magíster en Nutrición y Dietética',9,4,'509104'),('509104.04','Magíster en Optometría',9,4,'509104'),('509104.05','Magíster en Laboratorio Clínico',9,4,'509104'),('509104.06','Magíster en Hematología',9,4,'509104'),('509105','Magíster en Terapia, Rehabilitación y Tratamiento de la Salud',6,4,'5091'),('509105.01','Magister en Fisioterapia',9,4,'509105'),('509105.02','Magíster en Terapia del Lenguaje (logopedia o Fonoaudiología)',9,4,'509105'),('509105.03','Magíster en Estimulación Temprana',9,4,'509105'),('509106','Magíster en Farmacia',6,4,'5091'),('509106.01','Magíster en Farmacia (química y farmacia)',9,4,'509106'),('509107','Magíster en Salud Pública',6,4,'5091'),('509107.01','Magíster en Atención Primaria de Salud Química',9,4,'509107'),('509107.02','Magíster en Epidemiología y Salud Pública Veterinaria',9,4,'509107'),('509107.03','Magíster en Epidemiologia, Medicina Tropical',9,4,'509107'),('509107.04','Magíster en Investigación Clínica y Epidemiologia',9,4,'509107'),('509107.05','Magíster en Salud Pública',9,4,'509107'),('509107.06','Magíster en Medicina Familiar y Comunitaria',9,4,'509107'),('509107.07','Magíster en Promoción y Educación para la Salud',9,4,'509107'),('509108','Magíster en Bioquímica y Farmacia',6,4,'5091'),('509108.01','Magíster en Bioquímica y Farmacia',9,4,'509108'),('509109','Magíster en Terapias Alternativas  y Complementarias',6,4,'5091'),('509109.01','Magíster en Cuidados Paliativos',9,4,'509109'),('509109.02','Magíster en Homeopatía',9,4,'509109'),('509109.03','Magíster en Terapias Alternativas y Complementarias',9,4,'509109'),('5092','Magíster en Bienestar',4,4,'509'),('509201','Magíster en Asistencia a Adultos Mayores y Discapacitados',6,4,'5092'),('509201.01','Magíster en Asistencia a Adultos Mayores y Discapacitados (Servicios de Gerontología)',9,4,'509201'),('509202','Magíster en Asistencia a la Infancia y servicios para jóvenes',6,4,'5092'),('509202.01','Magíster en Desarrollo Infantil Integral y servicios para los jóvenes',9,4,'509202'),('510','Magíster en Servicios',3,4,'5'),('5101','Magíster en Servicios Personales',4,4,'510'),('510101','Magíster en Peluquería y Tratamientos de Belleza',6,4,'5101'),('510101.01','Magíster en Ciencias y Tecnologías Cosméticas',9,4,'510101'),('510102','Magíster en Hotelería y Gastronomía',6,4,'5101'),('510102.01','Magíster en Gastronomía',9,4,'510102'),('510102.02','Magíster en Hospitalidad y Hotelería',9,4,'510102'),('510103','Magíster en Deportes',6,4,'5101'),('510103.01','Magister en Actividades Física',9,4,'510103'),('510103.02','Magister en Deporte',9,4,'510103'),('510103.03','Magíster en Entrenamiento Deportivo',9,4,'510103'),('510103.04','Magíster en Recreación y Tiempo libre',9,4,'510103'),('510104','Magíster en Turismo',6,4,'5101'),('510104.01','Magíster en Turismo',9,4,'510104'),('510104.02','Magíster en Ecoturismo',9,4,'510104'),('5102','Magíster en Servicios de Protección',4,4,'510'),('510201','Magíster en Prevención y Gestión de Riesgos',6,4,'5102'),('510201.01','Magíster en Prevención y Gestión de Riesgos',9,4,'510201'),('510202','Magíster en Seguridad y Salud Ocupacional',6,4,'5102'),('510202.01','Magíster en Medicina del Trabajo, Medicina Ocupacional',9,4,'510202'),('510202.02','Magíster en Gerencia de Seguridad y Salud en el trabajo',9,4,'510202'),('510202.03','Magíster en Terapia Ocupacional',9,4,'510202'),('510203','Magíster en Gestión Ambiental',6,4,'5102'),('510203.01','Magíster en Gestión Ambiental',9,4,'510203'),('5103','Magíster en Servicios de Seguridad',4,4,'510'),('510301','Magíster en Educación Policial, Militar y Defensa',6,4,'5103'),('510301.01','Magíster en Ciencias Aéreas Militares',9,4,'510301'),('510301.02','Magíster en Ciencias Militares',9,4,'510301'),('510301.03','Magíster en Ciencias Policiales',9,4,'510301'),('510301.04','Magíster en Seguridad y Defensa',9,4,'510301'),('510301.05','Magíster en Criminalística',9,4,'510301'),('510301.06','Magíster en Ciencias Navales Militares',9,4,'510301'),('510301.07','Magíster en Criminología',9,4,'510301'),('510302','Magíster en Seguridad Ciudadana  y Orden Público',6,4,'5103'),('510302.01','Magíster en Seguridad Ciudadana',9,4,'510302'),('510302.02','Magíster en Ciencias de la Seguridad',9,4,'510302'),('510302.03','Magíster en Ingeniería de Tránsito',9,4,'510302'),('5104','Magíster en Servicio de transporte',4,4,'510'),('510401','Magíster en Gestión del Transporte',6,4,'5104'),('510401.01','Magíster Superior en Planificación, Gestión  y logística del Transporte Terrestre',9,4,'510401'),('510401.02','Magíster en Gestión y Logística (almacenamiento, distribución)  y operaciones',9,4,'510401'),('510401.03','Magíster en Movilidad Urbana, Transporte y Territorio',9,4,'510401'),('510401.04','Magíster en Ingeniería e Infraestructura del Transporte',9,4,'510401'),('599','Otros Títulos profesionales de Magíster n.c.p.',3,4,'5'),('5999','Otros Títulos profesionales de Magíster n.c.p.',4,4,'599'),('599999','Otros Títulos profesionales de Magíster n.c.p.',9,4,'5'),('6','DOCTOR (PH.D o sus equivalencias)',1,5,NULL),('601','Doctor en Educación',3,5,'6'),('6011','Doctor de Ciencias de la Educación',4,5,'601'),('601101','Doctor en Ciencias de la Educación',6,5,'6011'),('601101.01','Doctor en Ciencias de la Educación',9,5,'601101'),('601101.02','Doctor en Educación, Innovación en Educación',9,5,'601101'),('601101.03','Doctor en Gerencia Educativa',9,5,'601101'),('601102','Doctor en Formación para Docentes de Educación Preprimaria',6,5,'6011'),('601102.01','Doctor en Educación Inicial (preprimaria, parvulario)',9,5,'601102'),('601103','Doctor en Formación para Docentes sin Asignaturas de Especialización',6,5,'6011'),('601103.01','Doctor en  Educación Especial y Psicorehabilitación',9,5,'601103'),('601103.02','Doctor en Docencia en Educación Básica (Educación primaria)',9,5,'601103'),('601104','Doctor en Formación para Docentes con Asignaturas de Especialización',6,5,'6011'),('601104.01','Doctor en Pedagogía con asignaturas de especialización',9,5,'601104'),('601104.02','Doctor en Docencia Universitaria',9,5,'601104'),('601104.03','Doctor en Educación a Distancia',9,5,'601104'),('601105','Doctor en Psicopedagogía',6,5,'6011'),('601105.01','Doctor en Psicopedagogía',9,5,'601105'),('602','Doctor en Artes y Humanidades',3,5,'6'),('6021','Doctor en Artes',4,5,'602'),('602102','Doctor en Diseño',6,5,'6021'),('602102.01','Doctor en Diseño',9,5,'602102'),('602103','Doctor en Artes Plásticas y Curaduría',6,5,'6021'),('602103.01','Doctor en Artes',9,5,'602103'),('602104','Doctor en Música y Artes Escénicas',6,5,'6021'),('602104.01','Doctor en Artes Escénicas',9,5,'602104'),('602104.02','Doctor en Música',9,5,'602104'),('6022','Doctor en Humanidades',4,5,'602'),('602201','Doctor en Religión y Tecnología',6,5,'6022'),('602201.01','Doctor en  Religión',9,5,'602201'),('602201.02','Doctor en  Teología',9,5,'602201'),('602202','Doctor en Historia y Arqueología',6,5,'6022'),('602202.01','Doctor en Arqueología',9,5,'602202'),('602202.02','Doctor en Historia',9,5,'602202'),('602203','Doctor en Filosofía',6,5,'6022'),('602203.01','Doctor en Filosofía',9,5,'602203'),('6023','Doctor en Idiomas',4,5,'602'),('602301','Doctor en Idiomas',6,5,'6023'),('602301.01','Doctor en Idiomas',9,5,'602301'),('602302','Doctor en Literatura y lingüística',6,5,'6023'),('602302.01','Doctor en Lingüística',9,5,'602302'),('602302.02','Doctor en Lengua y Literatura',9,5,'602302'),('603','Doctor en Ciencias Sociales, Periodismo,  Información y Derecho',3,5,'6'),('6031','Doctor en Ciencias Sociales y del Comportamiento',4,5,'603'),('603101','Doctor en Economía',6,5,'6031'),('603101.01','Doctor en Economía',9,5,'603101'),('603102','Doctor en Economía Matemática',6,5,'6031'),('603102.01','Doctor en Economía Matemática',9,5,'603102'),('603103','Doctor en Ciencias Políticas',6,5,'6031'),('603103.01','Doctor en Ciencias Políticas',9,5,'603103'),('603103.02','Doctor en Políticas Públicas',9,5,'603103'),('603103.03','Doctor en Desarrollo Social',9,5,'603103'),('603103.04','Doctor en Relaciones Internacionales',9,5,'603103'),('603104','Doctor en Psicología',6,5,'6031'),('603104.01','Doctor en Psicología',9,5,'603104'),('603104.02','Doctor en Psicología Clínica',9,5,'603104'),('603104.03','Doctor en Psicología Industrial',9,5,'603104'),('603105','Doctor en Estudios Sociales y Culturales',6,5,'6031'),('603105.01','Doctor  en Antropología',9,5,'603105'),('603105.02','Doctor en Estudios Andinos',9,5,'603105'),('603105.03','Doctor en Estudios Culturales',9,5,'603105'),('603105.04','Doctor en Estudios Internacionales',9,5,'603105'),('603105.05','Doctor en Estudios Sociales',9,5,'603105'),('603105.06','Doctor en Paleoecología',9,5,'603105'),('603105.07','Doctor en Sociología',9,5,'603105'),('603105.08','Doctor en Trabajo Social',9,5,'603105'),('603107','Doctor en Geografía y Territorio',6,5,'6031'),('603107.01','Doctor en Geografía  y Territorio',9,5,'603107'),('6032','Doctor en Periodismo e Información',4,5,'603'),('603201','Doctor en Periodismo,  Comunicación y Publicidad',6,5,'6032'),('603201.01','Doctor en Comunicación Social',9,5,'603201'),('603201.02','Doctor en Periodismo',9,5,'603201'),('603202','Doctor en Bibliotecología, Documentación  y Archivología',6,5,'6032'),('603202.01','Doctor en Bibliotecología',9,5,'603202'),('6033','Doctor en Derecho',4,5,'603'),('603301','Doctor en Derecho',6,5,'6033'),('603301.01','Doctor en Derecho',9,5,'603301'),('604','Doctor en Administración',3,5,'6'),('6041','Doctor en Educación Comercial y Administración',4,5,'604'),('604101','Doctor en Contabilidad y Auditoría',6,5,'6041'),('604101.01','Doctor/a en Auditoria',9,5,'604101'),('604101.02','Doctor/a en Contabilidad y Auditoria',9,5,'604101'),('604102','Doctor en Gestión Financiera',6,5,'6041'),('604102.01','Doctor en Finanzas',9,5,'604102'),('604102.02','Doctor en Tributación',9,5,'604102'),('604102.03','Doctor en Gerencia Bancaria y Financiera',9,5,'604102'),('604103','Doctor en Administración Pública y de Empresas',6,5,'6041'),('604103.01','Doctor en Administración Pública',9,5,'604103'),('604103.02','Doctor en Administración de Empresas',9,5,'604103'),('604103.03','Doctor en Administración de Negocios',9,5,'604103'),('604103.04','Doctor en Proyectos de Desarrollo Social',9,5,'604103'),('604104','Doctor en Mercadotecnia',6,5,'6041'),('604104.01','Doctor en Marketing',9,5,'604104'),('604106','Doctor en Comercio',6,5,'6041'),('604106.01','Doctor en Comercio Exterior',9,5,'604106'),('604106.02','Doctor en Comercio (ventas)',9,5,'604106'),('604107','Doctor en Competencias laborales',6,5,'6041'),('604107.01','Doctor en Desarrollo del Talento Humano',9,5,'604107'),('604108','Doctor en Negocios Internacionales',6,5,'6041'),('604108.01','Doctor en Negocios Internacionales',9,5,'604108'),('605','Doctor en Ciencias Naturales, Matemáticas y Estadística',3,5,'6'),('6051','Doctor en Ciencias Biológicas y afines',4,5,'605'),('605101','Doctor en Biología',6,5,'6051'),('605101.01','Doctor en Biología',9,5,'605101'),('605101.02','Doctor en Biotecnología',9,5,'605101'),('605101.03','Doctor en Microbiología',9,5,'605101'),('605101.04','Doctor en Biología Marina',9,5,'605101'),('605102','Doctor en Biofísica',6,5,'6051'),('605102.01','Doctor  en Biofísica  química',9,5,'605102'),('605103','Doctor en Biofarmacéutica',6,5,'6051'),('605103.01','Doctor en Biofarmacéutica  química',9,5,'605103'),('605104','Doctor en Biomedicina',6,5,'6051'),('605104.01','Doctor en Biomedicina',9,5,'605104'),('605105','Doctor en Bioquímica',6,5,'6051'),('605105.01','Doctor en Bioquímica',9,5,'605105'),('605106','Doctor en Genética',6,5,'6051'),('605106.01','Doctor en  Genética química',9,5,'605106'),('605107','Doctor en Biodiversidad y Recursos Genéticos',6,5,'6051'),('605107.01','Doctor en Biodiversidad  química',9,5,'605107'),('605108','Doctor en Neurociencias',6,5,'6051'),('605108.01','Doctor  en Neurociencias química',9,5,'605108'),('605109','Doctor en Ciencia y Tecnología de Alimentos',6,5,'6051'),('605109.01','Doctor en Ciencia y Tecnología de Alimentos',9,5,'605109'),('605110','Doctor en Biociencia Aplicada',6,5,'6051'),('605110.01','Doctor en Biociencia Aplicada',9,5,'605110'),('6052','Doctor en Medio Ambiente',4,5,'605'),('605201','Doctor en Ciencias del  Medio Ambiente',6,5,'6052'),('605201.01','Doctor en Ecología',9,5,'605201'),('605201.02','Doctor en  Medio Ambiente y Desarrollo',9,5,'605201'),('605202','Doctor en Recursos Naturales Renovables',6,5,'6052'),('605202.01','Doctor en Recursos Naturales Renovables',9,5,'605202'),('6053','Doctor en Ciencias Físicas',4,5,'605'),('605301','Doctor en Química',6,5,'6053'),('605301.01','Doctor en Química',9,5,'605301'),('605302','Doctor en Ciencias de la Tierra',6,5,'6053'),('605302.01','Doctor en Ciencias de la Tierra',9,5,'605302'),('605302.02','Doctor en Geología',9,5,'605302'),('605302.03','Doctor en Geomática',9,5,'605302'),('605302.04','Doctor en Meteorología y Climatología',9,5,'605302'),('605302.05','Doctor en Recursos Hídricos',9,5,'605302'),('605302.06','Doctor en Cartografía',9,5,'605302'),('605303','Doctor en Física',6,5,'6053'),('605303.01','Doctor en Astronomía y Ciencias espaciales',9,5,'605303'),('605303.02','Doctor en Física',9,5,'605303'),('6054','Doctor en Matemáticas y Estadística',4,5,'605'),('605401','Doctor en Matemáticas',6,5,'6054'),('605401.01','Doctor en Matemática',9,5,'605401'),('605402','Doctor en Estadísticas',6,5,'6054'),('605402.01','Doctor en Estadística',9,5,'605402'),('605402.02','Doctor en Demografía',9,5,'605402'),('605403','Doctor en Logística y Transporte',6,5,'6054'),('605403.01','Doctor en Logística y Transporte',9,5,'605403'),('606','Doctor en Tecnologías de la Información y la Comunicación (TIC)',3,5,'6'),('6061','Doctor en Tecnologías de la Información y la Comunicación (TIC)',4,5,'606'),('606101','Doctor en Computación',6,5,'6061'),('606101.01','Doctor en Ciencias Computacionales',9,5,'606101'),('606102','Doctor en Diseño y Administración de Redes y Bases de Datos',6,5,'6061'),('606102.01','Doctor en Diseño y administración de Redes de la Información y Bases de Datos',9,5,'606102'),('606103','Doctor en Desarrollo y Análisis de Software y Aplicaciones',6,5,'6061'),('606103.01','Doctor en Software',9,5,'606103'),('606104','Doctor en Sistema de la Información',6,5,'6061'),('606104.01','Doctor en Gerencia de Sistemas y Tecnologías Empresariales',9,5,'606104'),('606104.02','Doctor en Programación de Sistemas Informáticos',9,5,'606104'),('606104.03','Doctor en Seguridad Informática',9,5,'606104'),('606104.04','Doctor en Tecnologías de la Información',9,5,'606104'),('607','Doctor en Ingeniería, Industria y Construcción',3,5,'6'),('6071','Doctor en Ingeniería y Profesiones afines',4,5,'607'),('607101','Doctor en Química Aplicada',6,5,'6071'),('607101.01','Doctor en Química Aplicada',9,5,'607101'),('607101.02','Doctor en Ingeniería Química',9,5,'607101'),('607102','Doctor en Tecnología de Protección del Medio Ambiente',6,5,'6071'),('607102.01','Doctor Tecnología de Protección del Medio Ambiente',9,5,'607102'),('607102.02','Doctor en Agua Potable y Saneamiento',9,5,'607102'),('607103','Doctor en Electricidad y Energía',6,5,'6071'),('607103.01','Doctor en Energía y Electricidad',9,5,'607103'),('607104','Doctor en Electrónica, Automatización y Sonido',6,5,'6071'),('607104.01','Doctor en  Electromecánica',9,5,'607104'),('607104.02','Doctor en Electrónica y Automatización',9,5,'607104'),('607105','Doctor en Mecánica y Profesiones afines a la Metalistería',6,5,'6071'),('607105.01','Doctor en Mecánica',9,5,'607105'),('607107','Doctor en Tecnologías Nucleares y Energéticas',6,5,'6071'),('607107.01','Doctor en Tecnologías Nucleares y Energéticas',9,5,'607107'),('607108','Doctor en Mecatrónica',6,5,'6071'),('607108.01','Doctor en Mecatrónica y Robótica',9,5,'607108'),('607109','Doctor en Hidráulica',6,5,'6071'),('607109.01','Doctor en Hidráulica',9,5,'607109'),('607110','Doctor en Telecomunicaciones',6,5,'6071'),('607110.01','Doctor en Telecomunicaciones',9,5,'607110'),('607111','Doctor en Nanotecnología',6,5,'6071'),('607111.01','Doctor  Nanotecnología',9,5,'607111'),('6072','Doctor en Industria y Producción',4,5,'607'),('607201','Doctor en Procesamiento de  Alimentos',6,5,'6072'),('607201.01','Doctor en Procesamiento de Alimentos',9,5,'607201'),('607202','Doctor en Materiales',6,5,'6072'),('607202.01','Doctor en Materiales',9,5,'607202'),('607203','Doctor en Productos Textiles',6,5,'6072'),('607203.01','Doctor en Textiles',9,5,'607203'),('607204','Doctor en Minería y Extracción',6,5,'6072'),('607204.01','Doctor en Minas',9,5,'607204'),('607204.02','Doctor en Petróleos',9,5,'607204'),('607205','Doctor en Producción Industrial',6,5,'6072'),('607205.01','Doctor en Producción Industrial',9,5,'607205'),('607206','Doctor en Seguridad Industrial',6,5,'6072'),('607206.01','Doctor en Seguridad e Higiene Industrial',9,5,'607206'),('607207','Doctor en Diseño Industrial y de Procesos',6,5,'6072'),('607207.01','Doctor en Ingeniería Industrial',9,5,'607207'),('6073','Doctor en Arquitectura y Construcción',4,5,'607'),('607301','Doctor en Urbanismo y Restauración',6,5,'6073'),('607301.01','Doctor en Restauración y Conservación de Bienes Culturales',9,5,'607301'),('607301.02','Doctor en Urbanismos',9,5,'607301'),('607302','Doctor en Construcción e Ingeniería Civil',6,5,'6073'),('607302.01','Doctor en Ingeniería Civil',9,5,'607302'),('607303','Doctor en Arquitectura',6,5,'6073'),('607303.01','Doctor en Arquitectura',9,5,'607303'),('608','Doctor en Agricultura, Silvicultura, Pesca y Veterinaria',3,5,'6'),('6081','Doctor en Agricultura',4,5,'608'),('608101','Doctor en Producción Agrícola y Ganadera',6,5,'6081'),('608101.01','Doctor en Agroecología',9,5,'608101'),('608101.02','Doctor en Agroindustria',9,5,'608101'),('608101.03','Doctor en Ciencias Agropecuaria',9,5,'608101'),('608101.04','Doctor en Zootecnia',9,5,'608101'),('608101.05','Doctor en Ciencias Agrícolas',9,5,'608101'),('6082','Doctor en Silvicultura',4,5,'608'),('608201','Doctor en Silvicultura',6,5,'6082'),('608201.01','Doctor en Ingeniería Forestal',9,5,'608201'),('608201.02','Doctor en Silvicultura',9,5,'608201'),('6083','Doctor en Pesca',4,5,'608'),('608301','Doctor en Pesca',6,5,'6083'),('608301.01','Doctor en Acuicultura',9,5,'608301'),('608301.02','Doctor en Pesca',9,5,'608301'),('6084','Doctor en Veterinaria',4,5,'608'),('608401','Doctor en Veterinaria',6,5,'6084'),('608401.01','Doctor en Veterinaria',9,5,'608401'),('609','Doctor en Salud y Bienestar',3,5,'6'),('6091','Doctor en Salud',4,5,'609'),('609101','Doctor en Odontología',6,5,'6091'),('609101.01','Doctor en Odontología',9,5,'609101'),('609102','Doctor en Medicina',6,5,'6091'),('609102.01','Doctor en Anatomía',9,5,'609102'),('609102.02','Doctor en Ciencias de la Visión',9,5,'609102'),('609102.03','Doctor en Medicina',9,5,'609102'),('609102.04','Doctor en Toxicología',9,5,'609102'),('609104','Doctor en Técnicas de Diagnóstico',6,5,'6091'),('609104.01','Doctor  en Nutrición y Dietética',9,5,'609104'),('609104.02','Doctor en Laboratorio Clínico',9,5,'609104'),('609104.03','Doctor en Optometría',9,5,'609104'),('609104.04','Doctor en Imagenología y Radiología',9,5,'609104'),('609105','Doctor en Terapia, Rehabilitación y Tratamiento de la Salud',6,5,'6091'),('609105.01','Doctor en Terapia del Lenguaje (logopedia o Fonoaudiología)',9,5,'609105'),('609105.02','Doctor en Fisioterapia',9,5,'609105'),('609106','Doctor en Farmacia',6,5,'6091'),('609106.01','Doctor en Farmacia (químico y farmacia)',9,5,'609106'),('609107','Doctor en Salud Pública',6,5,'6091'),('609107.01','Doctor en Promoción y Educación para la Salud',9,5,'609107'),('609107.02','Doctor en Salud Pública',9,5,'609107'),('609107.03','Doctor en Salud Colectiva, Ambiental y Sociedad',9,5,'609107'),('609107.04','Doctor en Medicina Familiar y Comunitaria',9,5,'609107'),('609108','Doctor en Bioquímica y Farmacia',6,5,'6091'),('609108.01','Doctor en Bioquímica y Farmacia',9,5,'609108'),('610','Doctor en Servicios',3,5,'6'),('6101','Doctor en Servicios Personales',4,5,'610'),('610102','Doctor en Hotelería y Gastronomía',6,5,'6101'),('610102.01','Doctor en Gastronomía',9,5,'610102'),('610102.02','Doctor en Hospitalidad y Hotelería',9,5,'610102'),('610103','Doctor en Deportes',6,5,'6101'),('610103.01','Doctor en Cultura Física, Deportes y Recreación',9,5,'610103'),('610104','Doctor en Turismo',6,5,'6101'),('610104.01','Doctor en Turismo',9,5,'610104'),('610104.02','Doctor en Guía Turística',9,5,'610104'),('6102','Doctor en Servicios de Protección',4,5,'610'),('610201','Doctor en Prevención y Gestión de Riesgos',6,5,'6102'),('610201.01','Doctor en Prevención y Gestión de Riesgos',9,5,'610201'),('610202','Doctor en Seguridad y Salud Ocupacional',6,5,'6102'),('610202.01','Doctor en Medicina del Trabajo, Medicina Ocupacional',9,5,'610202'),('610202.02','Doctor en Gerencia de Seguridad y Salud en el trabajo',9,5,'610202'),('610202.03','Doctor en Terapia Ocupacional',9,5,'610202'),('610203','Doctor en Gestión Ambiental',6,5,'6102'),('610203.01','Doctor en Gestión Ambiental',9,5,'610203'),('6103','Doctor en Servicios de Seguridad',4,5,'610'),('610301','Doctor en Educación Policial, Militar y Defensa',6,5,'6103'),('610301.01','Doctor en Ciencias Aéreas Militares',9,5,'610301'),('610301.02','Doctor en Ciencias Militares',9,5,'610301'),('610301.03','Doctor en Ciencias Navales Militares',9,5,'610301'),('610301.04','Doctor en Ciencias Policiales',9,5,'610301'),('610301.05','Doctor en Criminalística',9,5,'610301'),('610302','Doctor en Seguridad Ciudadana y Orden Público',6,5,'6103'),('610302.01','Doctor en Seguridad Ciudadana',9,5,'610302'),('610302.02','Doctor en Ciencias de la Seguridad',9,5,'610302'),('6104','Doctor en  Servicio de Transporte',4,5,'610'),('610401','Doctor en Gestión del Transporte',6,5,'6104'),('610401.01','Doctor en Ingeniería Urbana, Transporte y Territorio',9,5,'610401'),('610401.02','Doctor en Movilidad Urbana, Transporte y Territorio',9,5,'610401'),('610401.03','Doctor en Gestión del Transporte',9,5,'610401'),('699','Otros Títulos profesionales de Doctor n.c.p.',3,5,'6'),('6999','Otros Títulos profesionales de Doctor n.c.p.',4,5,'699'),('699999','Otros Títulos profesionales de Doctor n.c.p.',6,5,'6999'),('B','Grado de Educación Terciaria o nivel equivalente',1,3,NULL),('C','Nivel Máster, Especialización o equivalente',1,4,NULL),('D','Nivel de doctorado o equivalente',1,5,NULL),('TIT2057C1','Ingeniero en Minas y Esferos',9,1,NULL);
/*!40000 ALTER TABLE `Catalogo_Titulo_Educativo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Colindante_Terreno`
--

DROP TABLE IF EXISTS `Colindante_Terreno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Colindante_Terreno` (
  `id_terreno_principal` int(11) NOT NULL,
  `id_terreno_colindante` int(11) NOT NULL,
  `punto_cardinal` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_terreno_principal`,`id_terreno_colindante`),
  KEY `fk_colindante_vecino` (`id_terreno_colindante`),
  CONSTRAINT `fk_colindante_principal` FOREIGN KEY (`id_terreno_principal`) REFERENCES `Terreno` (`id_terreno`) ON DELETE CASCADE,
  CONSTRAINT `fk_colindante_vecino` FOREIGN KEY (`id_terreno_colindante`) REFERENCES `Terreno` (`id_terreno`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Colindante_Terreno`
--

LOCK TABLES `Colindante_Terreno` WRITE;
/*!40000 ALTER TABLE `Colindante_Terreno` DISABLE KEYS */;
/*!40000 ALTER TABLE `Colindante_Terreno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Condicion_Persona`
--

DROP TABLE IF EXISTS `Condicion_Persona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Condicion_Persona` (
  `id_condicion_persona` int(11) NOT NULL AUTO_INCREMENT,
  `id_persona` int(11) NOT NULL,
  `id_condicion` int(11) NOT NULL,
  `porcentaje_discapacidad` decimal(5,2) DEFAULT NULL,
  `codigo_carnet` varchar(50) DEFAULT NULL,
  `archivo_carnet` varchar(255) DEFAULT NULL,
  `observacion` text DEFAULT NULL,
  PRIMARY KEY (`id_condicion_persona`),
  KEY `fk_cp_persona` (`id_persona`),
  KEY `idx_condicion_pers_cond` (`id_condicion`),
  CONSTRAINT `fk_cp_condicion` FOREIGN KEY (`id_condicion`) REFERENCES `Catalogo_Condicion_Especial` (`id_condicion`),
  CONSTRAINT `fk_cp_persona` FOREIGN KEY (`id_persona`) REFERENCES `Persona` (`id_persona`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Condicion_Persona`
--

LOCK TABLES `Condicion_Persona` WRITE;
/*!40000 ALTER TABLE `Condicion_Persona` DISABLE KEYS */;
INSERT INTO `Condicion_Persona` VALUES (1,17,4,15.00,'29459',NULL,NULL),(4,20,1,10.00,'C-00001',NULL,'Cualquiera'),(5,21,2,20.00,'C-12345678',NULL,'Cualquiera');
/*!40000 ALTER TABLE `Condicion_Persona` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Configuracion_Global`
--

DROP TABLE IF EXISTS `Configuracion_Global`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Configuracion_Global` (
  `id_configuracion` int(11) NOT NULL AUTO_INCREMENT,
  `clave` varchar(100) NOT NULL,
  `valor` varchar(255) NOT NULL,
  `tipo_dato` enum('Entero','Decimal','Texto','Booleano') NOT NULL,
  PRIMARY KEY (`id_configuracion`),
  UNIQUE KEY `clave` (`clave`),
  KEY `idx_config_clave` (`clave`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Configuracion_Global`
--

LOCK TABLES `Configuracion_Global` WRITE;
/*!40000 ALTER TABLE `Configuracion_Global` DISABLE KEYS */;
INSERT INTO `Configuracion_Global` VALUES (1,'TARIFA_METROS_BASE','2000','Decimal'),(2,'TARIFA_VALOR_BASE','8','Decimal');
/*!40000 ALTER TABLE `Configuracion_Global` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Contacto_Persona`
--

DROP TABLE IF EXISTS `Contacto_Persona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Contacto_Persona` (
  `id_contacto` int(11) NOT NULL AUTO_INCREMENT,
  `id_persona` int(11) NOT NULL,
  `id_tipo_contacto` int(11) NOT NULL,
  `valor_contacto` varchar(150) NOT NULL,
  `id_operadora` int(11) DEFAULT NULL,
  `es_principal` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id_contacto`),
  KEY `fk_contacto_persona` (`id_persona`),
  KEY `fk_contacto_tipo` (`id_tipo_contacto`),
  KEY `fk_contacto_operadora` (`id_operadora`),
  CONSTRAINT `fk_contacto_operadora` FOREIGN KEY (`id_operadora`) REFERENCES `Catalogo_Operadora` (`id_operadora`),
  CONSTRAINT `fk_contacto_persona` FOREIGN KEY (`id_persona`) REFERENCES `Persona` (`id_persona`) ON DELETE CASCADE,
  CONSTRAINT `fk_contacto_tipo` FOREIGN KEY (`id_tipo_contacto`) REFERENCES `Catalogo_Tipo_Contacto` (`id_tipo_contacto`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Contacto_Persona`
--

LOCK TABLES `Contacto_Persona` WRITE;
/*!40000 ALTER TABLE `Contacto_Persona` DISABLE KEYS */;
INSERT INTO `Contacto_Persona` VALUES (14,3,1,'0999999990',1,1),(15,5,1,'0999999991',1,1),(16,7,1,'0999999992',1,1),(17,9,1,'0999999993',1,1),(18,11,1,'0999999994',1,1),(19,13,1,'0999999995',1,1),(20,15,1,'0999999996',1,1),(21,17,1,'0960844496',4,1),(23,1,1,'0981397564',1,1),(26,20,1,'099123456789',1,1),(27,21,1,'099123456789',3,1),(30,1,3,'zamoraxavier233@gmail.com',NULL,1),(31,23,1,'0987569857',1,1),(32,23,3,'ajherrada@pucesa.edu.ec',NULL,0),(33,24,1,'0987569857',4,1),(34,24,3,'ajherrada@pucesa.edu.ec',NULL,0);
/*!40000 ALTER TABLE `Contacto_Persona` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Copropietario_Terreno`
--

DROP TABLE IF EXISTS `Copropietario_Terreno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Copropietario_Terreno` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_terreno` int(11) NOT NULL,
  `id_persona` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_terreno` (`id_terreno`),
  KEY `idx_coprop_persona` (`id_persona`),
  CONSTRAINT `Copropietario_Terreno_ibfk_1` FOREIGN KEY (`id_terreno`) REFERENCES `Terreno` (`id_terreno`),
  CONSTRAINT `Copropietario_Terreno_ibfk_2` FOREIGN KEY (`id_persona`) REFERENCES `Persona` (`id_persona`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Copropietario_Terreno`
--

LOCK TABLES `Copropietario_Terreno` WRITE;
/*!40000 ALTER TABLE `Copropietario_Terreno` DISABLE KEYS */;
/*!40000 ALTER TABLE `Copropietario_Terreno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Jefe_Zona`
--

DROP TABLE IF EXISTS `Jefe_Zona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Jefe_Zona` (
  `id_jefe_zona` int(11) NOT NULL AUTO_INCREMENT,
  `id_zona` int(11) NOT NULL,
  `id_persona` int(11) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date DEFAULT NULL,
  `estado` enum('Activo','Finalizado') DEFAULT 'Activo',
  PRIMARY KEY (`id_jefe_zona`),
  KEY `fk_jefe_zona` (`id_zona`),
  KEY `fk_jefe_persona` (`id_persona`),
  CONSTRAINT `fk_jefe_persona` FOREIGN KEY (`id_persona`) REFERENCES `Persona` (`id_persona`) ON DELETE CASCADE,
  CONSTRAINT `fk_jefe_zona` FOREIGN KEY (`id_zona`) REFERENCES `Zona` (`id_zona`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Jefe_Zona`
--

LOCK TABLES `Jefe_Zona` WRITE;
/*!40000 ALTER TABLE `Jefe_Zona` DISABLE KEYS */;
/*!40000 ALTER TABLE `Jefe_Zona` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50003 TRIGGER trg_jefe_zona_insert AFTER INSERT ON Jefe_Zona FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Jefe_Zona', 'INSERT', NEW.id_jefe_zona, NULL, JSON_OBJECT('id_jefe_zona', NEW.id_jefe_zona, 'id_zona', NEW.id_zona, 'id_persona', NEW.id_persona, 'estado', NEW.estado), @id_usuario_actual);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50003 TRIGGER trg_jefe_zona_update AFTER UPDATE ON Jefe_Zona FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Jefe_Zona', 'UPDATE', NEW.id_jefe_zona, JSON_OBJECT('estado', OLD.estado), JSON_OBJECT('estado', NEW.estado), @id_usuario_actual);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50003 TRIGGER trg_jefe_zona_delete BEFORE DELETE ON Jefe_Zona FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Jefe_Zona', 'DELETE', OLD.id_jefe_zona, JSON_OBJECT('id_jefe_zona', OLD.id_jefe_zona, 'id_zona', OLD.id_zona, 'id_persona', OLD.id_persona), NULL, @id_usuario_actual);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `Miembro_Directiva`
--

DROP TABLE IF EXISTS `Miembro_Directiva`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Miembro_Directiva` (
  `id_directiva` int(11) NOT NULL AUTO_INCREMENT,
  `id_persona` int(11) NOT NULL,
  `id_cargo_directivo` int(11) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date DEFAULT NULL,
  `resolucion_nombramiento` varchar(255) DEFAULT NULL,
  `estado` enum('Activo','Finalizado') DEFAULT 'Activo',
  PRIMARY KEY (`id_directiva`),
  KEY `fk_directiva_persona` (`id_persona`),
  KEY `fk_directiva_cargo` (`id_cargo_directivo`),
  CONSTRAINT `fk_directiva_cargo` FOREIGN KEY (`id_cargo_directivo`) REFERENCES `Catalogo_Cargo_Directivo` (`id_cargo_directivo`),
  CONSTRAINT `fk_directiva_persona` FOREIGN KEY (`id_persona`) REFERENCES `Persona` (`id_persona`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Miembro_Directiva`
--

LOCK TABLES `Miembro_Directiva` WRITE;
/*!40000 ALTER TABLE `Miembro_Directiva` DISABLE KEYS */;
INSERT INTO `Miembro_Directiva` VALUES (10,1,1,'2026-06-04','2030-06-04','REC-4568','Finalizado'),(11,3,2,'2026-06-04','2030-06-04','REC-4568','Finalizado'),(12,13,3,'2026-06-04','2030-06-04','REC-4568','Finalizado'),(13,5,4,'2026-06-04','2030-06-04','REC-4568','Finalizado'),(14,15,5,'2026-06-04','2030-06-04','REC-4568','Finalizado'),(15,9,6,'2026-06-04','2030-06-04','REC-4568','Finalizado'),(16,11,7,'2026-06-04','2030-06-04','REC-4568','Finalizado'),(17,7,8,'2026-06-04','2030-06-04','REC-4568','Finalizado'),(18,3,9,'2026-06-04','2030-06-04','REC-4568','Finalizado'),(19,1,1,'2030-06-05','2034-05-04','acta nueva','Activo'),(20,3,2,'2030-06-05','2034-05-04','acta nueva','Activo'),(21,11,3,'2030-06-05','2034-05-04','acta nueva','Activo'),(22,17,4,'2030-06-05','2034-05-04','acta nueva','Activo'),(23,15,5,'2030-06-05','2034-05-04','acta nueva','Activo'),(24,21,6,'2030-06-05','2034-05-04','acta nueva','Activo'),(25,23,7,'2030-06-05','2034-05-04','acta nueva','Activo'),(26,20,8,'2030-06-05','2034-05-04','acta nueva','Activo'),(27,13,9,'2030-06-05','2034-05-04','acta nueva','Activo');
/*!40000 ALTER TABLE `Miembro_Directiva` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50003 TRIGGER trg_directiva_insert AFTER INSERT ON Miembro_Directiva FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Miembro_Directiva', 'INSERT', NEW.id_directiva, NULL, JSON_OBJECT('id_directiva', NEW.id_directiva, 'id_persona', NEW.id_persona, 'id_cargo_directivo', NEW.id_cargo_directivo, 'estado', NEW.estado), @id_usuario_actual);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50003 TRIGGER trg_directiva_update AFTER UPDATE ON Miembro_Directiva FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Miembro_Directiva', 'UPDATE', NEW.id_directiva, JSON_OBJECT('estado', OLD.estado), JSON_OBJECT('estado', NEW.estado), @id_usuario_actual);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50003 TRIGGER trg_directiva_delete BEFORE DELETE ON Miembro_Directiva FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Miembro_Directiva', 'DELETE', OLD.id_directiva, JSON_OBJECT('id_directiva', OLD.id_directiva, 'id_persona', OLD.id_persona), NULL, @id_usuario_actual);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `Minga`
--

DROP TABLE IF EXISTS `Minga`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Minga` (
  `id_minga` int(11) NOT NULL AUTO_INCREMENT,
  `id_tipo_evento` int(11) NOT NULL DEFAULT 1,
  `fecha_programada` date NOT NULL,
  `motivo_general` varchar(255) NOT NULL,
  `lugar_encuentro` varchar(150) NOT NULL,
  `latitud` decimal(10,8) DEFAULT NULL,
  `longitud` decimal(11,8) DEFAULT NULL,
  `id_estado_minga` int(11) NOT NULL,
  `valor_multa_inasistencia` decimal(8,2) NOT NULL DEFAULT 0.00,
  `observacion_estado` text DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_minga`),
  KEY `fk_minga_tipo_evento` (`id_tipo_evento`),
  KEY `idx_minga_estado` (`id_estado_minga`),
  CONSTRAINT `fk_minga_estado` FOREIGN KEY (`id_estado_minga`) REFERENCES `Catalogo_Estado_Minga` (`id_estado_minga`),
  CONSTRAINT `fk_minga_tipo_evento` FOREIGN KEY (`id_tipo_evento`) REFERENCES `Catalogo_Tipo_Evento` (`id_tipo_evento`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Minga`
--

LOCK TABLES `Minga` WRITE;
/*!40000 ALTER TABLE `Minga` DISABLE KEYS */;
INSERT INTO `Minga` VALUES (2,1,'2026-06-06','Ir a dar mantenimiento','Casa de Braulio. KD',NULL,NULL,3,120.00,'asdfgh','2026-06-04 05:50:41'),(3,3,'2026-06-06','Que el Javi pierda la dignidad','155 Dilon',NULL,NULL,3,10.00,'Voluntad de beber','2026-06-04 13:00:39'),(4,1,'2026-06-06','Limpieza de riñones','Restaurante la Fruteria',NULL,NULL,3,7.50,'Sin hielo','2026-06-04 16:04:55'),(5,2,'2026-06-12','asdfghjkdfgh','Casa de Braulio. KD',NULL,NULL,3,50.00,'Voluntad de beber','2026-06-10 03:18:16'),(6,2,'2026-06-14','asdfgtyhujk','Casa de Braulio. KD',NULL,NULL,1,45.00,'asdrfgth','2026-06-10 03:18:42');
/*!40000 ALTER TABLE `Minga` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Multa`
--

DROP TABLE IF EXISTS `Multa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Multa` (
  `id_multa` int(11) NOT NULL AUTO_INCREMENT,
  `id_persona` int(11) NOT NULL,
  `motivo_multa` varchar(200) NOT NULL,
  `monto` decimal(8,2) NOT NULL,
  `estado_pago` enum('Pendiente','Pagada','Anulada') DEFAULT 'Pendiente',
  `url_documento_justificativo` varchar(255) DEFAULT NULL,
  `observacion_anulacion` text DEFAULT NULL,
  `fecha_emision` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_multa`),
  KEY `fk_multa_persona` (`id_persona`),
  KEY `idx_multa_estado_pago` (`estado_pago`),
  CONSTRAINT `fk_multa_persona` FOREIGN KEY (`id_persona`) REFERENCES `Persona` (`id_persona`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Multa`
--

LOCK TABLES `Multa` WRITE;
/*!40000 ALTER TABLE `Multa` DISABLE KEYS */;
INSERT INTO `Multa` VALUES (1,1,'asdfghjkl',100.00,'Pagada',NULL,NULL,'2026-06-04 03:54:36'),(2,9,'No fue a KD de Braulio',110.10,'Pagada',NULL,NULL,'2026-06-04 05:36:57'),(3,1,'Inasistencia a Minga: Ir a dar mantenimiento (2026-06-06)',120.00,'Pagada',NULL,NULL,'2026-06-04 06:43:28'),(4,5,'Inasistencia a Minga: Ir a dar mantenimiento (2026-06-06)',120.00,'Pagada',NULL,NULL,'2026-06-04 06:43:28'),(5,11,'Inasistencia a Minga: Ir a dar mantenimiento (2026-06-06)',120.00,'Pendiente',NULL,NULL,'2026-06-04 06:43:28'),(6,15,'Inasistencia a Minga: Ir a dar mantenimiento (2026-06-06)',120.00,'Pendiente',NULL,NULL,'2026-06-04 06:43:28'),(7,7,'Inasistencia a Minga: Que el Javi pierda la dignidad (2026-06-06)',10.00,'Pendiente',NULL,NULL,'2026-06-04 13:04:38'),(8,17,'Inasistencia a Minga: Que el Javi pierda la dignidad (2026-06-06)',10.00,'Pendiente',NULL,NULL,'2026-06-04 13:04:38'),(9,13,'Inasistencia a Minga: Que el Javi pierda la dignidad (2026-06-06)',10.00,'Pendiente',NULL,NULL,'2026-06-04 13:04:38'),(10,3,'Inasistencia a Minga: Que el Javi pierda la dignidad (2026-06-06)',10.00,'Pendiente',NULL,NULL,'2026-06-04 13:04:38'),(11,9,'Llego con 2 travesaños a la minga',35.00,'Pendiente',NULL,NULL,'2026-06-04 13:28:34'),(12,21,'Inasistencia a Minga: Limpieza de riñones (2026-06-06)',7.50,'Pendiente',NULL,NULL,'2026-06-04 16:07:14'),(13,1,'sedrftyghujkdrftygh',150.00,'Pagada',NULL,NULL,'2026-06-10 03:37:37'),(14,1,'wsedrfgtyhjk',54.00,'Pagada',NULL,NULL,'2026-06-10 03:44:17'),(15,23,'Inasistencia a Minga: asdfghjkdfgh (2026-06-12)',50.00,'Pendiente',NULL,NULL,'2026-06-10 04:17:28');
/*!40000 ALTER TABLE `Multa` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50003 TRIGGER trg_multa_insert AFTER INSERT ON Multa FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Multa', 'INSERT', NEW.id_multa, NULL, JSON_OBJECT(
        'id_multa', NEW.id_multa, 'id_persona', NEW.id_persona, 'monto', NEW.monto, 'estado_pago', NEW.estado_pago
    ), @id_usuario_actual);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50003 TRIGGER trg_multa_update AFTER UPDATE ON Multa FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Multa', 'UPDATE', NEW.id_multa,
    JSON_OBJECT('monto', OLD.monto, 'estado_pago', OLD.estado_pago), JSON_OBJECT('monto', NEW.monto, 'estado_pago', NEW.estado_pago), @id_usuario_actual);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50003 TRIGGER trg_multa_delete BEFORE DELETE ON Multa FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Multa', 'DELETE', OLD.id_multa, JSON_OBJECT('id_multa', OLD.id_multa, 'id_persona', OLD.id_persona, 'monto', OLD.monto), NULL, @id_usuario_actual);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `Perfil_Educativo_Persona`
--

DROP TABLE IF EXISTS `Perfil_Educativo_Persona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Perfil_Educativo_Persona` (
  `id_perfil` int(11) NOT NULL AUTO_INCREMENT,
  `id_persona` int(11) NOT NULL,
  `codigo_titulo_cine` varchar(15) NOT NULL,
  `estado_estudio` enum('Cursando','Finalizado','Abandonado') DEFAULT 'Finalizado',
  `archivo_titulo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_perfil`),
  KEY `fk_edu_persona` (`id_persona`),
  KEY `fk_edu_titulo` (`codigo_titulo_cine`),
  CONSTRAINT `fk_edu_persona` FOREIGN KEY (`id_persona`) REFERENCES `Persona` (`id_persona`) ON DELETE CASCADE,
  CONSTRAINT `fk_edu_titulo` FOREIGN KEY (`codigo_titulo_cine`) REFERENCES `Catalogo_Titulo_Educativo` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Perfil_Educativo_Persona`
--

LOCK TABLES `Perfil_Educativo_Persona` WRITE;
/*!40000 ALTER TABLE `Perfil_Educativo_Persona` DISABLE KEYS */;
INSERT INTO `Perfil_Educativo_Persona` VALUES (5,17,'305201.02','Finalizado',NULL),(6,18,'103201.01','Finalizado',NULL),(7,1,'101103.01','Finalizado',NULL);
/*!40000 ALTER TABLE `Perfil_Educativo_Persona` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Permiso_Rol`
--

DROP TABLE IF EXISTS `Permiso_Rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Permiso_Rol` (
  `id_rol` int(11) NOT NULL,
  `id_permiso` int(11) NOT NULL,
  PRIMARY KEY (`id_rol`,`id_permiso`),
  KEY `fk_permiso_matriz` (`id_permiso`),
  CONSTRAINT `fk_permiso_matriz` FOREIGN KEY (`id_permiso`) REFERENCES `Permiso_Sistema` (`id_permiso`) ON DELETE CASCADE,
  CONSTRAINT `fk_rol_matriz` FOREIGN KEY (`id_rol`) REFERENCES `Rol_Sistema` (`id_rol`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Permiso_Rol`
--

LOCK TABLES `Permiso_Rol` WRITE;
/*!40000 ALTER TABLE `Permiso_Rol` DISABLE KEYS */;
/*!40000 ALTER TABLE `Permiso_Rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Permiso_Sistema`
--

DROP TABLE IF EXISTS `Permiso_Sistema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Permiso_Sistema` (
  `id_permiso` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_permiso` varchar(100) NOT NULL,
  `modulo` varchar(50) NOT NULL,
  PRIMARY KEY (`id_permiso`),
  UNIQUE KEY `nombre_permiso` (`nombre_permiso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Permiso_Sistema`
--

LOCK TABLES `Permiso_Sistema` WRITE;
/*!40000 ALTER TABLE `Permiso_Sistema` DISABLE KEYS */;
/*!40000 ALTER TABLE `Permiso_Sistema` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Persona`
--

DROP TABLE IF EXISTS `Persona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Persona` (
  `id_persona` int(11) NOT NULL AUTO_INCREMENT,
  `cedula` varchar(15) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `id_genero` int(11) DEFAULT NULL,
  `id_sector` int(11) DEFAULT NULL,
  `nivel_educativo` tinyint(4) DEFAULT 0,
  `id_representante_familia` int(11) DEFAULT NULL,
  `estado_vital` enum('Vivo','Fallecido') DEFAULT 'Vivo',
  `estado_registro` enum('Activo','Pendiente') NOT NULL DEFAULT 'Activo',
  `fecha_defuncion` date DEFAULT NULL,
  PRIMARY KEY (`id_persona`),
  UNIQUE KEY `cedula` (`cedula`),
  KEY `fk_persona_genero` (`id_genero`),
  KEY `fk_persona_tutor` (`id_representante_familia`),
  KEY `idx_persona_sector` (`id_sector`),
  CONSTRAINT `fk_persona_genero` FOREIGN KEY (`id_genero`) REFERENCES `Catalogo_Genero` (`id_genero`),
  CONSTRAINT `fk_persona_sector` FOREIGN KEY (`id_sector`) REFERENCES `Sector` (`id_sector`) ON DELETE SET NULL,
  CONSTRAINT `fk_persona_tutor` FOREIGN KEY (`id_representante_familia`) REFERENCES `Persona` (`id_persona`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Persona`
--

LOCK TABLES `Persona` WRITE;
/*!40000 ALTER TABLE `Persona` DISABLE KEYS */;
INSERT INTO `Persona` VALUES (1,'1801119197','Pepito Ernesto','Perez Jerez','2001-05-11',1,1,0,NULL,'Vivo','Activo',NULL),(3,'1804632030','Braulio Andrés','Silva Toaza','1980-01-01',1,3,0,NULL,'Vivo','Activo',NULL),(4,'2200023659','Hijo de Braulio','Silva Toaza','2010-01-01',1,NULL,0,3,'Vivo','Activo',NULL),(5,'1850661651','Dilón Marcelo','Lagua Poma','1981-01-01',1,15,0,NULL,'Vivo','Activo',NULL),(6,'1851053957','Hijo de Dilón','Lagua Poma','2011-01-01',1,NULL,0,5,'Vivo','Activo',NULL),(7,'1805637202','Victor Hugo','Toasa Pérez','1982-01-01',1,8,0,NULL,'Vivo','Activo',NULL),(8,'1709596793','Hijo de Victor','Toasa Pérez','2012-01-01',1,NULL,0,7,'Vivo','Activo',NULL),(9,'1851867026','Alejandro Luis','Sutherland Gómez','1983-01-01',1,14,0,NULL,'Vivo','Activo',NULL),(10,'1800461871','Hijo de Alejandro','Sutherland Gómez','2013-01-01',1,NULL,0,9,'Vivo','Activo',NULL),(11,'1850339944','Paúl Fernando','Sánchez Vega','1984-01-01',1,19,0,NULL,'Vivo','Activo',NULL),(12,'1729638302','Hijo de Paúl','Sánchez Vega','2014-01-01',1,NULL,0,11,'Vivo','Activo',NULL),(13,'1851025104','Esteban Javier','Ruiz Morales','1985-01-01',1,1,0,NULL,'Vivo','Activo',NULL),(14,'1850460047','Hijo de Esteban','Ruiz Morales','2015-01-01',1,NULL,0,13,'Vivo','Activo',NULL),(15,'1805756663','Gabriel Enrique','Ramos Cruz','1986-01-01',1,12,0,NULL,'Vivo','Activo',NULL),(16,'1850441146','Hijo de Gabriel','Ramos Cruz','2016-01-01',1,NULL,0,15,'Vivo','Activo',NULL),(17,'1804552170','Cheche Andres','Palacios Mendez','2005-10-18',1,2,0,NULL,'Vivo','Activo',NULL),(18,'1805766100','Juan Esteban','Sandoval Flores',NULL,1,NULL,0,17,'Vivo','Activo',NULL),(20,'1802993939','Chavo','Del Ocho','2000-03-29',1,1,0,NULL,'Vivo','Activo',NULL),(21,'0604834556','TERÁN SOLIS','DOMÉNIKA PATRICIA','2000-06-21',1,9,0,NULL,'Vivo','Activo',NULL),(22,'0000000000','Super','Administrador',NULL,NULL,1,0,NULL,'Vivo','Activo',NULL),(23,'1850351071','LESLIE MADELEINE','SOLIS ROBALINO','2001-05-11',2,1,1,NULL,'Vivo','Activo',NULL),(24,'1804697652','Erick','Moreno','2002-03-10',1,7,2,NULL,'Vivo','Activo',NULL);
/*!40000 ALTER TABLE `Persona` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50003 TRIGGER trg_persona_insert AFTER INSERT ON Persona FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Persona', 'INSERT', NEW.id_persona, NULL, JSON_OBJECT(
        'id_persona', NEW.id_persona, 'cedula', NEW.cedula, 'nombre', NEW.nombre, 'apellido', NEW.apellido,
        'id_genero', NEW.id_genero, 'id_sector', NEW.id_sector, 'estado_vital', NEW.estado_vital
    ), @id_usuario_actual);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50003 TRIGGER trg_persona_update AFTER UPDATE ON Persona FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Persona', 'UPDATE', NEW.id_persona,
    JSON_OBJECT('cedula', OLD.cedula, 'nombre', OLD.nombre, 'apellido', OLD.apellido, 'id_genero', OLD.id_genero, 'id_sector', OLD.id_sector, 'estado_vital', OLD.estado_vital),
    JSON_OBJECT('cedula', NEW.cedula, 'nombre', NEW.nombre, 'apellido', NEW.apellido, 'id_genero', NEW.id_genero, 'id_sector', NEW.id_sector, 'estado_vital', NEW.estado_vital), 
    @id_usuario_actual);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50003 TRIGGER trg_persona_delete BEFORE DELETE ON Persona FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Persona', 'DELETE', OLD.id_persona, JSON_OBJECT(
        'id_persona', OLD.id_persona, 'cedula', OLD.cedula, 'nombre', OLD.nombre, 'id_sector', OLD.id_sector
    ), NULL, @id_usuario_actual);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `Planilla_Cabecera`
--

DROP TABLE IF EXISTS `Planilla_Cabecera`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Planilla_Cabecera` (
  `id_planilla` int(11) NOT NULL AUTO_INCREMENT,
  `id_persona` int(11) NOT NULL,
  `fecha_emision` date NOT NULL,
  `anio_fiscal` int(11) NOT NULL,
  `mes_fiscal` int(11) NOT NULL,
  `total_pagar` decimal(10,2) NOT NULL DEFAULT 0.00,
  `estado_pago` enum('Pendiente','Pagada','Anulada') DEFAULT 'Pendiente',
  `numero_comprobante` varchar(50) DEFAULT NULL,
  `fecha_pago` datetime DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_planilla`),
  KEY `idx_planilla_persona_estado` (`id_persona`,`estado_pago`),
  KEY `idx_planilla_mes_anio` (`mes_fiscal`,`anio_fiscal`),
  CONSTRAINT `fk_planilla_persona` FOREIGN KEY (`id_persona`) REFERENCES `Persona` (`id_persona`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Planilla_Cabecera`
--

LOCK TABLES `Planilla_Cabecera` WRITE;
/*!40000 ALTER TABLE `Planilla_Cabecera` DISABLE KEYS */;
INSERT INTO `Planilla_Cabecera` VALUES (1,1,'2026-06-01',2026,5,25.00,'Pagada',NULL,NULL,'2026-06-04 03:39:00'),(4,1,'2026-06-04',2026,6,25.00,'Pagada','12345586','2026-06-04 03:52:36','2026-06-04 03:47:42'),(5,9,'2026-06-04',2026,6,276.40,'Pagada','5656103','2026-06-04 16:23:26','2026-06-04 16:15:18'),(6,1,'2026-06-04',2026,7,25.00,'Pendiente',NULL,NULL,'2026-06-04 21:11:04'),(7,17,'2026-06-05',2026,7,1000.00,'Pendiente',NULL,NULL,'2026-06-05 03:36:18'),(8,17,'2026-06-05',2026,7,1000.00,'Pendiente',NULL,NULL,'2026-06-05 03:36:42'),(9,17,'2026-06-05',2026,7,1000.00,'Pendiente',NULL,NULL,'2026-06-05 03:40:49'),(10,1,'2026-06-10',2026,9,25.00,'Pagada','1245678','2026-06-10 03:50:29','2026-06-10 03:50:20'),(11,1,'2026-06-10',2026,10,25.00,'Pendiente',NULL,NULL,'2026-06-10 03:54:10'),(12,1,'2026-06-10',2026,11,25.00,'Pendiente',NULL,NULL,'2026-06-10 03:55:09');
/*!40000 ALTER TABLE `Planilla_Cabecera` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50003 TRIGGER trg_planillac_insert AFTER INSERT ON Planilla_Cabecera FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Planilla_Cabecera', 'INSERT', NEW.id_planilla, NULL, JSON_OBJECT('id_planilla', NEW.id_planilla, 'id_persona', NEW.id_persona, 'total_pagar', NEW.total_pagar, 'estado_pago', NEW.estado_pago), @id_usuario_actual);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50003 TRIGGER trg_planillac_update AFTER UPDATE ON Planilla_Cabecera FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Planilla_Cabecera', 'UPDATE', NEW.id_planilla, JSON_OBJECT('total_pagar', OLD.total_pagar, 'estado_pago', OLD.estado_pago), JSON_OBJECT('total_pagar', NEW.total_pagar, 'estado_pago', NEW.estado_pago), @id_usuario_actual);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50003 TRIGGER trg_planillac_delete BEFORE DELETE ON Planilla_Cabecera FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Planilla_Cabecera', 'DELETE', OLD.id_planilla, JSON_OBJECT('id_planilla', OLD.id_planilla, 'id_persona', OLD.id_persona, 'total_pagar', OLD.total_pagar), NULL, @id_usuario_actual);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `Planilla_Detalle_Terreno`
--

DROP TABLE IF EXISTS `Planilla_Detalle_Terreno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Planilla_Detalle_Terreno` (
  `id_detalle` int(11) NOT NULL AUTO_INCREMENT,
  `id_planilla` int(11) NOT NULL,
  `id_terreno` int(11) NOT NULL,
  `area_terreno_copia` decimal(10,2) NOT NULL COMMENT 'Congela el área cobrada en ese mes',
  `subtotal_calculado` decimal(10,2) NOT NULL COMMENT 'Resultado dinámico calculado por el Backend',
  PRIMARY KEY (`id_detalle`),
  KEY `fk_detalle_planilla` (`id_planilla`),
  KEY `idx_planilla_detalle_terreno` (`id_terreno`),
  CONSTRAINT `fk_detalle_planilla` FOREIGN KEY (`id_planilla`) REFERENCES `Planilla_Cabecera` (`id_planilla`) ON DELETE CASCADE,
  CONSTRAINT `fk_detalle_terreno` FOREIGN KEY (`id_terreno`) REFERENCES `Terreno` (`id_terreno`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Planilla_Detalle_Terreno`
--

LOCK TABLES `Planilla_Detalle_Terreno` WRITE;
/*!40000 ALTER TABLE `Planilla_Detalle_Terreno` DISABLE KEYS */;
INSERT INTO `Planilla_Detalle_Terreno` VALUES (3,4,1,5000.00,25.00),(4,5,5,55280.50,276.40),(5,6,1,5000.00,25.00),(6,7,9,200000.00,1000.00),(7,8,10,200000.00,1000.00),(8,9,11,200000.00,1000.00),(9,10,1,5000.00,25.00),(10,11,1,5000.00,25.00),(11,12,1,5000.00,25.00);
/*!40000 ALTER TABLE `Planilla_Detalle_Terreno` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50003 TRIGGER trg_planillad_insert AFTER INSERT ON Planilla_Detalle_Terreno FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Planilla_Detalle_Terreno', 'INSERT', NEW.id_detalle, NULL, JSON_OBJECT('id_detalle', NEW.id_detalle, 'id_planilla', NEW.id_planilla, 'id_terreno', NEW.id_terreno, 'area_terreno_copia', NEW.area_terreno_copia, 'subtotal_calculado', NEW.subtotal_calculado), @id_usuario_actual);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50003 TRIGGER trg_planillad_update AFTER UPDATE ON Planilla_Detalle_Terreno FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Planilla_Detalle_Terreno', 'UPDATE', NEW.id_detalle, JSON_OBJECT('area_terreno_copia', OLD.area_terreno_copia, 'subtotal_calculado', OLD.subtotal_calculado), JSON_OBJECT('area_terreno_copia', NEW.area_terreno_copia, 'subtotal_calculado', NEW.subtotal_calculado), @id_usuario_actual);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50003 TRIGGER trg_planillad_delete BEFORE DELETE ON Planilla_Detalle_Terreno FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Planilla_Detalle_Terreno', 'DELETE', OLD.id_detalle, JSON_OBJECT('id_detalle', OLD.id_detalle, 'id_planilla', OLD.id_planilla, 'id_terreno', OLD.id_terreno, 'subtotal_calculado', OLD.subtotal_calculado), NULL, @id_usuario_actual);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `Rol_Sistema`
--

DROP TABLE IF EXISTS `Rol_Sistema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Rol_Sistema` (
  `id_rol` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_rol` varchar(50) NOT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `nombre_rol` (`nombre_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Rol_Sistema`
--

LOCK TABLES `Rol_Sistema` WRITE;
/*!40000 ALTER TABLE `Rol_Sistema` DISABLE KEYS */;
/*!40000 ALTER TABLE `Rol_Sistema` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Sector`
--

DROP TABLE IF EXISTS `Sector`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Sector` (
  `id_sector` int(11) NOT NULL AUTO_INCREMENT,
  `id_zona` int(11) NOT NULL,
  `nombre_sector` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  PRIMARY KEY (`id_sector`),
  UNIQUE KEY `nombre_sector` (`nombre_sector`),
  KEY `fk_sector_zona` (`id_zona`),
  CONSTRAINT `fk_sector_zona` FOREIGN KEY (`id_zona`) REFERENCES `Zona` (`id_zona`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Sector`
--

LOCK TABLES `Sector` WRITE;
/*!40000 ALTER TABLE `Sector` DISABLE KEYS */;
INSERT INTO `Sector` VALUES (1,1,'San Luis','Sector norte'),(2,1,'San Francisco','Sector norte'),(3,1,'San Miguel','Sector norte'),(4,1,'La Magdalena','Sector norte'),(5,1,'El Calvario','Sector norte'),(6,2,'San Antonio','Sector sur'),(7,2,'Santa Faz','Sector sur'),(8,2,'El Rosario','Sector sur'),(9,2,'La Merced','Sector sur'),(10,2,'Bellavista','Sector sur'),(11,3,'San Pedro','Sector este'),(12,3,'Santa Rosa','Sector este'),(13,3,'Las Orquídeas','Sector este'),(14,3,'El Mirador','Sector este'),(15,3,'Los Pinos','Sector este'),(16,4,'San Juan','Sector oeste'),(17,4,'La Esperanza','Sector oeste'),(18,4,'El Paraíso','Sector oeste'),(19,4,'Nueva Vida','Sector oeste'),(20,4,'Las Lomas','Sector oeste'),(21,5,'Sector Palugshas',NULL);
/*!40000 ALTER TABLE `Sector` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Terreno`
--

DROP TABLE IF EXISTS `Terreno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Terreno` (
  `id_terreno` int(11) NOT NULL AUTO_INCREMENT,
  `id_persona` int(11) NOT NULL,
  `clave_catastral` varchar(50) NOT NULL,
  `latitud` decimal(10,8) DEFAULT NULL,
  `longitud` decimal(11,8) DEFAULT NULL,
  `url_planimetria` varchar(255) DEFAULT NULL,
  `peso_archivo_bytes` int(11) DEFAULT NULL,
  `area_total` decimal(10,2) NOT NULL COMMENT 'M² para el cálculo de tasas',
  `id_estado_construccion` int(11) NOT NULL DEFAULT 1,
  `archivo_escritura` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_terreno`),
  UNIQUE KEY `clave_catastral` (`clave_catastral`),
  KEY `fk_terreno_estado` (`id_estado_construccion`),
  KEY `idx_terreno_persona` (`id_persona`),
  CONSTRAINT `fk_terreno_estado` FOREIGN KEY (`id_estado_construccion`) REFERENCES `Catalogo_Estado_Construccion` (`id_estado_construccion`),
  CONSTRAINT `fk_terreno_persona` FOREIGN KEY (`id_persona`) REFERENCES `Persona` (`id_persona`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Terreno`
--

LOCK TABLES `Terreno` WRITE;
/*!40000 ALTER TABLE `Terreno` DISABLE KEYS */;
INSERT INTO `Terreno` VALUES (1,1,'18-08-57-44-545-545',-1.33160300,-78.54504100,NULL,NULL,5000.00,2,NULL),(2,3,'SEC-01-001',-1.24000000,-78.62000000,NULL,NULL,5250.49,1,NULL),(3,5,'SEC-01-002',-1.23900000,-78.61900000,NULL,NULL,260.50,1,NULL),(4,7,'SEC-01-003',-1.23800000,-78.61800000,NULL,NULL,7270.50,1,NULL),(5,9,'SEC-01-004',-1.23700000,-78.61700000,NULL,NULL,55280.50,3,NULL),(6,11,'SEC-01-005',-1.23600000,-78.61600000,NULL,NULL,290.50,1,NULL),(7,13,'SEC-01-006',-1.23500000,-78.61500000,NULL,NULL,77300.50,1,NULL),(8,15,'SEC-01-007',-1.23400000,-78.61400000,NULL,NULL,8310.50,1,NULL),(9,17,'15-16-51-61-651-651',-1.29576700,-78.63062700,NULL,NULL,200000.00,1,NULL),(10,17,'18-37-45-89-685-552',NULL,NULL,NULL,NULL,200000.00,2,'/storage/escrituras/6a218657c2ff9_18-37-45-89-685-552.pdf'),(11,17,'22-50-56-36-985-745',NULL,NULL,NULL,NULL,200000.00,2,'/storage/escrituras/6a2186fa0c3a2_22-50-56-36-985-745.pdf'),(12,20,'12-12-12-12-121-212',-1.35589100,-78.61454300,NULL,NULL,23456.00,2,'/storage/escrituras/6a21a07008712_12-12-12-12-121-212.pdf');
/*!40000 ALTER TABLE `Terreno` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50003 TRIGGER trg_terreno_insert AFTER INSERT ON Terreno FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Terreno', 'INSERT', NEW.id_terreno, NULL, JSON_OBJECT('id_terreno', NEW.id_terreno, 'id_persona', NEW.id_persona, 'area_total', NEW.area_total), @id_usuario_actual);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50003 TRIGGER trg_terreno_update AFTER UPDATE ON Terreno FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Terreno', 'UPDATE', NEW.id_terreno, JSON_OBJECT('area_total', OLD.area_total), JSON_OBJECT('area_total', NEW.area_total), @id_usuario_actual);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50003 TRIGGER trg_terreno_delete BEFORE DELETE ON Terreno FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Terreno', 'DELETE', OLD.id_terreno, JSON_OBJECT('id_terreno', OLD.id_terreno, 'id_persona', OLD.id_persona, 'area_total', OLD.area_total), NULL, @id_usuario_actual);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `Usuario_Sistema`
--

DROP TABLE IF EXISTS `Usuario_Sistema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Usuario_Sistema` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `id_persona` int(11) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `password_salt` varchar(255) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `username` (`username`),
  KEY `fk_usuario_persona` (`id_persona`),
  KEY `fk_usuario_rol` (`id_rol`),
  CONSTRAINT `fk_usuario_persona` FOREIGN KEY (`id_persona`) REFERENCES `Persona` (`id_persona`),
  CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`id_rol`) REFERENCES `Rol_Sistema` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Usuario_Sistema`
--

LOCK TABLES `Usuario_Sistema` WRITE;
/*!40000 ALTER TABLE `Usuario_Sistema` DISABLE KEYS */;
INSERT INTO `Usuario_Sistema` VALUES (1,1,1,'admin','hash','salt');
/*!40000 ALTER TABLE `Usuario_Sistema` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50003 TRIGGER trg_usuario_insert AFTER INSERT ON Usuario_Sistema FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Usuario_Sistema', 'INSERT', NEW.id_usuario, NULL, JSON_OBJECT('id_usuario', NEW.id_usuario, 'id_persona', NEW.id_persona, 'id_rol', NEW.id_rol, 'username', NEW.username), @id_usuario_actual);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50003 TRIGGER trg_usuario_update AFTER UPDATE ON Usuario_Sistema FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Usuario_Sistema', 'UPDATE', NEW.id_usuario, JSON_OBJECT('id_rol', OLD.id_rol, 'username', OLD.username), JSON_OBJECT('id_rol', NEW.id_rol, 'username', NEW.username), @id_usuario_actual);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50003 TRIGGER trg_bloqueo_admin_delete
BEFORE DELETE ON Usuario_Sistema FOR EACH ROW
BEGIN
    IF OLD.id_usuario = 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Bloqueo crítico: No se puede eliminar al administrador principal.';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50003 TRIGGER trg_usuario_delete BEFORE DELETE ON Usuario_Sistema FOR EACH ROW
BEGIN
    INSERT INTO Auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, id_usuario)
    VALUES ('Usuario_Sistema', 'DELETE', OLD.id_usuario, JSON_OBJECT('id_usuario', OLD.id_usuario, 'username', OLD.username), NULL, @id_usuario_actual);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `Zona`
--

DROP TABLE IF EXISTS `Zona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Zona` (
  `id_zona` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_zona` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  PRIMARY KEY (`id_zona`),
  UNIQUE KEY `nombre_zona` (`nombre_zona`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Zona`
--

LOCK TABLES `Zona` WRITE;
/*!40000 ALTER TABLE `Zona` DISABLE KEYS */;
INSERT INTO `Zona` VALUES (1,'Zona Norte','Sector norte de la comunidad'),(2,'Zona Sur','Sector sur de la comunidad'),(3,'Zona Este','Sector este de la comunidad'),(4,'Zona Oeste','Sector oeste de la comunidad'),(5,'Zona Centro',NULL);
/*!40000 ALTER TABLE `Zona` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_05_29_031957_create_personal_access_tokens_table',1),(5,'2026_06_04_144522_create_usuarios_table',2),(6,'2026_06_04_180000_add_performance_indexes',3),(7,'2026_06_04_190000_add_fecha_registro_to_caja_comunitaria',4),(8,'2026_06_04_200000_add_new_feature_columns',5),(9,'2026_06_04_210000_add_nivel_educativo_to_persona',6),(10,'2026_06_05_000001_add_missing_fk_indexes',7),(12,'2026_06_05_000002_add_password_temporal_to_usuarios',8),(13,'2026_06_07_000001_add_join_performance_indexes',8);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Test User','test@example.com','2026-06-03 19:41:26','$2y$12$iegDJaSxDjuh5.VYYeyT/.jf4CsDbV0y6MNyhXpCrGxU.PQg5KcDC','eNfI2YasLl','2026-06-03 19:41:26','2026-06-03 19:41:26');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `id_persona` int(11) NOT NULL,
  `cedula` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `password_temporal` tinyint(1) NOT NULL DEFAULT 0,
  `rol` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `usuarios_id_persona_unique` (`id_persona`),
  UNIQUE KEY `usuarios_cedula_unique` (`cedula`),
  CONSTRAINT `usuarios_id_persona_foreign` FOREIGN KEY (`id_persona`) REFERENCES `Persona` (`id_persona`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,22,'admin','$2y$12$z01ijgADxlqwH64lp9yXb..c9SpIJztOuqD3bd3sP7X3z0vf2fsOe',0,'Administrador','2026-06-04 14:52:42','2026-06-05 23:50:34'),(3,3,'1804632030','$2y$12$l8VZK1.Ld9vC0z.MFWVyLeOZ2uZF3Tr87TsU3d28lBQA.38qGHQVa',0,'Vicepresidente','2026-06-04 15:14:29','2026-06-10 03:35:31'),(4,1,'1801119197','$2y$12$JhFjl/mG/i9B1muW8.DdJ.S6u1NYG7B/QAHwq0ufzdSaYeWojWtDS',0,'Presidente','2026-06-04 21:59:52','2026-06-10 04:33:58'),(5,7,'1805637202','$2y$12$qGjnPoI6J.z8sV7VZApJnePF7omtlh273LOWKgtYx.s8GF83vGdnu',0,'Vocal','2026-06-05 03:05:35','2026-06-10 03:34:35'),(6,5,'1850661651','$2y$12$6ix4kpAQWxtalzQSniXQGOZh8xMNJ2vEMVF.2qan8KjNSBe1Iyr2C',0,'Tesorero','2026-06-05 23:31:53','2026-06-10 03:34:35'),(7,9,'1851867026','$2y$12$TsMwPkcwEpEub1Ckdd/un.46k1kYehBAR6FUqWTBrLhX8Q5hLXbP2',0,'Vocal','2026-06-05 23:31:54','2026-06-10 03:34:35'),(8,11,'1850339944','$2y$12$fm/Hb2Wxj7AB/4umNOTqzOFxacI9PT8/y6iHxYYQ9kUQHhos3vjR6',0,'Secretario','2026-06-05 23:31:54','2026-06-10 03:35:31'),(9,13,'1851025104','$2y$12$zQZ9WXAmjK.UG95H5RvfKeXDVA0De9rgiuINtawBRG9XkbpEsuBSW',0,'Vocal','2026-06-05 23:31:55','2026-06-10 03:35:31'),(10,15,'1805756663','$2y$12$SWG1v86CyfvU.m6r5EtN8ub9/Bk2EA26PrMvDOBFDSzPtzdZkCcXO',0,'Vocal','2026-06-05 23:31:56','2026-06-10 03:35:31'),(11,17,'1804552170','$2y$12$GHAqSG2JgxS1u32e3Bud6ukjH2KpcmvlY7/I6qaWMW9czkuwzxeF6',0,'Tesorero','2026-06-05 23:31:56','2026-06-10 03:35:31'),(12,21,'0604834556','$2y$12$5/6FlxSiXqPFKTsngl19kOotllXEZzD/bE00PGnRpS1u5LOpkp20e',0,'Vocal Suplente 2','2026-06-10 03:33:05','2026-06-10 13:40:55'),(13,23,'1850351071','$2y$12$AF.bAZuAleMveGRKqEABaedcSVXulGaIGXEYLrY88UYxijrtW91bW',0,'Vocal','2026-06-10 03:33:06','2026-06-10 03:35:31'),(14,20,'1802993939','$2y$12$H0oQafBWcYJFXbWpDuOnSeO3RG4/y38dPrWHT3LBd38.O11v30DCi',0,'Vocal','2026-06-10 03:33:06','2026-06-10 03:35:31'),(15,24,'1804697652','$2y$12$oMI7NWFehnlwc1a77.cQ5ebSoLN/XZWdfXWgGhgesJSH5Zmyz0y6.',0,'Usuario Regular','2026-06-10 13:43:36','2026-06-10 13:43:36');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'basechi'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-10 14:28:13
/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.6.25-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: basechi
-- ------------------------------------------------------
-- Server version	10.6.25-MariaDB-ubu2204

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-10 14:30:02
