# BuscaRepuesto — demo multi-local

Directorio tipo Víctor: el cliente busca un código y ve **dónde lo venden** (estado, dirección, teléfono). El repuestero se registra gratis y carga su lista. Sin precios en pantalla.

> Busca la pieza. Llama al local. El precio lo cuadran ustedes.

## Demo local

1. Instala [Node.js LTS](https://nodejs.org)
2. `npm install`
3. `npm start` o `Iniciar_Demo.bat`
4. http://localhost:3000 — contraseña de acceso: pedir al autor del repo

Portafolio UI antiguo (solo URL): http://localhost:3000/portfolio/

## Qué incluye

| Pantalla | Función |
|----------|---------|
| **Buscar** | Código / medida + filtro por estado → cuadrícula de locales (teléfono, dirección). Sin precio. |
| **Soy repuestero** | Registro gratis, editar local, subir CSV (`codigo,nombre,marca,modelo,observacion`) |

Seed: 6 locales demo en Carabobo, Aragua, Caracas, Zulia, Bolívar, Lara. Prueba `6205`. Login seed: `0412-5550101` / PIN `1234`.

Datos en `localStorage` (demo sin backend). Siguiente paso real: base de datos en la nube.

## Desarrollo

```bash
npm run dev
npm run build
```
