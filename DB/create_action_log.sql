CREATE TABLE IF NOT EXISTS `employee`.`action` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `task_id` INT NOT NULL,
  `update_time` VARCHAR(255) NULL,
  `status_id` INT NULL,
  `user_id` INT NULL,
  `description` VARCHAR(255) NULL,
  PRIMARY KEY (`id`));
  
  