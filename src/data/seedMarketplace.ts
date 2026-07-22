import type { Dealer } from "../lib/types";

/**
 * Varios locales demo en distintos estados.
 * Varios comparten códigos (p. ej. 6205) para que la búsqueda muestre “dónde lo venden”.
 */
export const SEED_DEALERS: Dealer[] = [
  {
    id: "d-valencia",
    businessName: "Rodamientos El Centro",
    phone: "0412-5550101",
    address: "Calle Constitucion, Local 12, Valencia",
    state: "Carabobo",
    city: "Valencia",
    pin: "1234",
    listings: [
      { part_number: "6205-2RS", name: "Rodamiento rígido de bolas", brand: "SKF", model: "25x52x15", observation: "Nuevo" },
      { part_number: "6205-ZZ", name: "Rodamiento rígido de bolas ZZ", brand: "NSK", model: "25x52x15", observation: "Nuevo" },
      { part_number: "6204-2RS", name: "Rodamiento rígido de bolas", brand: "NTN", model: "20x47x14", observation: "Nuevo" },
      { part_number: "6305-2RS", name: "Rodamiento rígido de bolas", brand: "FAG", model: "25x62x17", observation: "Nuevo" },
      { part_number: "30205", name: "Rodillos cónicos", brand: "Timken", model: "25x52x16.25", observation: "Nuevo" },
      { part_number: "UC205", name: "Insert / chumacera", brand: "Genérico", model: "25 mm", observation: "Nuevo" },
    ],
  },
  {
    id: "d-cagua",
    businessName: "MRO Cagua Industrial",
    phone: "0414-5550202",
    address: "Av. Principal, Galpón 3, Cagua",
    state: "Aragua",
    city: "Cagua",
    pin: "1234",
    listings: [
      { part_number: "6205-2RS", name: "Rodamiento rígido de bolas", brand: "SKF", model: "25x52x15", observation: "Nuevo" },
      { part_number: "6205-2RS", name: "Rodamiento rígido de bolas", brand: "Genérico", model: "25x52x15", observation: "Usado en perfectas condiciones" },
      { part_number: "6206-2RS", name: "Rodamiento rígido de bolas", brand: "FAG", model: "30x62x16", observation: "Nuevo" },
      { part_number: "6008-ZZ", name: "Rodamiento rígido de bolas ZZ", brand: "FAG", model: "40x68x15", observation: "Nuevo" },
      { part_number: "7205-BEP", name: "Contacto angular", brand: "SKF", model: "25x52x15", observation: "Nuevo" },
    ],
  },
  {
    id: "d-caracas",
    businessName: "Repuestos La Candelaria",
    phone: "0424-5550303",
    address: "Esquina Candilito, Local 5, Caracas",
    state: "Distrito Capital",
    city: "Caracas",
    pin: "1234",
    listings: [
      { part_number: "6205-2RS", name: "Rodamiento rígido de bolas", brand: "NTN", model: "25x52x15", observation: "Nuevo" },
      { part_number: "6203-2RS", name: "Rodamiento rígido de bolas", brand: "SKF", model: "17x40x12", observation: "Nuevo" },
      { part_number: "6210-2RS", name: "Rodamiento rígido de bolas", brand: "NSK", model: "50x90x20", observation: "Nuevo" },
      { part_number: "30305", name: "Rodillos cónicos", brand: "SKF", model: "25x62x18.25", observation: "Nuevo" },
      { part_number: "UC206", name: "Insert / chumacera", brand: "Genérico", model: "30 mm", observation: "Nuevo" },
    ],
  },
  {
    id: "d-maracaibo",
    businessName: "Rodajes del Lago",
    phone: "0416-5550404",
    address: "Av. 5 de Julio, Sector Tierra Negra, Maracaibo",
    state: "Zulia",
    city: "Maracaibo",
    pin: "1234",
    listings: [
      { part_number: "6205-ZZ", name: "Rodamiento rígido de bolas ZZ", brand: "SKF", model: "25x52x15", observation: "Nuevo" },
      { part_number: "6308-2RS", name: "Rodamiento rígido de bolas", brand: "SKF", model: "40x90x23", observation: "Nuevo" },
      { part_number: "6208-2RS", name: "Rodamiento rígido de bolas", brand: "SKF", model: "40x80x18", observation: "Nuevo" },
      { part_number: "32205", name: "Rodillos cónicos", brand: "NSK", model: "25x52x19.25", observation: "Nuevo" },
    ],
  },
  {
    id: "d-po",
    businessName: "Industrial Guayana",
    phone: "0426-5550505",
    address: "Zona Industrial Unare, Puerto Ordaz",
    state: "Bolívar",
    city: "Puerto Ordaz",
    pin: "1234",
    listings: [
      { part_number: "6205-2RS", name: "Rodamiento rígido de bolas", brand: "FAG", model: "25x52x15", observation: "Nuevo" },
      { part_number: "6306-2RS", name: "Rodamiento rígido de bolas", brand: "FAG", model: "30x72x19", observation: "Nuevo" },
      { part_number: "6310-2RS", name: "Rodamiento rígido de bolas", brand: "FAG", model: "50x110x27", observation: "Nuevo" },
      { part_number: "UC208", name: "Insert / chumacera", brand: "NSK", model: "40 mm", observation: "Nuevo" },
    ],
  },
  {
    id: "d-barquisimeto",
    businessName: "Técnica Centro Occidente",
    phone: "0412-5550606",
    address: "Carrera 19 con Calle 25, Barquisimeto",
    state: "Lara",
    city: "Barquisimeto",
    pin: "1234",
    listings: [
      { part_number: "6205-2RS", name: "Rodamiento rígido de bolas", brand: "SKF", model: "25x52x15", observation: "Usado en perfectas condiciones" },
      { part_number: "6204-2RS", name: "Rodamiento rígido de bolas", brand: "NTN", model: "20x47x14", observation: "Nuevo" },
      { part_number: "6004-2RS", name: "Rodamiento rígido de bolas", brand: "SKF", model: "20x42x12", observation: "Nuevo" },
      { part_number: "30206-J2/Q", name: "Rodillos cónicos", brand: "Timken", model: "30x62x17.25", observation: "Nuevo" },
    ],
  },
];
