CREATE TABLE IF NOT EXISTS `employee`.`refname` (
  `ref_id` INT NOT NULL AUTO_INCREMENT,
  `description` VARCHAR(255)  NULL,
  PRIMARY KEY (`ref_id`));
  
  CREATE TABLE IF NOT EXISTS `employee`.`activity` (
  `activity_id` INT NOT NULL AUTO_INCREMENT,
  `description` VARCHAR(255)  NULL,
  PRIMARY KEY (`activity_id`));
  
  alter table task add ref_id int null;
  alter table task add activity_id int null;
  
	insert into refname(ref_id,description) values (1,' ');
  insert into refname(ref_id,description) values (2,'Audio Design');
  insert into refname(ref_id,description) values (3,'EE Design');
  insert into refname(ref_id,description) values (4,'EE Library');
  insert into refname(ref_id,description) values (5,'EE Test');
  insert into refname(ref_id,description) values (6,'ME Design');
  insert into refname(ref_id,description) values (7,'ME Drawing');
  insert into refname(ref_id,description) values (8,'PCB Design');
  insert into refname(ref_id,description) values (9,'PM');
  insert into refname(ref_id,description) values (10,'RF Design');
  insert into refname(ref_id,description) values (11,'SW Design');
  
  insert into activity(activity_id,description) values (1,' ');
  insert into activity(activity_id,description) values (2,'Admin');
insert into activity(activity_id,description) values (3,'Factory');
insert into activity(activity_id,description) values (4,'General-Library');
insert into activity(activity_id,description) values (5,'Meeting');
insert into activity(activity_id,description) values (6,'NBH');
insert into activity(activity_id,description) values (7,'PCB Camera');
insert into activity(activity_id,description) values (8,'PCB Imager');
insert into activity(activity_id,description) values (9,'PCB Main');
insert into activity(activity_id,description) values (10,'PCB Power');
insert into activity(activity_id,description) values (11,'PCB Sensor');
insert into activity(activity_id,description) values (12,'Phase I-Concept');
insert into activity(activity_id,description) values (13,'Phase II-Design');
insert into activity(activity_id,description) values (14,'Phase III-Optimize');
insert into activity(activity_id,description) values (15,'Planning');
insert into activity(activity_id,description) values (16,'Sales');
insert into activity(activity_id,description) values (17,'Testing');
insert into activity(activity_id,description) values (18,'Quote');
insert into activity(activity_id,description) values (19,'Product');

