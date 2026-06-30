# Estado de implementación MVP vs master plan

Este documento aterriza el master plan contra el estado real del código. Usa tres estados:

- `[x]` implementado y conectado.
- `[~]` scaffold, mock, placeholder o contrato existente, pero todavía no productivo.
- `[ ]` pendiente real.

## Resumen ejecutivo

El repo ya no es solo una maqueta estática: ahora tiene un flujo vertical demo para `play -> launch session -> iframe -> SDK postMessage -> score submit -> reward -> wallet -> leaderboard`.

Aun así, sigue siendo una implementación MVP mock/in-memory. No debe considerarse lista para producción hasta agregar persistencia, auth, admin protegido, anti-cheat fuerte, ads reales y analytics persistente.

## Comparación por bloque

| Bloque | Estado | Implementado ahora | Pendiente para producción |
| --- | --- | --- | --- |
| Plataforma navegable | `[x]` | Home, catálogo, detalle, play, store, wallet, inventory, leaderboards, legal, admin mínimo. | Mejorar contenido final, UX y QA mobile real. |
| Catálogo | `[x]` | 10 live + 4 beta/coming soon con SEO, rewards, ads, store compatibility y `gameUrl`. | Admin para editar catálogo sin deploy. |
| Game Shell | `[~]` | Crea launch session, valida adblock básico, carga iframe después de Play, manda contexto SDK, escucha eventos y muestra post-game validado. | Fullscreen real, timeout robusto, manejo de errores de build, ads reales, controles finales por juego. |
| Demo game builds | `[~]` | Ruta same-origin `/games-builds/:slug/index.html` para probar integración sin bundles reales. | Subir builds reales por juego y assets hasheados/CDN. |
| Game SDK | `[~]` | Contrato de eventos + helpers `postMessage` y espera de launch context. | SDK versionado, documentación por engine, handshake más estricto y validación real con backend. |
| API | `[~]` | Endpoints mock para health, modules, launch-sessions, scores, leaderboards, wallet, store, inventory, rewards y analytics. | Separar módulos Nest, agregar DB, Redis, auth, rate limit y tests. |
| Wallet | `[~]` | Balance server-side desde ledger mutable en memoria; rewards y compras agregan transacciones. | Tabla `wallets`, `wallet_transactions`, auditoría real y reversals. |
| Store | `[~]` | Items desde API y compra mock que valida balance/compatibilidad y crea inventario en memoria. | `purchases`, idempotencia, admin store y pagos internos sin cash-out si aplica. |
| Inventory | `[~]` | Página lee owned items desde API. | Equip/unequip real, reglas por juego y entrega estricta al SDK. |
| Leaderboards | `[~]` | Página lee scores validados de API mock. | Rankings daily/weekly/all-time persistentes y anti-cheat. |
| Analytics | `[~]` | Intake de eventos en memoria. | Persistencia, dashboard, métricas por juego/país/dispositivo y revenue events. |
| Admin | `[ ]` | Página placeholder. | Auth, permisos, dashboard, CRUD de juegos/store/quests/ads. |
| Legal/cookies | `[~]` | Páginas y disclaimers existen. | Cookie banner real, consentimiento por región y revisión legal. |
| Seguridad/anti-copia | `[~]` | CSP básico, launch sessions mock, checksum básico de score. | Signed tokens, WAF/CDN, rate limit, anti-hotlink, no source maps, anti-cheat avanzado. |

## Flujo vertical validable

1. Entrar a `/play/golden-rain-zombies`.
2. Pulsar `Play`.
3. El shell hace detección básica de adblock.
4. El shell llama `POST /api/v1/launch-sessions`.
5. El iframe carga `/games-builds/golden-rain-zombies/index.html`.
6. El demo build emite `ready` y recibe launch context por `postMessage`.
7. El demo build emite `game_start` y `game_over`.
8. El shell calcula checksum y llama `POST /api/v1/scores`.
9. La API valida sesión/checksum/rango, calcula coins, agrega wallet transaction y actualiza leaderboard en memoria.
10. Wallet y leaderboard muestran los cambios mientras la API siga viva.

## Próximo corte técnico recomendado

### Corte 1: backend real mínimo

- Crear módulos Nest reales: `GamesModule`, `GameLaunchSessionsModule`, `ScoresModule`, `WalletModule`, `StoreModule`, `InventoryModule`, `AnalyticsModule`.
- Añadir Prisma/PostgreSQL.
- Crear migraciones para `users`, `games`, `game_versions`, `game_launch_sessions`, `scores`, `wallet_transactions`, `store_items`, `inventory_items`, `analytics_events`.
- Mantener seed demo para `demo-user`.

### Corte 2: shell productivo

- Manejar timeout de iframe y error de build.
- Implementar fullscreen real y overlay de pausa.
- Bloquear score submit si no hubo `game_start`.
- Enviar solo `launchSessionId` y token firmado; evitar confiar en datos calculables por cliente.

### Corte 3: primer juego real

- Reemplazar demo build de `golden-rain-zombies` por bundle real.
- Usar helpers de `packages/sdk` dentro del juego.
- Emitir eventos mínimos: `ready`, `game_start`, `level_complete`, `game_over`.
- Pasar QA mobile con partida de 30 segundos a 3 minutos.

## Checks del master plan que deben quedar como `[~]`, no `[x]`

- Game Shell universal completo.
- Adblock gate productivo.
- iframe/canvas final por juego.
- SDK con validación productiva.
- Wallet/store/inventory productivos.
- Leaderboards reales.
- Cookie banner.
- Anti-cheat y anti-copia.

## Criterio para pasar de `[~]` a `[x]`

Un bloque solo debe marcarse `[x]` cuando:

1. Tiene código conectado al flujo real.
2. No depende de datos hardcodeados del frontend.
3. Tiene persistencia o una razón explícita para ser stateless.
4. Se puede probar con comando o ruta clara.
5. Cumple el criterio de aceptación del master plan sin depender de mocks invisibles.
