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

  insert into refname(description) values ('Audio Design');
  insert into refname(description) values ('EE Design');
  insert into refname(description) values ('EE Library');
  insert into refname(description) values ('EE Test');
  insert into refname(description) values ('ME Design');
  insert into refname(description) values ('ME Drawing');
  insert into refname(description) values ('PCB Design');
  insert into refname(description) values ('PM');
  insert into refname(description) values ('RF Design');
  insert into refname(description) values ('SW Design');
  
  insert into activity(description) values ('');
  insert into activity(description) values ('Admin');
insert into activity(description) values ('Factory');
insert into activity(description) values ('General-Library');
insert into activity(description) values ('Meeting');
insert into activity(description) values ('NBH');
insert into activity(description) values ('PCB Camera');
insert into activity(description) values ('PCB Imager');
insert into activity(description) values ('PCB Main');
insert into activity(description) values ('PCB Power');
insert into activity(description) values ('PCB Sensor');
insert into activity(description) values ('Phase I-Concept');
insert into activity(description) values ('Phase II-Design');
insert into activity(description) values ('Phase III-Optimize');
insert into activity(description) values ('Planning');
insert into activity(description) values ('Sales');
insert into activity(description) values ('Testing');
insert into activity(description) values ('Quote');
insert into activity(description) values ('Product');
  
