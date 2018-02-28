alter table user add column salary float null;
insert into type(`description`) value ('Customer');

update status set description = 'Closed' where status_id = 5;
insert into status(description) values ('Paid');
