# LEZGAMEZ

Monorepo base para la plataforma LEZGAMEZ: web en Next.js, API en NestJS, catálogo compartido, tokens/componentes UI y contrato de Game SDK.

## Requisitos previos

Antes de iniciar los servidores, instala o confirma estas herramientas:

1. **Node.js 22 o superior**.
   ```bash
   node --version
   ```
2. **pnpm 9.15.0**. El repo declara esta versión en `packageManager`.
   ```bash
   corepack enable
   corepack prepare pnpm@9.15.0 --activate
   pnpm --version
   ```
3. **Terminal ubicada en la raíz del repo**.
   ```bash
   cd /workspace/lezgames
   ```

## Estructura rápida del proyecto

- `apps/web`: aplicación web de Next.js.
- `apps/api`: API de NestJS.
- `packages/catalog`: datos y modelos compartidos del catálogo de juegos.
- `packages/ui`: tokens visuales y componentes compartidos.
- `packages/sdk`: contrato compartido del Game SDK.

## Tutorial paso a paso para iniciar los servidores

### Paso 1: Instalar dependencias

Desde la raíz del monorepo ejecuta:

```bash
pnpm install
```

> Si ya existe `node_modules`, este comando igual valida que las dependencias del workspace estén completas.

### Paso 2: Iniciar todos los servidores en modo desarrollo

Ejecuta el comando principal del monorepo:

```bash
pnpm dev
```

Este comando usa Turborepo y levanta las apps que tienen script `dev`:

- Web: `apps/web`, con `next dev`.
- API: `apps/api`, con `nest start --watch`.

### Paso 3: Abrir la aplicación web

Cuando Next.js termine de compilar, abre en el navegador:

```text
http://localhost:3000
```

Rutas útiles de la web:

- `http://localhost:3000/`: home de LEZGAMEZ.
- `http://localhost:3000/games`: catálogo de juegos.
- `http://localhost:3000/play/golden-rain-zombies`: shell de juego de ejemplo.

### Paso 4: Probar la API

La API escucha por defecto en el puerto `4000` y usa el prefijo global `/api`.

Prueba el health check:

```bash
curl http://localhost:4000/api/v1/health
```

Respuesta esperada:

```json
{"ok":true,"service":"lezgamez-api"}
```

Endpoints útiles para desarrollo:

```bash
curl http://localhost:4000/api/v1/modules
curl http://localhost:4000/api/v1/wallet/demo-user
curl http://localhost:4000/api/v1/wallet/demo-user/transactions
curl http://localhost:4000/api/v1/store/items
curl http://localhost:4000/api/v1/inventory/demo-user
curl http://localhost:4000/api/v1/rewards/caps
```

### Paso 5: Cambiar el puerto de la API si hace falta

Si el puerto `4000` está ocupado, inicia la API con otro puerto:

```bash
PORT=4001 pnpm --filter @lezgamez/api dev
```

Luego prueba:

```bash
curl http://localhost:4001/api/v1/health
```

### Paso 6: Iniciar solo un servidor específico

Si no quieres levantar todo el monorepo, puedes ejecutar cada app por separado.

Solo web:

```bash
pnpm --filter @lezgamez/web dev
```

Solo API:

```bash
pnpm --filter @lezgamez/api dev
```

## Comandos frecuentes

- `pnpm dev`: inicia web y API en modo desarrollo usando Turborepo.
- `pnpm build`: compila todo el monorepo.
- `pnpm lint`: ejecuta los checks de lint configurados por workspace.
- `pnpm typecheck`: valida TypeScript en todos los workspaces.
- `pnpm --filter @lezgamez/web build`: compila solo la web.
- `pnpm --filter @lezgamez/api build`: compila solo la API.

## Solución de problemas

### `pnpm: command not found`

Activa Corepack e instala la versión esperada:

```bash
corepack enable
corepack prepare pnpm@9.15.0 --activate
```

### Puerto ocupado

- Web: Next.js usa `3000` por defecto; si está ocupado, Next suele ofrecer otro puerto automáticamente.
- API: usa la variable `PORT`.

```bash
PORT=4001 pnpm --filter @lezgamez/api dev
```

### Dependencias desactualizadas o errores raros de workspace

Reinstala desde la raíz:

```bash
pnpm install
```

Después valida el proyecto:

```bash
pnpm typecheck
pnpm build
```

## MVP scope cubierto

- Rutas SEO, páginas de detalle de juegos y shell `/play/:slug`.
- Sistema visual premium oscuro usando tokens maestros.
- Catálogo con 10 juegos live y 4 entradas beta/coming soon.
- Disclaimers de wallet/store: Lez Coins son créditos internos únicamente.
- Scaffold de API con contratos obligatorios de módulos.
