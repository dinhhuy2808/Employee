alter table user add column country varchar(255) null;
alter table user add column city varchar(255) null;
alter table user add column address varchar(255) null;

alter table user drop column place_id ;