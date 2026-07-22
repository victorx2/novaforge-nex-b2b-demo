-- Seed demo (6 locales). Ejecutar DESPUÉS de 001_init.sql en SQL Editor.
-- Login demo: email de abajo / contraseña: demo1234
-- Nota: requiere extensión pgcrypto (ya en 001_init).

create extension if not exists "pgcrypto";

-- Limpia seed previo (ids fijos)
delete from public.listings where dealer_id in (
  'a1111111-1111-1111-1111-111111111111',
  'a2222222-2222-2222-2222-222222222222',
  'a3333333-3333-3333-3333-333333333333',
  'a4444444-4444-4444-4444-444444444444',
  'a5555555-5555-5555-5555-555555555555',
  'a6666666-6666-6666-6666-666666666666'
);
delete from public.dealers where id in (
  'a1111111-1111-1111-1111-111111111111',
  'a2222222-2222-2222-2222-222222222222',
  'a3333333-3333-3333-3333-333333333333',
  'a4444444-4444-4444-4444-444444444444',
  'a5555555-5555-5555-5555-555555555555',
  'a6666666-6666-6666-6666-666666666666'
);
delete from auth.identities where user_id in (
  'a1111111-1111-1111-1111-111111111111',
  'a2222222-2222-2222-2222-222222222222',
  'a3333333-3333-3333-3333-333333333333',
  'a4444444-4444-4444-4444-444444444444',
  'a5555555-5555-5555-5555-555555555555',
  'a6666666-6666-6666-6666-666666666666'
);
delete from auth.users where id in (
  'a1111111-1111-1111-1111-111111111111',
  'a2222222-2222-2222-2222-222222222222',
  'a3333333-3333-3333-3333-333333333333',
  'a4444444-4444-4444-4444-444444444444',
  'a5555555-5555-5555-5555-555555555555',
  'a6666666-6666-6666-6666-666666666666'
);

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change
) values
(
  '00000000-0000-0000-0000-000000000000',
  'a1111111-1111-1111-1111-111111111111',
  'authenticated', 'authenticated',
  'valencia@demo.local',
  crypt('demo1234', gen_salt('bf')),
  now(), '{"provider":"email","providers":["email"]}', '{}',
  now(), now(), '', '', '', ''
),
(
  '00000000-0000-0000-0000-000000000000',
  'a2222222-2222-2222-2222-222222222222',
  'authenticated', 'authenticated',
  'cagua@demo.local',
  crypt('demo1234', gen_salt('bf')),
  now(), '{"provider":"email","providers":["email"]}', '{}',
  now(), now(), '', '', '', ''
),
(
  '00000000-0000-0000-0000-000000000000',
  'a3333333-3333-3333-3333-333333333333',
  'authenticated', 'authenticated',
  'caracas@demo.local',
  crypt('demo1234', gen_salt('bf')),
  now(), '{"provider":"email","providers":["email"]}', '{}',
  now(), now(), '', '', '', ''
),
(
  '00000000-0000-0000-0000-000000000000',
  'a4444444-4444-4444-4444-444444444444',
  'authenticated', 'authenticated',
  'maracaibo@demo.local',
  crypt('demo1234', gen_salt('bf')),
  now(), '{"provider":"email","providers":["email"]}', '{}',
  now(), now(), '', '', '', ''
),
(
  '00000000-0000-0000-0000-000000000000',
  'a5555555-5555-5555-5555-555555555555',
  'authenticated', 'authenticated',
  'guayana@demo.local',
  crypt('demo1234', gen_salt('bf')),
  now(), '{"provider":"email","providers":["email"]}', '{}',
  now(), now(), '', '', '', ''
),
(
  '00000000-0000-0000-0000-000000000000',
  'a6666666-6666-6666-6666-666666666666',
  'authenticated', 'authenticated',
  'barquisimeto@demo.local',
  crypt('demo1234', gen_salt('bf')),
  now(), '{"provider":"email","providers":["email"]}', '{}',
  now(), now(), '', '', '', ''
);

