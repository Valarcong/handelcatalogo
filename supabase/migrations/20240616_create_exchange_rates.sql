-- Migración para crear la tabla de tipo de cambio
create table if not exists exchange_rates (
  id_tc bigint generated always as identity (start with 1000 increment by 1) primary key,
  fecha date unique not null,
  tc numeric not null
); 