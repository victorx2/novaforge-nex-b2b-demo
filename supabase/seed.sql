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

-- Tras 002: id propio + user_id apunta al auth user demo
insert into public.dealers (id, user_id, business_name, phone, address, state, city) values
('a1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Auto Partes El Centro', '0412-5550101', 'Calle Constitucion, Local 12, Valencia', 'Carabobo', 'Valencia'),
('a2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'Repuestos Cagua Express', '0414-5550202', 'Av. Principal, Galpón 3, Cagua', 'Aragua', 'Cagua'),
('a3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 'Automotriz La Candelaria', '0424-5550303', 'Esquina Candilito, Local 5, Caracas', 'Distrito Capital', 'Caracas'),
('a4444444-4444-4444-4444-444444444444', 'a4444444-4444-4444-4444-444444444444', 'Repuestos del Lago', '0416-5550404', 'Av. 5 de Julio, Sector Tierra Negra, Maracaibo', 'Zulia', 'Maracaibo'),
('a5555555-5555-5555-5555-555555555555', 'a5555555-5555-5555-5555-555555555555', 'Auto Guayana', '0426-5550505', 'Zona Industrial Unare, Puerto Ordaz', 'Bolívar', 'Puerto Ordaz'),
('a6666666-6666-6666-6666-666666666666', 'a6666666-6666-6666-6666-666666666666', 'Técnica Centro Occidente Auto', '0412-5550606', 'Carrera 19 con Calle 25, Barquisimeto', 'Lara', 'Barquisimeto');

insert into public.listings (dealer_id, part_number, name, brand, model, observation) values
('a1111111-1111-1111-1111-111111111111', 'FILTRO-ACEITE-WIX51515', 'Filtro de aceite', 'WIX', 'Sedan 1.6', 'Nuevo'),
('a1111111-1111-1111-1111-111111111111', 'PASTILLA-FREN-D1060', 'Pastillas de freno delanteras', 'Bendix', 'Compacto', 'Nuevo'),
('a1111111-1111-1111-1111-111111111111', 'BUJIA-NGK-BKR6E', 'Bujía iridium', 'NGK', '4 cil', 'Nuevo'),
('a1111111-1111-1111-1111-111111111111', 'CORREA-GATES-K060840', 'Correa serpentina', 'Gates', 'Universal', 'Nuevo'),
('a1111111-1111-1111-1111-111111111111', 'AMORT-KYB-334302', 'Amortiguador delantero', 'KYB', 'SUV', 'Nuevo'),
('a1111111-1111-1111-1111-111111111111', 'FILTRO-AIRE-CA10170', 'Filtro de aire', 'Fram', 'Sedan', 'Nuevo'),
('a2222222-2222-2222-2222-222222222222', 'FILTRO-ACEITE-WIX51515', 'Filtro de aceite', 'WIX', 'Sedan 1.6', 'Nuevo'),
('a2222222-2222-2222-2222-222222222222', 'BUJIA-NGK-BKR6E', 'Bujía', 'NGK', '4 cil', 'Usado en perfectas condiciones'),
('a2222222-2222-2222-2222-222222222222', 'PASTILLA-FREN-D1060', 'Pastillas de freno', 'Akebono', 'Compacto', 'Nuevo'),
('a2222222-2222-2222-2222-222222222222', 'BOMBA-AGUA-GMB-125', 'Bomba de agua', 'GMB', '1.8L', 'Nuevo'),
('a2222222-2222-2222-2222-222222222222', 'RADIADOR-DPI-13069', 'Radiador aluminio', 'DPI', 'Sedan', 'Nuevo'),
('a3333333-3333-3333-3333-333333333333', 'FILTRO-ACEITE-WIX51515', 'Filtro de aceite', 'Mann', 'Sedan 1.6', 'Nuevo'),
('a3333333-3333-3333-3333-333333333333', 'BUJIA-DENSO-IK20', 'Bujía iridium', 'Denso', '4 cil', 'Nuevo'),
('a3333333-3333-3333-3333-333333333333', 'DISCO-FREN-31267', 'Disco de freno', 'Raybestos', 'Delantero', 'Nuevo'),
('a3333333-3333-3333-3333-333333333333', 'CORREA-GATES-K060840', 'Correa serpentina', 'Gates', 'Universal', 'Nuevo'),
('a3333333-3333-3333-3333-333333333333', 'SENSOR-O2-234-4622', 'Sensor de oxígeno', 'Bosch', 'Downstream', 'Nuevo'),
('a4444444-4444-4444-4444-444444444444', 'PASTILLA-FREN-D1060', 'Pastillas de freno', 'Bendix', 'Compacto', 'Nuevo'),
('a4444444-4444-4444-4444-444444444444', 'AMORT-MONROE-71341', 'Amortiguador trasero', 'Monroe', 'Pickup', 'Nuevo'),
('a4444444-4444-4444-4444-444444444444', 'FILTRO-CABINA-CF10134', 'Filtro de cabina', 'Fram', 'Universal', 'Nuevo'),
('a4444444-4444-4444-4444-444444444444', 'TERMOSTATO-1601-190', 'Termostato', 'Stant', '82C', 'Nuevo'),
('a5555555-5555-5555-5555-555555555555', 'FILTRO-ACEITE-WIX51515', 'Filtro de aceite', 'WIX', 'Diesel', 'Nuevo'),
('a5555555-5555-5555-5555-555555555555', 'BUJIA-NGK-BKR6E', 'Bujía', 'NGK', '4 cil', 'Nuevo'),
('a5555555-5555-5555-5555-555555555555', 'BOMBA-COMB-E8495M', 'Bomba de combustible', 'Delphi', 'Inyección', 'Nuevo'),
('a5555555-5555-5555-5555-555555555555', 'KIT-CLUTCH-LUK-623', 'Kit de clutch', 'LuK', 'Manual', 'Nuevo'),
('a6666666-6666-6666-6666-666666666666', 'FILTRO-ACEITE-WIX51515', 'Filtro de aceite', 'WIX', 'Sedan 1.6', 'Usado en perfectas condiciones'),
('a6666666-6666-6666-6666-666666666666', 'PASTILLA-FREN-D1060', 'Pastillas de freno', 'Bendix', 'Compacto', 'Nuevo'),
('a6666666-6666-6666-6666-666666666666', 'BUJIA-NGK-BKR6E', 'Bujía', 'NGK', '4 cil', 'Nuevo'),
('a6666666-6666-6666-6666-666666666666', 'CORREA-GATES-K060840', 'Correa serpentina', 'Gates', 'Universal', 'Nuevo');
