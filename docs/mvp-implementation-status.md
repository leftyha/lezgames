# Estado de implementación MVP vs master plan

Este documento aterriza el master plan contra el estado real del código. Usa tres estados:

- `[x]` implementado y conectado.
- `[~]` scaffold, mock, placeholder o contrato existente, pero todavía no productivo.
- `[ ]` pendiente real.

## Resumen ejecutivo

El repo ya no es solo una maqueta estática: ahora tiene un flujo vertical demo para `play -> launch session -> iframe -> SDK postMessage -> score submit -> reward -> wallet -> leaderboard`.

Este corte también rebrandea la experiencia visible a **WagonBug Arcade**, con paleta morado/lima/cyan, copy público actualizado y assets SVG base para logo/mark.

Aun así, sigue siendo una implementación MVP. No debe considerarse lista para producción hasta completar anti-cheat fuerte, ads reales, analytics persistente, QA mobile final, admin completo y operación productiva.

## Comparación por bloque

| Bloque | Estado | Implementado ahora | Pendiente para producción |
| --- | --- | --- | --- |
| Plataforma navegable | `[x]` | Home, catálogo, detalle, play, store, wallet, inventory, leaderboards, legal, admin mínimo. | Mejorar contenido final, UX y QA mobile real. |
| Branding WagonBug | `[~]` | Nombre visible, copy, paleta global, Bug Coins y assets SVG base. | Renombrar scopes técnicos si se decide, revisar dominios, favicon/OG finales y guía de marca. |
| Catálogo | `[x]` | 10 live + 4 beta/coming soon con SEO, rewards, ads, store compatibility y `gameUrl`. | Admin para editar catálogo sin deploy. |
| Game Shell | `[~]` | Crea launch session, valida adblock básico, carga iframe después de Play, manda contexto SDK, escucha eventos y muestra post-game validado. | Fullscreen real refinado, manejo avanzado de errores de build, ads reales, controles finales por juego. |
| Demo game builds | `[~]` | Ruta same-origin `/games-builds/:slug/index.html` para probar integración sin bundles reales. | Subir builds reales por juego y assets hasheados/CDN. |
| Game SDK | `[~]` | Contrato de eventos + helpers `postMessage` y espera de launch context. | SDK versionado, documentación por engine, handshake más estricto y validación real con backend. |
| API | `[~]` | Endpoints MVP para health, modules, launch-sessions, scores, leaderboards, wallet, store, inventory, rewards, ads y analytics. | Completar operación productiva, reconciliación de reporting, rate limit y tests finales. |
| Wallet | `[~]` | Balance server-side desde ledger; rewards y compras agregan transacciones; visible como Bug Coins (`BC`). | Auditoría productiva, reversals completos y políticas de abuso. |
| Store | `[~]` | Items desde API y compra MVP que valida balance/compatibilidad y crea inventario. | `purchases`, idempotencia, admin store y pagos internos sin cash-out si aplica. |
| Inventory | `[~]` | Página lee owned items desde API. | Equip/unequip real, reglas por juego y entrega estricta al SDK. |
| Leaderboards | `[~]` | Página lee scores validados de API MVP. | Rankings daily/weekly/all-time persistentes con anti-cheat fuerte. |
| Analytics | `[~]` | Intake de eventos. | Persistencia, dashboard, métricas por juego/país/dispositivo y revenue events. |
| Admin | `[ ]` | Página placeholder y algunos endpoints protegidos. | Auth/permisos finales, dashboard, CRUD de juegos/store/quests/ads. |
| Legal/cookies | `[~]` | Páginas y disclaimers existen. | Cookie banner real, consentimiento por región y revisión legal. |
| Seguridad/anti-copia | `[~]` | CSP básico, launch sessions MVP, checksum básico de score. | Signed tokens, WAF/CDN, rate limit, anti-hotlink, no source maps, anti-cheat avanzado. |

## Flujo vertical validable

1. Entrar a `/play/golden-rain-zombies`.
2. Pulsar `Play`.
3. El shell hace detección básica de adblock.
4. El shell llama `POST /api/v1/launch-sessions`.
5. El iframe carga `/games-builds/golden-rain-zombies/index.html`.
6. El demo build emite `ready` y recibe launch context por `postMessage`.
7. El demo build emite `game_start` y `game_over`.
8. El shell calcula checksum y llama `POST /api/v1/scores`.
9. La API valida sesión/checksum/rango, calcula Bug Coins, agrega wallet transaction y actualiza leaderboard.
10. Wallet y leaderboard muestran los cambios mientras la API esté disponible.

## Próximo corte técnico recomendado

### Corte 1: cierre de rebrand productivo

- Añadir favicon/OG finales y archivos PNG/WebP derivados del logo.
- Decidir si se renombra el scope técnico `@lezgamez/*` y el salt `lezgamez-mvp` o si se mantienen por compatibilidad.
- Revisar todos los textos legales y de cookies para WagonBug Arcade.

### Corte 2: shell productivo

- Manejar timeout de iframe y error de build con estados finales.
- Implementar fullscreen real y overlay de pausa pulido.
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
