# NovaForge NEX — Fase A (demo cliente)

Demo mínima para el perfil **repuestero**: **Buscar** + **Mi stock**.

> Pon el código. Si está, te dice cuántos y dónde.

La maqueta de ecosistema completa (Industria, Catálogo, Planta, Cuenta, etc.) quedó archivada en **`/portfolio/`**.

## Demo local

1. Instala [Node.js LTS](https://nodejs.org)
2. `npm install`
3. `npm start` (sirve `dist/`) o doble clic en `Iniciar_Demo.bat` (build + servir)
4. Abre http://localhost:3000
5. Contraseña de acceso (solicitar al autor del repo; no se publica en la pantalla de login)

Portafolio UI/UX completo: http://localhost:3000/portfolio/

## Desarrollo

```bash
npm run dev      # Vite hot reload
npm run build    # genera dist/ + copia portfolio-demo → dist/portfolio
```

## Qué incluye Fase A

| Pantalla | Función |
|----------|---------|
| **Buscar** | Código, medida `25x52x15` o marca → cantidad + ubicación |
| **Mi stock** | Tabla, editar cantidad, importar CSV, plantilla, restaurar seed |

Sin backend: inventario en `localStorage`. Seed de rodamientos demo incluido.

## Protecciones

- Gate por contraseña (sessionStorage)
- `robots.txt` → `Disallow: /`
- Meta / header `noindex, nofollow`

## Aviso

Datos ficticios. No incluye inventario de ninguna empresa real.
