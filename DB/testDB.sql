/*
SQLyog Ultimate v11.11 (64 bit)
MySQL - 5.6.24 : Database - testdb
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`testdb` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `testdb`;

/*Table structure for table `bumns` */

DROP TABLE IF EXISTS `bumns`;

CREATE TABLE `bumns` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

/*Data for the table `bumns` */

insert  into `bumns`(`id`,`name`,`status`,`created`,`modified`) values (1,'PT. Bank Negara Indonesia. Tbk',1,'2018-07-20 08:37:42','2018-07-20 08:37:45'),(2,'PT. Bank Rakyat Indonesia. Tbk',1,'2018-07-20 08:38:02','2018-07-20 08:38:04');

/*Table structure for table `categories` */

DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

/*Data for the table `categories` */

insert  into `categories`(`id`,`name`,`status`,`created`,`modified`) values (1,'Jasa Keuangan',1,NULL,NULL),(2,'Media Online',1,NULL,NULL);

/*Table structure for table `reports` */

DROP TABLE IF EXISTS `reports`;

CREATE TABLE `reports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `no_ticket` varchar(32) DEFAULT NULL,
  `description` varchar(128) DEFAULT NULL,
  `status` enum('pending','process','waiting','done') DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `photo` varchar(128) DEFAULT NULL,
  `bumn_id` int(11) DEFAULT NULL,
  `no_hp` varchar(16) DEFAULT NULL,
  `lokasi` varchar(32) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `long` varchar(64) DEFAULT NULL,
  `lat` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

/*Data for the table `reports` */

insert  into `reports`(`id`,`user_id`,`name`,`no_ticket`,`description`,`status`,`date`,`photo`,`bumn_id`,`no_hp`,`lokasi`,`category_id`,`long`,`lat`) values (1,1,'Laporan 1','3737','Antrian loket teler di BNI KC Cepu sangat lama sekali, dari 6 loket teler hanya  2 loket teler saja yang melayani','waiting','2018-07-20 08:31:44','/2011/01/51114a03-1a04-4fba-8e2f-2380ca2ba9b3.jpg',1,'0987654321','Sumatera Utara',1,'-73.98591160000001','40.7637828'),(2,2,'Laporan 2','3738','Antrian loket teler di BNI KC Cepu sangat lama sekali, dari 6 loket teler hanya  2 loket teler saja yang melayani','process','2018-07-20 08:41:20','/2011/01/51114a03-1a04-4fba-8e2f-2380ca2ba9b3.jpg',2,'0987654321','Jawa Barat',2,'105.40680789999999','-4.5585849');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nik` varchar(64) NOT NULL,
  `name` varchar(128) NOT NULL,
  `password` varchar(128) NOT NULL,
  `bumnid` varchar(64) NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `token` varchar(128) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

/*Data for the table `users` */

insert  into `users`(`id`,`nik`,`name`,`password`,`bumnid`,`last_login`,`token`,`status`,`created`,`modified`) values (1,'12345','Test user','827ccb0eea8a706c4c34a16891f84e7b','12345','2018-07-20 08:25:10','8089b84cae058b2ff75d3e2b85a5e0db',1,'2018-07-20 08:14:35','2018-07-20 08:25:10'),(2,'54321','Test User 2','827ccb0eea8a706c4c34a16891f84e7b','54321',NULL,NULL,1,'2018-07-20 08:27:09','2018-07-20 08:27:12'),(3,'51423','Test User 3','827ccb0eea8a706c4c34a16891f84e7b','51423',NULL,NULL,1,'2018-07-20 08:27:35','2018-07-20 08:27:38');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
