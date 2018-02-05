-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema employee
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema employee
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `employee` DEFAULT CHARACTER SET utf8 ;
USE `employee` ;

-- -----------------------------------------------------
-- Table `employee`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `employee`.`user` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(16) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `dob` INT NULL,
  `status` INT NULL,
  `phone` INT NULL,
  `place_id` INT NULL,
  `firstname` VARCHAR(255) NULL,
  `lastname` VARCHAR(255) NULL,
  `create_time` INT NULL,
  `type_id` INT NULL,
  `password` VARCHAR(255) NOT NULL,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC),
  PRIMARY KEY (`user_id`, `email`, `username`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC));


-- -----------------------------------------------------
-- Table `employee`.`country`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `employee`.`country` (
  `country_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(24) NULL,
  PRIMARY KEY (`country_id`));


-- -----------------------------------------------------
-- Table `employee`.`project`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `employee`.`project` (
  `project_id` INT NOT NULL AUTO_INCREMENT,
  `project_name` VARCHAR(255) NOT NULL,
  `customer_id` VARCHAR(45) NULL,
  PRIMARY KEY (`project_id`));


-- -----------------------------------------------------
-- Table `employee`.`type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `employee`.`type` (
  `type_id` INT NOT NULL AUTO_INCREMENT,
  `description` VARCHAR(255) NULL,
  PRIMARY KEY (`type_id`));


-- -----------------------------------------------------
-- Table `employee`.`task`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `employee`.`task` (
  `task_id` INT NOT NULL AUTO_INCREMENT,
  `project_id` INT NOT NULL,
  `create_time` INT NULL,
  `approved` VARCHAR(1) NULL,
  `status_id` INT NULL,
  `assignee_id` INT NULL,
  `estimate` INT NULL,
  `log_work` VARCHAR(10) NULL,
  `description` VARCHAR(255) NULL,
  `reporter_id` INT NULL,
  PRIMARY KEY (`task_id`));


-- -----------------------------------------------------
-- Table `employee`.`payment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `employee`.`payment` (
  `payment_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL,
  `salary` FLOAT NULL,
  PRIMARY KEY (`payment_id`));


-- -----------------------------------------------------
-- Table `employee`.`places`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `employee`.`places` (
  `place_id` INT NOT NULL AUTO_INCREMENT,
  `country` VARCHAR(255) NULL,
  `city` VARCHAR(255) NULL,
  `address` VARCHAR(255) NULL,
  PRIMARY KEY (`place_id`),
  UNIQUE INDEX `place_id_UNIQUE` (`place_id` ASC));


-- -----------------------------------------------------
-- Table `employee`.`status`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `employee`.`status` (
  `status_id` INT NOT NULL AUTO_INCREMENT,
  `description` VARCHAR(255) NULL,
  PRIMARY KEY (`status_id`));


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