insert into auth.identities (
  id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
) values
(
  'a1111111-1111-1111-1111-111111111111',
  'a1111111-1111-1111-1111-111111111111',
  format('{"sub":"%s","email":"valencia@demo.local"}', 'a1111111-1111-1111-1111-111111111111')::jsonb,
  'email', 'a1111111-1111-1111-1111-111111111111', now(), now(), now()
),
(
  'a2222222-2222-2222-2222-222222222222',
  'a2222222-2222-2222-2222-222222222222',
  format('{"sub":"%s","email":"cagua@demo.local"}', 'a2222222-2222-2222-2222-222222222222')::jsonb,
  'email', 'a2222222-2222-2222-2222-222222222222', now(), now(), now()
),
(
  'a3333333-3333-3333-3333-333333333333',
  'a3333333-3333-3333-3333-333333333333',
  format('{"sub":"%s","email":"caracas@demo.local"}', 'a3333333-3333-3333-3333-333333333333')::jsonb,
  'email', 'a3333333-3333-3333-3333-333333333333', now(), now(), now()
),
(
  'a4444444-4444-4444-4444-444444444444',
  'a4444444-4444-4444-4444-444444444444',
  format('{"sub":"%s","email":"maracaibo@demo.local"}', 'a4444444-4444-4444-4444-444444444444')::jsonb,
  'email', 'a4444444-4444-4444-4444-444444444444', now(), now(), now()
),
(
  'a5555555-5555-5555-5555-555555555555',
  'a5555555-5555-5555-5555-555555555555',
  format('{"sub":"%s","email":"guayana@demo.local"}', 'a5555555-5555-5555-5555-555555555555')::jsonb,
  'email', 'a5555555-5555-5555-5555-555555555555', now(), now(), now()
),
(
  'a6666666-6666-6666-6666-666666666666',
  'a6666666-6666-6666-6666-666666666666',
  format('{"sub":"%s","email":"barquisimeto@demo.local"}', 'a6666666-6666-6666-6666-666666666666')::jsonb,
  'email', 'a6666666-6666-6666-6666-666666666666', now(), now(), now()
);

insert into public.dealers (id, business_name, phone, address, state, city) values
('a1111111-1111-1111-1111-111111111111', 'Rodamientos El Centro', '0412-5550101', 'Calle Constitucion, Local 12, Valencia', 'Carabobo', 'Valencia'),
('a2222222-2222-2222-2222-222222222222', 'MRO Cagua Industrial', '0414-5550202', 'Av. Principal, Galpón 3, Cagua', 'Aragua', 'Cagua'),
('a3333333-3333-3333-3333-333333333333', 'Repuestos La Candelaria', '0424-5550303', 'Esquina Candilito, Local 5, Caracas', 'Distrito Capital', 'Caracas'),
('a4444444-4444-4444-4444-444444444444', 'Rodajes del Lago', '0416-5550404', 'Av. 5 de Julio, Sector Tierra Negra, Maracaibo', 'Zulia', 'Maracaibo'),
('a5555555-5555-5555-5555-555555555555', 'Industrial Guayana', '0426-5550505', 'Zona Industrial Unare, Puerto Ordaz', 'Bolívar', 'Puerto Ordaz'),
('a6666666-6666-6666-6666-666666666666', 'Técnica Centro Occidente', '0412-5550606', 'Carrera 19 con Calle 25, Barquisimeto', 'Lara', 'Barquisimeto');

