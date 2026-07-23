-- Actualiza datos demo a nicho automotriz (sin rodamientos).
-- Ejecutar en SQL Editor si la BD ya tenía el seed viejo.

update public.dealers set business_name = 'Auto Partes El Centro'
  where id = 'a1111111-1111-1111-1111-111111111111';
update public.dealers set business_name = 'Repuestos Cagua Express'
  where id = 'a2222222-2222-2222-2222-222222222222';
update public.dealers set business_name = 'Automotriz La Candelaria'
  where id = 'a3333333-3333-3333-3333-333333333333';
update public.dealers set business_name = 'Repuestos del Lago'
  where id = 'a4444444-4444-4444-4444-444444444444';
update public.dealers set business_name = 'Auto Guayana'
  where id = 'a5555555-5555-5555-5555-555555555555';
update public.dealers set business_name = 'Técnica Centro Occidente Auto'
  where id = 'a6666666-6666-6666-6666-666666666666';

delete from public.listings where dealer_id in (
  'a1111111-1111-1111-1111-111111111111',
  'a2222222-2222-2222-2222-222222222222',
  'a3333333-3333-3333-3333-333333333333',
  'a4444444-4444-4444-4444-444444444444',
  'a5555555-5555-5555-5555-555555555555',
  'a6666666-6666-6666-6666-666666666666'
);

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
