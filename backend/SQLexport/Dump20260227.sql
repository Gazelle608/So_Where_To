-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: so_where_to
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `blog_posts`
--

DROP TABLE IF EXISTS `blog_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog_posts` (
  `post_id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `excerpt` text,
  `body` longtext NOT NULL,
  `cover_image_url` varchar(500) DEFAULT NULL,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `published_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`post_id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_posts`
--

LOCK TABLES `blog_posts` WRITE;
/*!40000 ALTER TABLE `blog_posts` DISABLE KEYS */;
/*!40000 ALTER TABLE `blog_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `booking_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `offer_id` bigint DEFAULT NULL,
  `destination_id` bigint NOT NULL,
  `departure_date` date DEFAULT NULL,
  `return_date` date DEFAULT NULL,
  `travelers_count` int NOT NULL DEFAULT '1',
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending',
  `itinerary_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`booking_id`),
  KEY `user_id` (`user_id`),
  KEY `offer_id` (`offer_id`),
  KEY `destination_id` (`destination_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`offer_id`) REFERENCES `spin_offers` (`offer_id`) ON DELETE SET NULL,
  CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`destination_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `cart_item_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `destination_id` bigint NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `unit_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`cart_item_id`),
  UNIQUE KEY `uq_user_destination_cart` (`user_id`,`destination_id`),
  KEY `destination_id` (`destination_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`destination_id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `destination_tags`
--

DROP TABLE IF EXISTS `destination_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `destination_tags` (
  `destination_tag_id` bigint NOT NULL AUTO_INCREMENT,
  `destination_id` bigint NOT NULL,
  `tag` varchar(80) NOT NULL,
  PRIMARY KEY (`destination_tag_id`),
  UNIQUE KEY `uq_destination_tag` (`destination_id`,`tag`),
  CONSTRAINT `destination_tags_ibfk_1` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`destination_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=166 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `destination_tags`
--

LOCK TABLES `destination_tags` WRITE;
/*!40000 ALTER TABLE `destination_tags` DISABLE KEYS */;
INSERT INTO `destination_tags` VALUES (1,1,'Culture'),(2,1,'Food'),(3,1,'Technology'),(5,2,'Culture'),(6,2,'Gardens'),(4,2,'Temples'),(8,3,'Castles'),(7,3,'Food'),(9,3,'Nightlife'),(11,4,'Food'),(10,4,'K-Pop'),(12,4,'Technology'),(13,5,'Beach'),(15,5,'Seafood'),(14,5,'Temples'),(18,6,'Culture'),(17,6,'Great Wall'),(16,6,'History'),(21,7,'Food'),(19,7,'Modern'),(20,7,'Shopping'),(23,8,'Food'),(24,8,'Shopping'),(22,8,'Skyline'),(26,9,'Food'),(27,9,'Markets'),(25,9,'Temples'),(30,10,'Culture'),(28,10,'Mountains'),(29,10,'Temples'),(31,11,'Beach'),(32,11,'Islands'),(33,11,'Nightlife'),(35,12,'Food'),(36,12,'Gardens'),(34,12,'Modern'),(39,13,'Culture'),(38,13,'Food'),(37,13,'Petronas'),(41,14,'Food'),(40,14,'History'),(42,14,'Old Quarter'),(45,15,'Food'),(44,15,'History'),(43,15,'Markets'),(47,16,'Art'),(48,16,'Food'),(46,16,'Romance'),(49,17,'History'),(50,17,'Royal'),(51,17,'Theatre'),(54,18,'Art'),(53,18,'Food'),(52,18,'History'),(57,19,'Art'),(55,19,'Canals'),(56,19,'Romance'),(59,20,'Art'),(60,20,'Food'),(58,20,'Renaissance'),(62,21,'Beach'),(63,21,'Food'),(61,21,'Gaudi'),(64,22,'Art'),(65,22,'Food'),(66,22,'Nightlife'),(67,23,'Canals'),(69,23,'Cycling'),(68,23,'Museums'),(71,24,'Art'),(70,24,'History'),(72,24,'Nightlife'),(73,25,'Beer'),(74,25,'Castles'),(75,25,'Culture'),(78,26,'Coffee'),(76,26,'Music'),(77,26,'Palaces'),(80,27,'Beer'),(79,27,'Castle'),(81,27,'History'),(83,28,'Danube'),(84,28,'History'),(82,28,'Thermal'),(86,29,'Food'),(87,29,'Hills'),(85,29,'Trams'),(90,30,'History'),(89,30,'Literature'),(88,30,'Pub'),(92,31,'Beach'),(91,31,'Table Mountain'),(93,31,'Wine'),(94,32,'City'),(95,32,'Culture'),(96,32,'History'),(97,33,'Beach'),(98,33,'Indian Food'),(99,33,'Warm'),(102,34,'Desert'),(101,34,'Medina'),(100,34,'Souk'),(105,35,'History'),(104,35,'Nile'),(103,35,'Pyramids'),(108,36,'Culture'),(106,36,'Safari'),(107,36,'Wildlife'),(109,37,'Beach'),(111,37,'History'),(110,37,'Spice'),(113,38,'Adventure'),(114,38,'Nature'),(112,38,'Waterfall'),(115,39,'Beach'),(117,39,'Lagoon'),(116,39,'Luxury'),(118,40,'Beach'),(119,40,'Islands'),(120,40,'Nature'),(121,41,'City'),(122,41,'Culture'),(123,41,'Shopping'),(125,42,'Beach'),(126,42,'Entertainment'),(124,42,'Hollywood'),(127,43,'Golden Gate'),(129,43,'Hills'),(128,43,'Tech'),(130,44,'Architecture'),(131,44,'Food'),(132,44,'Lake'),(135,45,'Art Deco'),(133,45,'Beach'),(134,45,'Nightlife'),(136,46,'Beach'),(138,46,'Mayan'),(137,46,'Resort'),(141,47,'Culture'),(140,47,'Food'),(139,47,'History'),(144,48,'Beach'),(143,48,'Carnival'),(142,48,'Christ'),(147,49,'European'),(146,49,'Food'),(145,49,'Tango'),(150,50,'Coast'),(148,50,'Food'),(149,50,'History'),(153,51,'Beach'),(152,51,'Harbour'),(151,51,'Opera'),(155,52,'Art'),(154,52,'Coffee'),(156,52,'Sport'),(159,53,'Adventure'),(157,53,'Harbour'),(158,53,'Islands'),(160,54,'Adventure'),(161,54,'Scenery'),(162,54,'Ski'),(164,55,'Beach'),(165,55,'Diving'),(163,55,'Islands');
/*!40000 ALTER TABLE `destination_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `destinations`
--

DROP TABLE IF EXISTS `destinations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `destinations` (
  `destination_id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `country` varchar(120) DEFAULT NULL,
  `region` varchar(120) NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `days` int NOT NULL,
  `rating` decimal(2,1) DEFAULT NULL,
  `revealed` tinyint(1) NOT NULL DEFAULT '1',
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  PRIMARY KEY (`destination_id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `destinations`
--

LOCK TABLES `destinations` WRITE;
/*!40000 ALTER TABLE `destinations` DISABLE KEYS */;
INSERT INTO `destinations` VALUES (1,'Tokyo','Japan','Asia','/images/tokyo.jpg',1299.00,5,4.8,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',35.67620000,139.65030000),(2,'Kyoto','Japan','Asia','/images/kyoto.jpg',1199.00,5,4.7,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',35.01160000,135.76810000),(3,'Osaka','Japan','Asia','/images/osaka.jpg',1099.00,4,4.6,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',34.69370000,135.50230000),(4,'Seoul','South Korea','Asia','/images/seoul.jpg',1199.00,5,4.7,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',37.56650000,126.97800000),(5,'Busan','South Korea','Asia','/images/busan.jpg',1099.00,4,4.5,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',35.17960000,129.07560000),(6,'Beijing','China','Asia','/images/beijing.jpg',1099.00,5,4.6,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',39.90420000,116.40740000),(7,'Shanghai','China','Asia','/images/shanghai.jpg',1199.00,5,4.7,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',31.23040000,121.47370000),(8,'Hong Kong','China','Asia','/images/hongkong.jpg',1299.00,5,4.8,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',22.31930000,114.16940000),(9,'Bangkok','Thailand','Asia','/images/bangkok.jpg',899.00,5,4.6,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',13.75630000,100.50180000),(10,'Chiang Mai','Thailand','Asia','/images/chiangmai.jpg',849.00,4,4.7,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',18.78830000,98.98530000),(11,'Phuket','Thailand','Asia','/images/phuket.jpg',899.00,5,4.5,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',7.88040000,98.39230000),(12,'Singapore','Singapore','Asia','/images/singapore.jpg',1199.00,4,4.8,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',1.35210000,103.81980000),(13,'Kuala Lumpur','Malaysia','Asia','/images/kl.jpg',949.00,4,4.5,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',3.13900000,101.68690000),(14,'Hanoi','Vietnam','Asia','/images/hanoi.jpg',849.00,5,4.6,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',21.02850000,105.85420000),(15,'Ho Chi Minh City','Vietnam','Asia','/images/hcmc.jpg',849.00,4,4.5,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',10.82310000,106.62970000),(16,'Paris','France','Europe','/images/paris.jpg',999.00,4,4.7,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',48.85660000,2.35220000),(17,'London','UK','Europe','/images/london.jpg',1099.00,5,4.7,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',51.50740000,-0.12780000),(18,'Rome','Italy','Europe','/images/rome.jpg',949.00,4,4.8,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',41.90280000,12.49640000),(19,'Venice','Italy','Europe','/images/venice.jpg',999.00,4,4.7,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',45.44080000,12.31550000),(20,'Florence','Italy','Europe','/images/florence.jpg',949.00,4,4.8,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',43.76960000,11.25580000),(21,'Barcelona','Spain','Europe','/images/barcelona.jpg',899.00,4,4.7,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',41.38510000,2.17340000),(22,'Madrid','Spain','Europe','/images/madrid.jpg',899.00,4,4.6,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',40.41680000,-3.70380000),(23,'Amsterdam','Netherlands','Europe','/images/amsterdam.jpg',949.00,4,4.7,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',52.36760000,4.90410000),(24,'Berlin','Germany','Europe','/images/berlin.jpg',899.00,4,4.6,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',52.52000000,13.40500000),(25,'Munich','Germany','Europe','/images/munich.jpg',899.00,4,4.6,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',48.13510000,11.58200000),(26,'Vienna','Austria','Europe','/images/vienna.jpg',949.00,4,4.7,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',48.20820000,16.37380000),(27,'Prague','Czech Republic','Europe','/images/prague.jpg',849.00,4,4.7,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',50.07550000,14.43780000),(28,'Budapest','Hungary','Europe','/images/budapest.jpg',849.00,4,4.6,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',47.49790000,19.04020000),(29,'Lisbon','Portugal','Europe','/images/lisbon.jpg',849.00,4,4.7,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',38.72230000,-9.13930000),(30,'Dublin','Ireland','Europe','/images/dublin.jpg',899.00,4,4.6,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',53.34980000,-6.26030000),(31,'Cape Town','South Africa','Africa','/images/capetown.jpg',799.00,4,4.9,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',-33.92490000,18.42410000),(32,'Johannesburg','South Africa','Africa','/images/johannesburg.jpg',749.00,4,4.5,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',-26.20410000,28.04730000),(33,'Durban','South Africa','Africa','/images/durban.jpg',749.00,4,4.5,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',-29.85870000,31.02180000),(34,'Marrakech','Morocco','Africa','/images/marrakech.jpg',899.00,5,4.7,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',31.62950000,-7.98110000),(35,'Cairo','Egypt','Africa','/images/cairo.jpg',949.00,5,4.6,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',30.04440000,31.23570000),(36,'Nairobi','Kenya','Africa','/images/nairobi.jpg',999.00,6,4.6,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',-1.29210000,36.82190000),(37,'Zanzibar','Tanzania','Africa','/images/zanzibar.jpg',1099.00,6,4.8,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',-6.16590000,39.20260000),(38,'Victoria Falls','Zimbabwe','Africa','/images/vicfalls.jpg',999.00,5,4.9,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',-17.92430000,25.85690000),(39,'Mauritius','Mauritius','Africa','/images/mauritius.jpg',1199.00,7,4.8,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',-20.34840000,57.55220000),(40,'Seychelles','Seychelles','Africa','/images/seychelles.jpg',1299.00,7,4.9,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',-4.67960000,55.49200000),(41,'New York','USA','Americas','/images/nyc.jpg',1199.00,4,4.8,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',40.71280000,-74.00600000),(42,'Los Angeles','USA','Americas','/images/la.jpg',1199.00,4,4.6,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',34.05220000,-118.24370000),(43,'San Francisco','USA','Americas','/images/sf.jpg',1199.00,4,4.7,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',37.77490000,-122.41940000),(44,'Chicago','USA','Americas','/images/chicago.jpg',1099.00,4,4.6,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',41.87810000,-87.62980000),(45,'Miami','USA','Americas','/images/miami.jpg',1099.00,4,4.6,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',25.76170000,-80.19180000),(46,'Cancun','Mexico','Americas','/images/cancun.jpg',999.00,5,4.7,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',21.16190000,-86.85150000),(47,'Mexico City','Mexico','Americas','/images/mexicocity.jpg',949.00,4,4.6,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',19.43260000,-99.13320000),(48,'Rio de Janeiro','Brazil','Americas','/images/rio.jpg',1099.00,6,4.8,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',-22.90680000,-43.17290000),(49,'Buenos Aires','Argentina','Americas','/images/buenosaires.jpg',999.00,5,4.7,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',-34.60370000,-58.38160000),(50,'Lima','Peru','Americas','/images/lima.jpg',949.00,5,4.6,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',-12.04640000,-77.04280000),(51,'Sydney','Australia','Oceania','/images/sydney.jpg',1499.00,7,4.8,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',-33.86880000,151.20930000),(52,'Melbourne','Australia','Oceania','/images/melbourne.jpg',1399.00,6,4.7,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',-37.81360000,144.96310000),(53,'Auckland','New Zealand','Oceania','/images/auckland.jpg',1399.00,6,4.7,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',-36.84850000,174.76330000),(54,'Queenstown','New Zealand','Oceania','/images/queenstown.jpg',1499.00,6,4.9,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',-45.03120000,168.66260000),(55,'Fiji','Fiji','Oceania','/images/fiji.jpg',1399.00,7,4.8,1,0,1,'2026-02-19 09:13:15','2026-02-19 09:13:15',-17.71340000,178.06500000),(59,'Mystery Americas',NULL,'Americas','https://images.unsplash.com/photo-1438401171849-74ac270044ee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2VhdHRsZXxlbnwwfHwwfHx8MA%3D%3D',790.00,5,NULL,0,0,1,'2026-02-27 11:54:50','2026-02-27 11:54:50',10.00000000,-70.00000000);
/*!40000 ALTER TABLE `destinations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_verifications`
--

DROP TABLE IF EXISTS `email_verifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_verifications` (
  `verification_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`verification_id`),
  UNIQUE KEY `token` (`token`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `email_verifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_verifications`
--

LOCK TABLES `email_verifications` WRITE;
/*!40000 ALTER TABLE `email_verifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `email_verifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faqs`
--

DROP TABLE IF EXISTS `faqs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faqs` (
  `faq_id` bigint NOT NULL AUTO_INCREMENT,
  `question` varchar(500) NOT NULL,
  `answer` text NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`faq_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faqs`
--

LOCK TABLES `faqs` WRITE;
/*!40000 ALTER TABLE `faqs` DISABLE KEYS */;
/*!40000 ALTER TABLE `faqs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `help_topics`
--

DROP TABLE IF EXISTS `help_topics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `help_topics` (
  `topic_id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `body` text NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`topic_id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `help_topics`
--

LOCK TABLES `help_topics` WRITE;
/*!40000 ALTER TABLE `help_topics` DISABLE KEYS */;
/*!40000 ALTER TABLE `help_topics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mystery_destinations`
--

DROP TABLE IF EXISTS `mystery_destinations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mystery_destinations` (
  `destination_id` bigint NOT NULL,
  `name` varchar(150) NOT NULL,
  `region` varchar(120) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `days` int NOT NULL,
  `tags` json NOT NULL,
  `revealed` tinyint(1) NOT NULL DEFAULT '0',
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`destination_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mystery_destinations`
--

LOCK TABLES `mystery_destinations` WRITE;
/*!40000 ALTER TABLE `mystery_destinations` DISABLE KEYS */;
INSERT INTO `mystery_destinations` VALUES (56,'Mystery Asia','Asia',750.00,5,'[\"Mystery\", \"Adventure\", \"Culture\"]',0,25.00000000,105.00000000,'https://plus.unsplash.com/premium_photo-1661878434394-7f7e3d032b2a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXNpYXxlbnwwfHwwfHx8MA%3D%3D','2026-02-27 10:12:03'),(57,'Mystery Europe','Europe',720.00,4,'[\"Mystery\", \"History\", \"Food\"]',0,50.00000000,10.00000000,'https://plus.unsplash.com/premium_photo-1661964149725-fbf14eabd38c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z3JlZWNlfGVufDB8fDB8fHww','2026-02-27 10:12:03'),(58,'Mystery Africa','Africa',680.00,5,'[\"Mystery\", \"Safari\", \"Adventure\"]',0,5.00000000,25.00000000,'https://plus.unsplash.com/premium_photo-1661936361131-c421746dcd0d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWZyaWNhfGVufDB8fDB8fHww','2026-02-27 10:12:03'),(59,'Mystery Americas','Americas',790.00,5,'[\"Mystery\", \"Beach\", \"Culture\"]',0,10.00000000,-70.00000000,'https://images.unsplash.com/photo-1438401171849-74ac270044ee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2VhdHRsZXxlbnwwfHwwfHx8MA%3D%3D','2026-02-27 10:12:03'),(60,'Mystery Oceania','Oceania',850.00,6,'[\"Mystery\", \"Island\", \"Adventure\"]',0,-20.00000000,150.00000000,'https://images.unsplash.com/photo-1598135753163-6167c1a1ad65?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGF3YWlpfGVufDB8fDB8fHww','2026-02-27 10:12:03');
/*!40000 ALTER TABLE `mystery_destinations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_resets` (
  `reset_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reset_id`),
  UNIQUE KEY `token` (`token`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_methods`
--

DROP TABLE IF EXISTS `payment_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_methods` (
  `payment_method_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `method_type` enum('card','bank_transfer','wallet') NOT NULL,
  `provider` varchar(80) DEFAULT NULL,
  `last4` varchar(4) DEFAULT NULL,
  `expiry_month` tinyint DEFAULT NULL,
  `expiry_year` smallint DEFAULT NULL,
  `token_ref` varchar(255) DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_method_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `payment_methods_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_methods`
--

LOCK TABLES `payment_methods` WRITE;
/*!40000 ALTER TABLE `payment_methods` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` bigint NOT NULL AUTO_INCREMENT,
  `booking_id` bigint NOT NULL,
  `user_id` int NOT NULL,
  `payment_method_id` bigint DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` char(3) NOT NULL DEFAULT 'ZAR',
  `status` enum('pending','success','failed','refunded') NOT NULL DEFAULT 'pending',
  `transaction_ref` varchar(120) DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  UNIQUE KEY `transaction_ref` (`transaction_ref`),
  KEY `booking_id` (`booking_id`),
  KEY `user_id` (`user_id`),
  KEY `payment_method_id` (`payment_method_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE,
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `payments_ibfk_3` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`payment_method_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `token_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` varchar(512) NOT NULL,
  `expires_at` datetime NOT NULL,
  `revoked` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`token_id`),
  UNIQUE KEY `token` (`token`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `spin_offers`
--

DROP TABLE IF EXISTS `spin_offers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `spin_offers` (
  `offer_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `destination_id` bigint NOT NULL,
  `offered_price` decimal(10,2) NOT NULL,
  `expires_at` datetime NOT NULL,
  `status` enum('pending','accepted','declined','expired') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`offer_id`),
  KEY `user_id` (`user_id`),
  KEY `destination_id` (`destination_id`),
  CONSTRAINT `spin_offers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `spin_offers_ibfk_2` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`destination_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `spin_offers`
--

LOCK TABLES `spin_offers` WRITE;
/*!40000 ALTER TABLE `spin_offers` DISABLE KEYS */;
/*!40000 ALTER TABLE `spin_offers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `support_tickets`
--

DROP TABLE IF EXISTS `support_tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `support_tickets` (
  `ticket_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `name` varchar(120) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `status` enum('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ticket_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `support_tickets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `support_tickets`
--

LOCK TABLES `support_tickets` WRITE;
/*!40000 ALTER TABLE `support_tickets` DISABLE KEYS */;
/*!40000 ALTER TABLE `support_tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testimonials`
--

DROP TABLE IF EXISTS `testimonials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `testimonials` (
  `testimonial_id` bigint NOT NULL AUTO_INCREMENT,
  `author_name` varchar(120) NOT NULL,
  `author_location` varchar(120) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT '5.0',
  `quote_text` text NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`testimonial_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testimonials`
--

LOCK TABLES `testimonials` WRITE;
/*!40000 ALTER TABLE `testimonials` DISABLE KEYS */;
/*!40000 ALTER TABLE `testimonials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_blacklist`
--

DROP TABLE IF EXISTS `user_blacklist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_blacklist` (
  `blacklist_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `destination_id` bigint NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`blacklist_id`),
  UNIQUE KEY `uq_user_blacklist` (`user_id`,`destination_id`),
  KEY `fk_user_blacklist_destination` (`destination_id`),
  CONSTRAINT `fk_user_blacklist_destination` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`destination_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_blacklist`
--

LOCK TABLES `user_blacklist` WRITE;
/*!40000 ALTER TABLE `user_blacklist` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_blacklist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_preferences`
--

DROP TABLE IF EXISTS `user_preferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_preferences` (
  `preference_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `budget_min` decimal(10,2) DEFAULT NULL,
  `budget_max` decimal(10,2) DEFAULT NULL,
  `preferred_duration_days` int DEFAULT NULL,
  `preferred_regions` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`preference_id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `user_preferences_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_preferences`
--

LOCK TABLES `user_preferences` WRITE;
/*!40000 ALTER TABLE `user_preferences` DISABLE KEYS */;
INSERT INTO `user_preferences` VALUES (1,2,799.00,1500.00,NULL,'[]','2026-02-25 13:35:12','2026-02-25 13:35:12');
/*!40000 ALTER TABLE `user_preferences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_profiles`
--

DROP TABLE IF EXISTS `user_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_profiles` (
  `profile_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `country` varchar(120) DEFAULT NULL,
  `city` varchar(120) DEFAULT NULL,
  `avatar_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`profile_id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_profiles`
--

LOCK TABLES `user_profiles` WRITE;
/*!40000 ALTER TABLE `user_profiles` DISABLE KEYS */;
INSERT INTO `user_profiles` VALUES (1,2,'+27 12 345 6789','1994-06-10','South Africa','Cape Town',NULL,'2026-02-25 13:37:23','2026-02-25 13:55:11');
/*!40000 ALTER TABLE `user_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(120) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `email_verified` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Waathiq Hendricks','waathiqhendricks0606@gmail.com','$2b$10$9FUrxFkCMvNWHF4gSqg7YuZVNAURfd4O.EJhqEI.0RvXu1wO.OBSG','user',0,1,'2026-02-25 09:54:23','2026-02-25 09:54:23'),(2,'steve dg','hdbfubs@gmail.com','$2b$10$78nf69zhF0.VFaQL3GggaeYnO7vqVJxHkHMljEvhF8zfYGRebkM4i','user',0,1,'2026-02-25 09:57:14','2026-02-25 09:57:14');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-27 14:07:08
