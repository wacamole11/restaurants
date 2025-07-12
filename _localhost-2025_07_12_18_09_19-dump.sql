-- MySQL dump 10.13  Distrib 8.0.41, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: restaurant_db
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `mesas`
--

DROP TABLE IF EXISTS `mesas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mesas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero_mesa` varchar(20) NOT NULL,
  `capacidad` int NOT NULL,
  `estado` varchar(45) DEFAULT 'DISPONIBLE',
  `descripcion` varchar(255) DEFAULT NULL,
  `foto_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero_mesa_UNIQUE` (`numero_mesa`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mesas`
--

LOCK TABLES `mesas` WRITE;
/*!40000 ALTER TABLE `mesas` DISABLE KEYS */;
INSERT INTO `mesas` VALUES (2,'2',6,'RESERVADA',NULL,NULL),(3,'3',2,'DISPONIBLE',NULL,NULL),(4,'4',8,'DISPONIBLE',NULL,NULL),(5,'5',4,'DISPONIBLE',NULL,NULL),(6,'6',6,'DISPONIBLE',NULL,NULL),(7,'7',2,'DISPONIBLE',NULL,NULL),(8,'8',4,'DISPONIBLE',NULL,NULL),(9,'9',8,'DISPONIBLE',NULL,NULL),(10,'10',6,'DISPONIBLE',NULL,NULL),(12,'11',5,'DISPONIBLE','mesa para feos',NULL);
/*!40000 ALTER TABLE `mesas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido_platillos`
--

DROP TABLE IF EXISTS `pedido_platillos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido_platillos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pedido_id` int NOT NULL,
  `platillo_id` int NOT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_pedido_platillos_pedidos_idx` (`pedido_id`),
  KEY `fk_pedido_platillos_platillos_idx` (`platillo_id`),
  CONSTRAINT `fk_pedido_platillos_pedidos` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_pedido_platillos_platillos` FOREIGN KEY (`platillo_id`) REFERENCES `platillos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido_platillos`
--

LOCK TABLES `pedido_platillos` WRITE;
/*!40000 ALTER TABLE `pedido_platillos` DISABLE KEYS */;
INSERT INTO `pedido_platillos` VALUES (1,1,2,1,35.00,35.00),(2,1,10,1,8.00,8.00),(3,1,9,1,12.00,12.00),(4,2,1,1,25.00,25.00),(5,2,3,1,28.00,28.00),(6,2,10,2,8.00,16.00),(7,3,5,1,30.00,30.00),(8,3,8,1,40.00,40.00),(9,3,10,1,8.00,8.00),(10,4,4,1,22.00,22.00),(11,4,10,1,8.00,8.00);
/*!40000 ALTER TABLE `pedido_platillos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `mesa_id` int NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `estado` varchar(45) NOT NULL DEFAULT 'PENDIENTE',
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_cierre` datetime DEFAULT NULL,
  `cancelado_por_reserva` bit(1) DEFAULT NULL,
  `hora_entrega_programada` datetime(6) DEFAULT NULL,
  `reserva_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_pedidos_usuarios_idx` (`usuario_id`),
  KEY `fk_pedidos_mesas_idx` (`mesa_id`),
  KEY `FK5apflxodtau8d0tqvnxceeeof` (`reserva_id`),
  CONSTRAINT `FK5apflxodtau8d0tqvnxceeeof` FOREIGN KEY (`reserva_id`) REFERENCES `reservas` (`id`),
  CONSTRAINT `fk_pedidos_mesas` FOREIGN KEY (`mesa_id`) REFERENCES `mesas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_pedidos_usuarios` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (1,10,8,45.00,'COMPLETADO','2025-07-12 10:00:00','2025-07-12 11:30:00',NULL,NULL,NULL),(2,14,4,67.00,'PENDIENTE','2025-07-12 11:15:00',NULL,NULL,NULL,NULL),(3,16,8,89.00,'EN_PREPARACION','2025-07-12 12:00:00',NULL,NULL,NULL,NULL),(4,10,4,34.00,'COMPLETADO','2025-07-12 13:30:00','2025-07-12 14:45:00',NULL,NULL,NULL),(5,15,6,56.00,'CANCELADO','2025-07-12 14:00:00',NULL,NULL,NULL,NULL),(6,10,4,0.00,'cancelado','2025-07-12 05:22:56','2025-07-12 10:23:04',_binary '\0','2025-07-26 11:15:00.000000',26),(7,10,3,0.00,'cancelado','2025-07-12 09:29:17','2025-07-12 21:19:04',_binary '\0','2025-07-13 15:00:00.000000',30),(8,10,4,120.00,'en_proceso','2025-07-12 17:02:31',NULL,_binary '\0',NULL,27),(9,10,2,166.00,'cancelado','2025-07-12 17:44:28','2025-07-12 17:44:55',_binary '',NULL,32);
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos_platillos`
--

DROP TABLE IF EXISTS `pedidos_platillos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos_platillos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pedido_id` int NOT NULL,
  `platillo_id` int NOT NULL,
  `cantidad` int NOT NULL DEFAULT '1',
  `precio_unitario` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_pedidos_platillos_pedidos1_idx` (`pedido_id`),
  KEY `fk_pedidos_platillos_platillos1_idx` (`platillo_id`),
  CONSTRAINT `fk_pedidos_platillos_pedidos` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pedidos_platillos_platillos` FOREIGN KEY (`platillo_id`) REFERENCES `platillos` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos_platillos`
--

LOCK TABLES `pedidos_platillos` WRITE;
/*!40000 ALTER TABLE `pedidos_platillos` DISABLE KEYS */;
INSERT INTO `pedidos_platillos` VALUES (33,21,2,1,25.00),(34,21,3,1,8.00),(35,22,2,1,25.00),(36,22,3,1,8.00),(37,23,3,1,8.00),(38,23,4,1,2.50),(39,24,2,1,25.00),(40,25,2,1,25.00),(41,26,3,1,8.00),(42,26,4,1,2.50),(43,27,3,1,8.00),(44,27,4,1,2.50),(45,27,6,1,12.00),(46,28,2,1,25.00),(47,28,4,1,2.50),(48,28,6,1,12.00),(49,29,2,1,25.00),(50,29,3,1,8.00),(51,29,4,1,2.50),(52,30,2,1,26.00),(53,30,3,1,8.00),(54,30,4,1,2.50),(55,6,2,1,35.00),(56,6,10,1,8.00),(57,6,9,1,12.00),(58,6,8,1,40.00),(59,7,11,1,20.00),(60,7,10,1,8.00),(61,7,4,2,22.00),(62,8,11,6,20.00),(63,9,1,6,25.00),(64,9,10,2,8.00);
/*!40000 ALTER TABLE `pedidos_platillos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `platillos`
--

DROP TABLE IF EXISTS `platillos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `platillos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text,
  `precio` decimal(10,2) NOT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `disponible` tinyint(1) DEFAULT '1',
  `imagen_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platillos`
--

LOCK TABLES `platillos` WRITE;
/*!40000 ALTER TABLE `platillos` DISABLE KEYS */;
INSERT INTO `platillos` VALUES (1,'Ceviche de pota','Pescado fresco marinado en limón con cebolla y cilantro',25.00,'Plato Fuerte',1,NULL),(2,'Lomo Saltado','Tiras de lomo fino salteadas con cebolla, tomate y papas fritas',35.00,'Platos Principales',1,NULL),(3,'Ají de Gallina','Pollo deshilachado en salsa de ají amarillo con arroz',28.00,'Platos Principales',1,NULL),(4,'Causa Limeña','Puré de papa amarilla con relleno de pollo y aguacate',22.00,'Entradas',1,NULL),(5,'Rocoto Relleno','Rocoto relleno con carne molida, queso y huevo',30.00,'Platos Principales',1,NULL),(6,'Chupe de Camarones','Sopa espesa de camarones con leche y huevo',32.00,'Sopas',1,NULL),(7,'Anticuchos','Brochetas de corazón de res marinadas y asadas',18.00,'Entradas',1,NULL),(8,'Pollo a la Brasa','Pollo asado con hierbas y especias, servido con papas',40.00,'Platos Principales',1,NULL),(9,'Suspiro a la Limeña','Postre tradicional de manjar blanco con merengue',12.00,'Postres',1,NULL),(10,'Chicha Morada','Bebida tradicional de maíz morado',8.00,'Bebidas',1,NULL),(11,'CONCHA MARINA','Riquita conchina negrita de mar',20.00,'Plato Fuerte',1,NULL);
/*!40000 ALTER TABLE `platillos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservas`
--

DROP TABLE IF EXISTS `reservas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `mesa_id` int NOT NULL,
  `fecha_reserva` datetime NOT NULL,
  `num_personas` int NOT NULL,
  `estado` varchar(45) NOT NULL DEFAULT 'PENDIENTE',
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `cancelado_por` varchar(45) DEFAULT NULL,
  `cancelada_por` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_reservas_usuarios_idx` (`usuario_id`),
  KEY `fk_reservas_mesas_idx` (`mesa_id`),
  CONSTRAINT `fk_reservas_mesas` FOREIGN KEY (`mesa_id`) REFERENCES `mesas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_reservas_usuarios` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservas`
--

LOCK TABLES `reservas` WRITE;
/*!40000 ALTER TABLE `reservas` DISABLE KEYS */;
INSERT INTO `reservas` VALUES (8,10,8,'2025-07-26 11:06:00',1,'CANCELADA','2025-07-12 07:06:04',NULL,NULL),(9,10,8,'2025-07-19 11:45:00',6,'CANCELADA','2025-07-12 07:14:28',NULL,NULL),(10,10,8,'2025-07-31 14:15:00',6,'CANCELADA','2025-07-12 07:15:19',NULL,NULL),(11,10,8,'2025-07-30 15:00:00',1,'CANCELADA','2025-07-12 07:15:31',NULL,NULL),(12,10,4,'2025-07-26 14:30:00',4,'CANCELADA','2025-07-12 07:15:45',NULL,NULL),(13,10,4,'2025-07-13 10:45:00',1,'CANCELADA','2025-07-12 07:33:47',NULL,NULL),(14,10,4,'2025-07-17 11:00:00',1,'CANCELADA','2025-07-12 07:36:17',NULL,NULL),(15,10,4,'2025-07-25 11:45:00',1,'CANCELADA','2025-07-12 07:39:36',NULL,NULL),(16,10,4,'2025-07-13 11:30:00',1,'CANCELADA','2025-07-12 07:41:24',NULL,NULL),(17,10,8,'2025-07-20 10:00:00',2,'CANCELADA','2025-07-12 07:52:21','USUARIO',NULL),(18,10,4,'2025-07-20 11:45:00',1,'CANCELADA','2025-07-12 07:55:30','USUARIO',NULL),(19,10,4,'2025-07-13 12:30:00',1,'CANCELADA','2025-07-12 07:57:42','USUARIO',NULL),(20,10,8,'2025-07-20 12:00:00',1,'CANCELADA','2025-07-12 07:59:13','ADMIN',NULL),(21,14,4,'2025-07-19 11:45:00',1,'CANCELADA','2025-07-12 08:06:32','USUARIO',NULL),(22,14,8,'2025-07-26 12:30:00',1,'CONFIRMADA','2025-07-12 08:06:50',NULL,NULL),(23,16,4,'2025-07-18 12:15:00',4,'CONFIRMADA','2025-07-12 09:07:48',NULL,NULL),(24,16,8,'2025-07-20 12:15:00',1,'CANCELADA','2025-07-12 09:08:35','USUARIO',NULL),(25,10,8,'2025-07-12 12:15:00',1,'CANCELADA','2025-07-12 09:22:09',NULL,'USUARIO'),(26,10,4,'2025-07-26 11:15:00',1,'CONFIRMADA','2025-07-12 09:22:22',NULL,NULL),(27,10,4,'2025-07-26 11:30:00',1,'CONFIRMADA','2025-07-12 09:26:16',NULL,NULL),(28,10,8,'2025-07-25 12:15:00',1,'CONFIRMADA','2025-07-12 09:26:25',NULL,NULL),(29,10,2,'2025-07-20 11:45:00',1,'CONFIRMADA','2025-07-12 05:22:41',NULL,NULL),(30,10,3,'2025-07-13 15:00:00',2,'CONFIRMADA','2025-07-12 09:26:41',NULL,NULL),(31,10,2,'2025-07-23 10:15:00',2,'CONFIRMADA','2025-07-12 17:02:02',NULL,NULL),(32,10,2,'2025-07-17 14:00:00',3,'CANCELADA','2025-07-12 17:43:29',NULL,'USUARIO');
/*!40000 ALTER TABLE `reservas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre_UNIQUE` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (3,'USER',NULL),(4,'ADMIN',NULL);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime(6) DEFAULT NULL,
  `fecha_modificacion` datetime(6) DEFAULT NULL,
  `ultimo_login` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (9,'admin','123','administrador','siancas','admin@.com',NULL,1,NULL,'2025-07-12 17:19:48.359389',NULL),(10,'cliente','123','cliente1','nose1','cliente@.com','123456',1,NULL,NULL,NULL),(11,'an','123','anthony','siancas','as@.com','',1,NULL,'2025-07-12 17:19:58.718060',NULL),(12,'cliente2','123','cliente2',NULL,'cliente2@.com',NULL,1,NULL,NULL,NULL),(13,'admin2','123','administrador2',NULL,'admin2@.com',NULL,1,NULL,NULL,NULL),(14,'wacalao','123456','nose','nose','nose@gmail.com','8885552',1,NULL,NULL,NULL),(15,'testuser2','testpass','Test','User','test2@example.com',NULL,1,'2025-07-12 04:05:59.363970','2025-07-12 04:05:59.363993',NULL),(16,'walacaca123','123456','raul','siancas','siancas@gmail.com','933123456',1,'2025-07-12 04:07:16.885510','2025-07-12 04:07:16.885520',NULL),(17,'gerente','123456','María','González','gerente@warmisabor.com','966123456',1,'2025-07-12 10:21:07.000000',NULL,NULL),(18,'chef','123456','Carlos','Rodríguez','chef@warmisabor.com','966789012',1,'2025-07-12 10:21:07.000000',NULL,NULL),(19,'recepcion','123456','Ana','Martínez','recepcion@warmisabor.com','966345678',1,'2025-07-12 10:21:07.000000',NULL,NULL),(20,'juan_perez','123456','Juan','Pérez','juan.perez@gmail.com','966111222',1,'2025-07-12 10:21:07.000000',NULL,NULL),(21,'maria_lopez','123456','María','López','maria.lopez@empresa.com','966333444',1,'2025-07-12 10:21:07.000000',NULL,NULL),(22,'familia_garcia','123456','Roberto','García','roberto.garcia@hotmail.com','966555666',1,'2025-07-12 10:21:07.000000',NULL,NULL),(23,'estudiante_123','123456','Laura','Fernández','laura.fernandez@estudiante.edu.pe','966777888',1,'2025-07-12 10:21:07.000000',NULL,NULL),(24,'turista_usa','123456','John','Smith','john.smith@yahoo.com','966999000',1,'2025-07-12 10:21:07.000000',NULL,NULL),(25,'ayacuchan6','123456','Pedro','Quispe','pedro.quispe@outlook.com','9999222632',0,'2025-07-12 10:21:07.000000','2025-07-12 17:20:32.971650',NULL),(26,'vip_cliente','123456','Carmen','Vargas','carmen.vargas@vip.com','966456789',1,'2025-07-12 10:21:07.000000',NULL,NULL),(27,'delivery_user','123456','Miguel','Torres','miguel.torres@delivery.com','966789123',1,'2025-07-12 10:21:07.000000',NULL,NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios_roles`
--

DROP TABLE IF EXISTS `usuarios_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios_roles` (
  `usuario_id` int NOT NULL,
  `rol_id` int NOT NULL,
  PRIMARY KEY (`usuario_id`,`rol_id`),
  KEY `fk_usuarios_roles_roles1_idx` (`rol_id`),
  KEY `fk_usuarios_roles_usuarios_idx` (`usuario_id`),
  CONSTRAINT `fk_usuarios_roles_roles` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_usuarios_roles_usuarios` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios_roles`
--

LOCK TABLES `usuarios_roles` WRITE;
/*!40000 ALTER TABLE `usuarios_roles` DISABLE KEYS */;
INSERT INTO `usuarios_roles` VALUES (10,3),(13,3),(14,3),(15,3),(16,3),(20,3),(21,3),(22,3),(23,3),(24,3),(25,3),(26,3),(27,3),(9,4),(11,4),(12,4),(17,4),(18,4),(19,4);
/*!40000 ALTER TABLE `usuarios_roles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-12 18:09:20