insert into public.listings (dealer_id, part_number, name, brand, model, observation) values
('a1111111-1111-1111-1111-111111111111', '6205-2RS', 'Rodamiento rígido de bolas', 'SKF', '25x52x15', 'Nuevo'),
('a1111111-1111-1111-1111-111111111111', '6205-ZZ', 'Rodamiento rígido de bolas ZZ', 'NSK', '25x52x15', 'Nuevo'),
('a1111111-1111-1111-1111-111111111111', '6204-2RS', 'Rodamiento rígido de bolas', 'NTN', '20x47x14', 'Nuevo'),
('a1111111-1111-1111-1111-111111111111', '6305-2RS', 'Rodamiento rígido de bolas', 'FAG', '25x62x17', 'Nuevo'),
('a1111111-1111-1111-1111-111111111111', '30205', 'Rodillos cónicos', 'Timken', '25x52x16.25', 'Nuevo'),
('a1111111-1111-1111-1111-111111111111', 'UC205', 'Insert / chumacera', 'Genérico', '25 mm', 'Nuevo'),
('a2222222-2222-2222-2222-222222222222', '6205-2RS', 'Rodamiento rígido de bolas', 'SKF', '25x52x15', 'Nuevo'),
('a2222222-2222-2222-2222-222222222222', '6205-2RS', 'Rodamiento rígido de bolas', 'Genérico', '25x52x15', 'Usado en perfectas condiciones'),
('a2222222-2222-2222-2222-222222222222', '6206-2RS', 'Rodamiento rígido de bolas', 'FAG', '30x62x16', 'Nuevo'),
('a2222222-2222-2222-2222-222222222222', '6008-ZZ', 'Rodamiento rígido de bolas ZZ', 'FAG', '40x68x15', 'Nuevo'),
('a2222222-2222-2222-2222-222222222222', '7205-BEP', 'Contacto angular', 'SKF', '25x52x15', 'Nuevo'),
('a3333333-3333-3333-3333-333333333333', '6205-2RS', 'Rodamiento rígido de bolas', 'NTN', '25x52x15', 'Nuevo'),
('a3333333-3333-3333-3333-333333333333', '6203-2RS', 'Rodamiento rígido de bolas', 'SKF', '17x40x12', 'Nuevo'),
('a3333333-3333-3333-3333-333333333333', '6210-2RS', 'Rodamiento rígido de bolas', 'NSK', '50x90x20', 'Nuevo'),
('a3333333-3333-3333-3333-333333333333', '30305', 'Rodillos cónicos', 'SKF', '25x62x18.25', 'Nuevo'),
('a3333333-3333-3333-3333-333333333333', 'UC206', 'Insert / chumacera', 'Genérico', '30 mm', 'Nuevo'),
('a4444444-4444-4444-4444-444444444444', '6205-ZZ', 'Rodamiento rígido de bolas ZZ', 'SKF', '25x52x15', 'Nuevo'),
('a4444444-4444-4444-4444-444444444444', '6308-2RS', 'Rodamiento rígido de bolas', 'SKF', '40x90x23', 'Nuevo'),
('a4444444-4444-4444-4444-444444444444', '6208-2RS', 'Rodamiento rígido de bolas', 'SKF', '40x80x18', 'Nuevo'),
('a4444444-4444-4444-4444-444444444444', '32205', 'Rodillos cónicos', 'NSK', '25x52x19.25', 'Nuevo'),
('a5555555-5555-5555-5555-555555555555', '6205-2RS', 'Rodamiento rígido de bolas', 'FAG', '25x52x15', 'Nuevo'),
('a5555555-5555-5555-5555-555555555555', '6306-2RS', 'Rodamiento rígido de bolas', 'FAG', '30x72x19', 'Nuevo'),
('a5555555-5555-5555-5555-555555555555', '6310-2RS', 'Rodamiento rígido de bolas', 'FAG', '50x110x27', 'Nuevo'),
('a5555555-5555-5555-5555-555555555555', 'UC208', 'Insert / chumacera', 'NSK', '40 mm', 'Nuevo'),
('a6666666-6666-6666-6666-666666666666', '6205-2RS', 'Rodamiento rígido de bolas', 'SKF', '25x52x15', 'Usado en perfectas condiciones'),
('a6666666-6666-6666-6666-666666666666', '6204-2RS', 'Rodamiento rígido de bolas', 'NTN', '20x47x14', 'Nuevo'),
('a6666666-6666-6666-6666-666666666666', '6004-2RS', 'Rodamiento rígido de bolas', 'SKF', '20x42x12', 'Nuevo'),
('a6666666-6666-6666-6666-666666666666', '30206-J2/Q', 'Rodillos cónicos', 'Timken', '30x62x17.25', 'Nuevo');
