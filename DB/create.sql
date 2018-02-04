-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema shipping
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema shipping
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `shipping` DEFAULT CHARACTER SET utf8 ;
USE `shipping` ;

-- -----------------------------------------------------
-- Table `shipping`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `shipping`.`user` (
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
  `type` INT NULL,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC),
  PRIMARY KEY (`user_id`, `email`, `username`));


-- -----------------------------------------------------
-- Table `shipping`.`country`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `shipping`.`country` (
  `country_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(24) NULL,
  PRIMARY KEY (`country_id`));


-- -----------------------------------------------------
-- Table `shipping`.`category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `shipping`.`category` (
  `category_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `unit` VARCHAR(45) NULL,
  `price` FLOAT NULL,
  PRIMARY KEY (`category_id`));


-- -----------------------------------------------------
-- Table `shipping`.`services`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `shipping`.`services` (
  `service_id` INT NOT NULL AUTO_INCREMENT,
  `servicename` VARCHAR(255) NULL,
  PRIMARY KEY (`service_id`));


-- -----------------------------------------------------
-- Table `shipping`.`shipping_detail`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `shipping`.`shipping_detail` (
  `detail_id` INT NOT NULL AUTO_INCREMENT,
  `type` INT NULL,
  `weight` INT NOT NULL,
  `from` INT NULL,
  `to` INT NULL,
  `category` INT NULL,
  `container` INT NULL,
  `received_date` INT NULL,
  PRIMARY KEY (`detail_id`));


-- -----------------------------------------------------
-- Table `shipping`.`shipping`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `shipping`.`shipping` (
  `shipping_id` INT NOT NULL AUTO_INCREMENT,
  `detail_id` INT NOT NULL,
  `create_time` INT NULL,
  `approved` VARCHAR(1) NULL,
  `ref_price` FLOAT NULL,
  `exact_price` FLOAT NULL,
  `ref_time` INT NOT NULL,
  `status` INT NULL,
  `user_id` INT NULL,
  `exact_time` INT NULL,
  PRIMARY KEY (`shipping_id`));


-- -----------------------------------------------------
-- Table `shipping`.`payment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `shipping`.`payment` (
  `payment_id` INT NOT NULL AUTO_INCREMENT,
  `method_id` INT NULL,
  `shipping_id` INT NULL,
  `create_time` INT NULL,
  `status` INT NULL,
  PRIMARY KEY (`payment_id`));


-- -----------------------------------------------------
-- Table `shipping`.`method`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `shipping`.`method` (
  `method_id` INT NOT NULL AUTO_INCREMENT,
  `description` VARCHAR(255) NULL,
  PRIMARY KEY (`method_id`));


-- -----------------------------------------------------
-- Table `shipping`.`places`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `shipping`.`places` (
  `place_id` INT NOT NULL AUTO_INCREMENT,
  `country` VARCHAR(255) NULL,
  `city` VARCHAR(255) NULL,
  `address` VARCHAR(255) NULL,
  `postcode` VARCHAR(45) NULL,
  PRIMARY KEY (`place_id`),
  UNIQUE INDEX `place_id_UNIQUE` (`place_id` ASC));


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
