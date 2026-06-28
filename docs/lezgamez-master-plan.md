# Documento maestro inicial de LEZGAMEZ

**Nombre:** LEZGAMEZ  
**Slogan:** Zombies, eggs, weird and death  
**Promesa:** Juegos arcade raros, instantáneos, sin descarga, con rankings, monedas internas, skins y nuevos juegos de forma constante.

> Regla base de economía: los usuarios **NO ganan dinero real**. Las **Lez Coins** son créditos internos únicamente para skins, cosméticos, efectos, inventario y elementos de la plataforma. No se retiran, no se venden, no se transfieren fuera de LezGamez, no se cambian por dinero real y no representan ganancias reales.

---

## 1. Resumen ejecutivo de LezGamez

**Descripción corta:** LezGamez será una plataforma web mobile-first de juegos HTML5 arcade raros, rápidos y virales, organizada como ecosistema común con Game Shell, Game SDK, wallet interna, tienda, inventario, rankings, quests, anuncios, analytics, SEO y admin.

* [ ] Definir LezGamez como plataforma, no como colección suelta de juegos.
  * Prioridad: MVP
  * Depende de: visión de producto, arquitectura técnica, catálogo de juegos.
  * Criterio de aceptación: todo juego live se lanza desde `/play/:slug`, existe en `/games/:slug` y usa Game SDK.
* [ ] Establecer la regla de no cash-out para Lez Coins en producto, legal, UI y soporte.
  * Prioridad: MVP
  * Depende de: wallet, términos, store.
  * Criterio de aceptación: wallet, tienda, términos y onboarding muestran que las monedas solo sirven dentro de LezGamez.
* [ ] Preparar el lanzamiento inicial con 10 juegos jugables y 4 en beta/coming soon.
  * Prioridad: MVP
  * Depende de: Game Shell, catálogo, QA mobile.
  * Criterio de aceptación: 10 juegos pasan checklist de MVP y 4 tienen páginas SEO con estado beta o coming soon.
* [ ] Definir cadencia editorial de lanzamientos semanales.
  * Prioridad: Post-MVP
  * Depende de: admin, pipeline de juegos, analytics.
  * Criterio de aceptación: existe calendario de 8 semanas con juego, update o evento por semana.

**Notas de riesgo:** Si LezGamez se percibe como casino, crypto o promesa de ganancias, aumenta el riesgo legal, publicitario y de confianza.

---

## 2. Objetivos del MVP

**Descripción corta:** Lanzar una versión navegable, indexable, monetizable y medible, con juegos rápidos que funcionen en móvil.

* [ ] Construir plataforma navegable con Home, catálogo, páginas SEO, play, store, wallet, inventory, leaderboards, quests, legal y admin mínimo.
  * Prioridad: MVP
  * Depende de: Next.js, diseño, rutas.
  * Criterio de aceptación: todas las rutas críticas cargan sin errores 500 y tienen navegación clara.
* [ ] Implementar Game Shell universal con adblock gate antes de iniciar juego.
  * Prioridad: MVP
  * Depende de: AdsModule, detección adblock, catálogo.
  * Criterio de aceptación: con adblock se puede navegar, pero Play queda bloqueado con el mensaje oficial.
* [ ] Integrar rankings básicos y wallet server-prepared.
  * Prioridad: MVP
  * Depende de: ScoresModule, WalletModule, Prisma.
  * Criterio de aceptación: cada game over válido puede registrar score y recompensa calculada por backend o mock server-side.
* [ ] Activar analytics esenciales.
  * Prioridad: MVP
  * Depende de: AnalyticsModule, Game SDK.
  * Criterio de aceptación: se capturan page_view, play_clicked, game_start, game_over, score_submit, coins_earned y ad events.

**Notas de riesgo:** El MVP debe priorizar velocidad, mobile y retención; funcionalidades sociales profundas deben esperar.

---

## 3. Objetivos post-MVP

**Descripción corta:** Mejorar economía interna, ads, anti-cheat, quests, contenido semanal e internacionalización.

* [ ] Completar backend de economía, pagos reales para comprar créditos/cosméticos sin cash-out y anti-cheat avanzado.
  * Prioridad: Post-MVP
  * Depende de: legal, WalletModule, PaymentsModule, AntiCheatModule.
  * Criterio de aceptación: compras, inventario y rewards se validan 100% server-side.
* [ ] Optimizar monetización por red, país, juego y frecuencia.
  * Prioridad: Post-MVP
  * Depende de: AdsModule, analytics de ingresos, admin ads.
  * Criterio de aceptación: dashboard muestra eCPM, fill, revenue y ads/session por juego y país.
* [ ] Añadir más idiomas y localización completa de UI/descripciones.
  * Prioridad: Post-MVP
  * Depende de: sistema i18n, contenido SEO.
  * Criterio de aceptación: inglés, español y portugués tienen metadata, FAQ y How to play localizados.
* [ ] Crear temporadas, skins temáticas y eventos semanales.
  * Prioridad: Post-MVP
  * Depende de: store, quests, admin.
  * Criterio de aceptación: una temporada puede configurarse sin deploy.

---

## 4. Visión de producto

**Descripción corta:** LezGamez debe sentirse como un universo arcade oscuro, extraño y premium donde cada partida es instantánea, compartible y rejugable.

* [ ] Diseñar pilares: rareza, rapidez, brutalismo visual, mobile-first, ranking inmediato y recompensas internas.
  * Prioridad: MVP
  * Depende de: design system, game guidelines.
  * Criterio de aceptación: cada juego se evalúa contra esos pilares antes de entrar al catálogo.
* [ ] Definir duración ideal de partida entre 30 segundos y 3 minutos.
  * Prioridad: MVP
  * Depende de: diseño por juego.
  * Criterio de aceptación: el 80% de sesiones de QA finalizan o reinician dentro del rango objetivo.
* [ ] Establecer que todo juego debe entenderse en menos de 5 segundos.
  * Prioridad: MVP
  * Depende de: tutorial in-game, UI.
  * Criterio de aceptación: test con usuarios nuevos logra primera acción correcta sin explicación externa.
* [ ] Crear matriz de portafolio: zombies, eggs, weird, puzzle, physics, io-like, runner, shooter.
  * Prioridad: MVP
  * Depende de: catálogo.
  * Criterio de aceptación: home muestra diversidad sin romper identidad visual.

---

## 5. Identidad visual y design system

**Descripción corta:** Interfaz oscura, premium, rara, cyber-arcade y brutalista, con un solo neón principal: electric violet. Amber se reserva para monedas, recompensas y tienda.

```css
:root {
  --bg-main: #07080D;
  --bg-deep: #03040A;
  --surface-1: #10121A;
  --surface-2: #161925;
  --surface-3: #1E2230;
  --border-soft: #2A2E3D;
  --border-strong: #3B4054;
  --text-main: #F2F0F7;
  --text-muted: #A5A9BA;
  --text-dim: #6F7485;
  --brand-primary: #B026FF;
  --brand-primary-soft: #8B1ED6;
  --brand-primary-dark: #35104F;
  --accent-warm: #D79A2B;
  --danger: #D94A4A;
  --success: #7CA982;
  --glow-primary: 0 0 22px rgba(176, 38, 255, 0.34);
  --glow-primary-strong: 0 0 34px rgba(176, 38, 255, 0.48);
  --glow-warm: 0 0 16px rgba(215, 154, 43, 0.22);
}
```

* [ ] Crear tokens de color, tipografía, spacing, radius, shadow y motion.
  * Prioridad: MVP
  * Depende de: paleta estricta.
  * Criterio de aceptación: no existen colores fuera de tokens salvo arte interno de juegos.
* [ ] Aplicar proporción visual 85% oscuro, 10% estructura/muted, 4% violet, 1% amber/red/green.
  * Prioridad: MVP
  * Depende de: componentes base.
  * Criterio de aceptación: auditoría UI confirma que violet solo destaca Play, activos, scores importantes e items destacados.
* [ ] Usar Space Grotesk o Rajdhani para display, Inter para body y JetBrains Mono para scores, monedas, timers y ranks.
  * Prioridad: MVP
  * Depende de: carga de fuentes.
  * Criterio de aceptación: componentes de score/ranking/wallet usan mono.
* [ ] Prohibir arcoíris neón, casino, crypto, feria de colores, web infantil y templates baratos.
  * Prioridad: MVP
  * Depende de: revisión UX/UI.
  * Criterio de aceptación: PR visual se bloquea si introduce cyan/lime/multicolor cards o glow excesivo.
* [ ] Diseñar componentes: header, game card, Play button, wallet pill, rank row, quest card, store item, admin table, ad placeholder.
  * Prioridad: MVP
  * Depende de: tokens.
  * Criterio de aceptación: todas las rutas MVP reutilizan componentes del sistema.

**Notas de riesgo:** Los juegos pueden tener arte propio, pero la plataforma nunca debe cambiar de tema por juego.

---

## 6. Arquitectura técnica

**Descripción corta:** Monorepo con plataforma separada de juegos, API central, base de datos relacional, cache y CDN/WAF.

* [ ] Estructurar monorepo con pnpm y Turborepo.
  * Prioridad: MVP
  * Depende de: decisión de stack.
  * Criterio de aceptación: existen apps separadas para web, api y juegos con scripts unificados.
* [ ] Definir frontend plataforma con Next.js, React y TypeScript.
  * Prioridad: MVP
  * Depende de: design system, rutas.
  * Criterio de aceptación: páginas SEO renderizan contenido sin depender de client-side JS.
* [ ] Definir backend/API con NestJS y TypeScript.
  * Prioridad: MVP
  * Depende de: módulos backend.
  * Criterio de aceptación: API expone endpoints versionados para juegos, sesiones, scores, wallet, store, ads, analytics y admin.
* [ ] Usar PostgreSQL con Prisma y Redis para cache, rate limit y sesiones auxiliares.
  * Prioridad: MVP
  * Depende de: esquema DB.
  * Criterio de aceptación: migraciones cubren tablas MVP y Redis protege endpoints sensibles.
* [ ] Usar Cloudflare R2/equivalente para builds/assets de juegos y Cloudflare CDN/WAF.
  * Prioridad: MVP
  * Depende de: pipeline de builds.
  * Criterio de aceptación: juegos se sirven desde CDN con hash y protección anti-hotlink.
* [ ] Elegir engine por juego: Phaser 2D, Matter.js físicas, PixiJS UI/glitch, Three.js solo 3D simple.
  * Prioridad: MVP
  * Depende de: ficha técnica por juego.
  * Criterio de aceptación: cada juego tiene engine justificado en su checklist.

### Módulos backend obligatorios

* [ ] Implementar AuthModule, UsersModule, GamesModule y GameVersionsModule.
  * Prioridad: MVP
  * Depende de: users, sessions, games, game_versions.
  * Criterio de aceptación: usuarios, catálogo y versiones se administran desde API.
* [ ] Implementar GameLaunchSessionsModule, ScoresModule, LeaderboardsModule y AntiCheatModule básico.
  * Prioridad: MVP
  * Depende de: Game SDK, game_launch_sessions, scores.
  * Criterio de aceptación: todo score requiere launchSessionId válido.
* [ ] Implementar WalletModule, InventoryModule, StoreModule y RewardsModule.
  * Prioridad: MVP
  * Depende de: wallets, wallet_transactions, store_items, inventory_items.
  * Criterio de aceptación: wallet e inventario son server-side.
* [ ] Implementar AdsModule, AnalyticsModule y AdminModule.
  * Prioridad: MVP
  * Depende de: ad_events, analytics_events, admin_users.
  * Criterio de aceptación: admin puede ver eventos básicos y configurar ads por juego.
* [ ] Implementar PaymentsModule sin cash-out y con revisión legal antes de producción.
  * Prioridad: Post-MVP
  * Depende de: legal, store, wallet.
  * Criterio de aceptación: pagos compran créditos/cosméticos internos sin retiro ni transferencia externa.

### Tablas/modelos de base de datos

* [ ] Crear users, sessions, admin_users.
  * Prioridad: MVP
  * Depende de: AuthModule.
  * Criterio de aceptación: auth y permisos admin funcionan.
* [ ] Crear games, game_versions, game_launch_sessions.
  * Prioridad: MVP
  * Depende de: GamesModule.
  * Criterio de aceptación: cada lanzamiento de juego queda registrado.
* [ ] Crear scores, leaderboards.
  * Prioridad: MVP
  * Depende de: ScoresModule.
  * Criterio de aceptación: ranking por juego se actualiza con scores válidos.
* [ ] Crear wallets, wallet_transactions, store_items, inventory_items, purchases.
  * Prioridad: MVP
  * Depende de: WalletModule, StoreModule.
  * Criterio de aceptación: toda variación de balance tiene transacción auditada.
* [ ] Crear quests, quest_progress, ad_events, analytics_events, bug_reports.
  * Prioridad: MVP
  * Depende de: Quests, AdsModule, AnalyticsModule.
  * Criterio de aceptación: quests, ads, analytics y bugs son consultables en admin.

---

## 7. Rutas y navegación

**Descripción corta:** Separar rutas SEO indexables de rutas funcionales de juego/plataforma.

* [ ] Implementar rutas SEO: `/`, `/games`, `/games/:slug`, `/weird-games`, `/zombie-games`, `/egg-games`, `/arcade-games`, `/puzzle-games`, `/io-games`, `/physics-games`, `/no-download-games`.
  * Prioridad: MVP
  * Depende de: catálogo, SEO.
  * Criterio de aceptación: cada ruta tiene H1, copy server-rendered, links internos y metadata.
* [ ] Implementar rutas plataforma: `/play/:slug`, `/store`, `/wallet`, `/inventory`, `/leaderboards`, `/profile/:username`, `/daily-challenges`, `/weekly-challenges`.
  * Prioridad: MVP
  * Depende de: Game Shell, store, wallet, leaderboards.
  * Criterio de aceptación: usuario puede jugar, revisar progreso y volver al catálogo desde móvil.
* [ ] Implementar rutas legales y soporte: `/privacy`, `/terms`, `/cookies`, `/contact`, `/support`.
  * Prioridad: MVP
  * Depende de: textos legales.
  * Criterio de aceptación: footer enlaza todas las páginas legales.
* [ ] Implementar `/admin` protegido.
  * Prioridad: MVP
  * Depende de: AdminModule, admin_users.
  * Criterio de aceptación: usuarios no admin no pueden acceder.

---

## 8. SEO y estructura indexable

**Descripción corta:** El contenido indexable vive en páginas SEO reales; jugar ocurre en `/play/:slug`.

* [ ] Crear `/games/:slug` como página SEO real con descripción, How to play, FAQ, imágenes, related games y CTA Play.
  * Prioridad: MVP
  * Depende de: modelo de catálogo.
  * Criterio de aceptación: el HTML inicial contiene contenido principal sin depender de JS cliente.
* [ ] Reservar `/play/:slug` solo para Game Shell, no para posicionamiento principal.
  * Prioridad: MVP
  * Depende de: rutas, Game Shell.
  * Criterio de aceptación: página play tiene canonical hacia `/games/:slug` cuando aplique.
* [ ] Generar sitemap.xml y robots.txt.
  * Prioridad: MVP
  * Depende de: rutas live, status de juegos.
  * Criterio de aceptación: sitemap incluye rutas SEO live y excluye admin.
* [ ] Crear metadata por juego: seoTitle, seoDescription, Open Graph y Twitter/X cards.
  * Prioridad: MVP
  * Depende de: ogImage, catálogo.
  * Criterio de aceptación: cada juego live tiene title único y OG image.
* [ ] Localizar UI y descripciones en inglés, español y portugués manteniendo nombres de juegos en inglés.
  * Prioridad: Post-MVP
  * Depende de: i18n.
  * Criterio de aceptación: un juego mantiene title original y traduce shortDescription/fullDescription/FAQ.
* [ ] Crear categorías SEO con copy único y enlaces a juegos relacionados.
  * Prioridad: MVP
  * Depende de: tags/category.
  * Criterio de aceptación: cada categoría muestra mínimo 4 juegos live/beta/coming soon relevantes.

---

## 9. Sistema de juegos

**Descripción corta:** Catálogo central que define estado, SEO, compatibilidad, rewards, ads y relación con Game Shell.

* [ ] Definir modelo GameCatalog con id, title, slug, status, shortDescription, fullDescription, category, tags, thumbnail, ogImage.
  * Prioridad: MVP
  * Depende de: GamesModule.
  * Criterio de aceptación: cada juego aparece correctamente en home, catálogo y página SEO.
* [ ] Añadir isPlayable, gameUrl, gameType, supportedDevices y controls.
  * Prioridad: MVP
  * Depende de: Game Shell.
  * Criterio de aceptación: Play solo aparece si isPlayable=true y device compatible.
* [ ] Añadir rewardRules, adRules y storeCompatibility.
  * Prioridad: MVP
  * Depende de: Wallet, Store, Ads.
  * Criterio de aceptación: backend calcula monedas y ad breaks según reglas por juego.
* [ ] Añadir releaseDate, seoTitle, seoDescription, faq y relatedGames.
  * Prioridad: MVP
  * Depende de: SEO.
  * Criterio de aceptación: sitemap y páginas SEO se generan desde el catálogo.
* [ ] Crear estado live / beta / coming_soon.
  * Prioridad: MVP
  * Depende de: admin.
  * Criterio de aceptación: admin puede cambiar estado y afectar visibilidad.

---

## 10. Game Shell universal

**Descripción corta:** Contenedor común de ejecución que controla Play, adblock, sesión, SDK, UI post-game, retry y navegación.

* [ ] Crear loader LezGamez con estado loading, error y timeout.
  * Prioridad: MVP
  * Depende de: design system.
  * Criterio de aceptación: usuario ve feedback si el juego tarda o falla.
* [ ] Crear pantalla Play previa que no carga el juego hasta pulsar Play.
  * Prioridad: MVP
  * Depende de: performance, adblock.
  * Criterio de aceptación: assets del juego no se descargan antes de Play.
* [ ] Validar adblock antes de iniciar.
  * Prioridad: MVP
  * Depende de: AdsModule.
  * Criterio de aceptación: si hay adblock, se bloquea Play con: “Adblock detected. LezGamez is free because ads keep the games online. Please disable your adblocker to play.”
* [ ] Soportar iframe sandbox y canvas.
  * Prioridad: MVP
  * Depende de: gameType.
  * Criterio de aceptación: juegos iframe no pueden escapar del shell y juegos canvas reciben contexto SDK.
* [ ] Añadir fullscreen, pause, retry, exit to catalog y mobile layout.
  * Prioridad: MVP
  * Depende de: UI shell.
  * Criterio de aceptación: controles no pisan gameplay ni anuncios.
* [ ] Crear post-game screen con score final, best score, coins earned, leaderboard y recommended next game.
  * Prioridad: MVP
  * Depende de: Scores, Wallet, catálogo.
  * Criterio de aceptación: tras game over se puede reintentar en menos de 2 segundos.

---

## 11. Game SDK

**Descripción corta:** Contrato común entre juegos y plataforma. El juego reporta eventos; backend valida resultados.

* [ ] Implementar eventos/métodos: ready(), startGame(), pauseGame(), resumeGame(), gameOver({ score, reason }), levelComplete({ level, score }).
  * Prioridad: MVP
  * Depende de: Game Shell.
  * Criterio de aceptación: el shell conoce el estado de cada partida.
* [ ] Implementar submitScore({ score, checksum }) y validación server-side.
  * Prioridad: MVP
  * Depende de: ScoresModule, AntiCheatModule.
  * Criterio de aceptación: scores sin launchSessionId o checksum inválido se rechazan.
* [ ] Implementar coinsEarned({ amount, reason }) como solicitud, no decisión final.
  * Prioridad: MVP
  * Depende de: WalletModule, RewardsModule.
  * Criterio de aceptación: backend recalcula y confirma monedas.
* [ ] Implementar requestAdBreak({ reason }) y requestReward({ type }).
  * Prioridad: MVP
  * Depende de: AdsModule, RewardsModule.
  * Criterio de aceptación: ad break solo ocurre en pausas naturales aprobadas.
* [ ] Implementar getInventory(), getEquippedItems() y reportBug().
  * Prioridad: MVP
  * Depende de: InventoryModule, bug_reports.
  * Criterio de aceptación: juegos pueden adaptar cosméticos y reportar errores con session context.
* [ ] Pasar al juego userId, language, deviceType, walletBalance, inventory, equippedItems, adStatus, adblockStatus, sessionToken, launchSessionId y gameConfig.
  * Prioridad: MVP
  * Depende de: GameLaunchSessionsModule.
  * Criterio de aceptación: ningún juego inicia sin launchSessionId válido.

---

## 12. Wallet y monedas internas

**Descripción corta:** Lez Coins son créditos internos sin valor monetario real ni retiro. La wallet es server-side.

* [ ] Mostrar disclaimer permanente: Lez Coins are internal credits only and cannot be withdrawn, sold, transferred or exchanged for real money.
  * Prioridad: MVP
  * Depende de: legal, wallet UI.
  * Criterio de aceptación: disclaimer visible en wallet, store, terms y reward modals.
* [ ] Crear wallet server-side por usuario.
  * Prioridad: MVP
  * Depende de: users, wallets.
  * Criterio de aceptación: balance nunca se calcula desde cliente.
* [ ] Registrar wallet_transactions para rewards, purchases, admin grants y reversals.
  * Prioridad: MVP
  * Depende de: WalletModule.
  * Criterio de aceptación: cada cambio de balance tiene reason, source y audit id.
* [ ] Definir reglas de earning por juego con caps diarios.
  * Prioridad: MVP
  * Depende de: rewardRules.
  * Criterio de aceptación: no se pueden farmear monedas infinitas por retry.

**Notas de riesgo:** Evitar lenguaje como ganar dinero, cash, profit, withdraw o inversión.

---

## 13. Store central e inventario

**Descripción corta:** Tienda de cosméticos, skins y efectos compatibles por juego, conectada con inventario.

* [ ] Crear store con categorías: skins, trails, hit effects, profile badges, frames y seasonal items.
  * Prioridad: MVP
  * Depende de: store_items, design system.
  * Criterio de aceptación: tienda puede filtrar por compatibilidad de juego.
* [ ] Crear inventory con items owned, equipped y compatibility.
  * Prioridad: MVP
  * Depende de: inventory_items.
  * Criterio de aceptación: el jugador equipa un item compatible y el SDK lo entrega al juego.
* [ ] Bloquear compras si balance insuficiente o item incompatible.
  * Prioridad: MVP
  * Depende de: WalletModule, StoreModule.
  * Criterio de aceptación: compra se valida server-side y genera purchase + wallet_transaction.
* [ ] Diseñar items destacados usando amber con glow-warm limitado.
  * Prioridad: MVP
  * Depende de: design system.
  * Criterio de aceptación: la tienda no parece casino ni crypto.

---

## 14. Rankings y progresión

**Descripción corta:** Rankings por juego, globales y temporales para incentivar retry y clips.

* [ ] Crear leaderboard por juego: daily, weekly, all-time.
  * Prioridad: MVP
  * Depende de: scores.
  * Criterio de aceptación: cada game over válido actualiza ranking correspondiente.
* [ ] Mostrar best score personal en post-game y página de juego.
  * Prioridad: MVP
  * Depende de: auth/users, scores.
  * Criterio de aceptación: usuario ve su progreso sin salir del flujo de retry.
* [ ] Añadir progresión de perfil con badges cosméticos.
  * Prioridad: Post-MVP
  * Depende de: inventory, quests.
  * Criterio de aceptación: badges no tienen valor monetario y solo muestran hitos.
* [ ] Aplicar anti-cheat básico por rangos de score posibles, duración y frecuencia.
  * Prioridad: MVP
  * Depende de: AntiCheatModule.
  * Criterio de aceptación: scores imposibles quedan flagged o rechazados.

---

## 15. Daily quests / Weekly quests

**Descripción corta:** Objetivos de juego que aumentan retención y rotación de catálogo sin crear obligación de grinding abusivo.

* [ ] Crear daily quests: jugar 3 partidas, lograr 1 score objetivo, probar un juego nuevo, reclamar reward.
  * Prioridad: MVP
  * Depende de: quest_progress, analytics.
  * Criterio de aceptación: quest se completa por eventos SDK validados.
* [ ] Crear weekly quests: top 50 semanal, completar 5 juegos distintos, sobrevivir X minutos acumulados.
  * Prioridad: Post-MVP
  * Depende de: leaderboards, quests admin.
  * Criterio de aceptación: weekly reset funciona y rewards se calculan server-side.
* [ ] Añadir límites de rewards para evitar farming.
  * Prioridad: MVP
  * Depende de: RewardsModule.
  * Criterio de aceptación: no se pueden reclamar dos veces las mismas quest rewards.
* [ ] Configurar quests desde admin.
  * Prioridad: MVP
  * Depende de: AdminModule.
  * Criterio de aceptación: admin activa/desactiva quests sin deploy.

---

## 16. Ads y adblock

**Descripción corta:** LezGamez es free-to-play con ads. El usuario puede navegar con adblock, pero no iniciar juegos.

* [ ] Integrar Monetag como red inicial configurable.
  * Prioridad: MVP
  * Depende de: AdsModule, ad manager.
  * Criterio de aceptación: ads mock/real se solicitan solo en slots permitidos.
* [ ] Integrar ExoClick como red alternativa o por geografía.
  * Prioridad: MVP
  * Depende de: admin ads.
  * Criterio de aceptación: admin puede seleccionar red por juego/país.
* [ ] Evaluar Google H5 Ads.
  * Prioridad: Futuro
  * Depende de: compliance, tráfico, requisitos Google.
  * Criterio de aceptación: decisión documentada y piloto solo si aplica.
* [ ] Crear Ad Manager interno con cooldown, frecuencia por muerte/nivel y cap por sesión.
  * Prioridad: MVP
  * Depende de: adRules, ad_events.
  * Criterio de aceptación: interstitial no aparece más de lo configurado y popunder máximo 1 por sesión.
* [ ] Permitir banner fuera del gameplay e interstitial en game over o entre niveles.
  * Prioridad: MVP
  * Depende de: Game Shell layout.
  * Criterio de aceptación: no hay anuncios encima de controles ni dentro del área de acción.
* [ ] Detectar adblock y bloquear Play.
  * Prioridad: MVP
  * Depende de: Game Shell.
  * Criterio de aceptación: evento play_blocked_by_adblock se dispara y se muestra el mensaje oficial.
* [ ] Registrar ad_opportunity, ad_shown, ad_blocked y adblock_detected.
  * Prioridad: MVP
  * Depende de: AnalyticsModule.
  * Criterio de aceptación: dashboard muestra adblock rate y ads/session.

---

## 17. Analytics y métricas

**Descripción corta:** Medición de adquisición, retención, monetización, gameplay, ads y errores por juego.

* [ ] Instrumentar eventos: page_view, game_page_view, play_clicked, play_blocked_by_adblock, game_start, game_over, retry, level_complete, score_submit, coins_earned.
  * Prioridad: MVP
  * Depende de: AnalyticsModule, SDK.
  * Criterio de aceptación: eventos aparecen con user/session/game/device/language.
* [ ] Instrumentar eventos: ad_opportunity, ad_shown, ad_blocked, adblock_detected, store_view, item_purchase, quest_claimed, session_end, bug_reported.
  * Prioridad: MVP
  * Depende de: Ads, Store, Quests, bug reports.
  * Criterio de aceptación: funnels por juego se pueden reconstruir.
* [ ] Medir DAU plataforma, GDAU por juego, sesiones por juego, duración, muertes, retries, país, idioma y dispositivo.
  * Prioridad: MVP
  * Depende de: analytics_events.
  * Criterio de aceptación: dashboard MVP responde qué juegos retienen mejor.
* [ ] Medir adblock rate, ads/session, ingresos por red/juego/país, conversión a registro y conversión a tienda.
  * Prioridad: Post-MVP
  * Depende de: revenue reports, ads reales.
  * Criterio de aceptación: se puede decidir frecuencia de ads con datos.

---

## 18. Admin interno

**Descripción corta:** Backoffice para operar catálogo, juegos, tienda, quests, ads, bugs y métricas sin deploy constante.

* [ ] Crear dashboard con DAU, GDAU, top games, revenue estimado, adblock rate, errores y bugs recientes.
  * Prioridad: MVP
  * Depende de: AnalyticsModule.
  * Criterio de aceptación: admin ve salud de plataforma en una pantalla.
* [ ] Gestionar juegos: crear/editar, status live/beta/coming soon, activar/desactivar, configurar rewards y ads.
  * Prioridad: MVP
  * Depende de: GamesModule, AdsModule, RewardsModule.
  * Criterio de aceptación: cambio de status se refleja en catálogo y sitemap.
* [ ] Gestionar store items e inventario compatible.
  * Prioridad: MVP
  * Depende de: StoreModule.
  * Criterio de aceptación: admin publica un item sin deploy.
* [ ] Gestionar quests daily/weekly.
  * Prioridad: MVP
  * Depende de: quests.
  * Criterio de aceptación: admin configura reward, objetivo, fechas y estado.
* [ ] Ver reportes de bugs y métricas por juego.
  * Prioridad: MVP
  * Depende de: bug_reports, analytics.
  * Criterio de aceptación: bug report incluye juego, sesión, device, browser y últimos eventos.

---

## 19. Seguridad y anti-copia

**Descripción corta:** El cliente no es confiable. La seguridad protege economía, scores, sesiones, contenido y ecosistema.

**Regla obligatoria:** El cliente no es confiable. El cliente nunca debe decidir balance de monedas, compras, rewards, scores válidos, rankings, progreso real ni transacciones. Todo eso debe validarse en backend.

* [ ] Validar scores, monedas, compras, rewards, rankings y transacciones en backend.
  * Prioridad: MVP
  * Depende de: backend modules.
  * Criterio de aceptación: modificar payload desde cliente no altera balance ni ranking sin validación.
* [ ] Cargar juegos únicamente desde Game Shell con launch sessions.
  * Prioridad: MVP
  * Depende de: GameLaunchSessionsModule.
  * Criterio de aceptación: juego sin launchSessionId no puede enviar score/reward.
* [ ] Usar iframe sandbox para juegos iframe.
  * Prioridad: MVP
  * Depende de: Game Shell.
  * Criterio de aceptación: sandbox limita navegación, popups y acceso no autorizado.
* [ ] Configurar CSP frame-ancestors solo para lezgamez.com y www.lezgamez.com.
  * Prioridad: MVP
  * Depende de: Cloudflare/headers.
  * Criterio de aceptación: otros dominios no pueden embeber juegos/plataforma.
* [ ] Servir builds minificados, sin source maps en producción y con assets hasheados.
  * Prioridad: MVP
  * Depende de: build pipeline.
  * Criterio de aceptación: producción no expone source maps y assets tienen hash.
* [ ] Implementar anti-hotlink, Cloudflare WAF y rate limit.
  * Prioridad: MVP
  * Depende de: Cloudflare, Redis.
  * Criterio de aceptación: endpoints críticos tienen limit por IP/user/session.
* [ ] Planificar signed launch tokens y URLs temporales para builds.
  * Prioridad: Futuro
  * Depende de: storage/CDN.
  * Criterio de aceptación: juego puede requerir token temporal para cargar assets.

**Principio anti-copia:** No se puede impedir 100% copiar un juego web, pero sí hacer que fuera de LezGamez pierda valor porque no tendrá wallet, rankings, tienda, inventario, quests, ads, eventos ni rewards validados.

---

## 20. Legal, cookies y disclaimers

**Descripción corta:** Legal mínimo para operar plataforma con ads, analytics, cuentas, cookies y créditos internos.

* [ ] Crear Privacy Policy.
  * Prioridad: MVP
  * Depende de: analytics, ads, auth.
  * Criterio de aceptación: explica datos recolectados, finalidad, proveedores y contacto.
* [ ] Crear Terms of Use con regla de Lez Coins sin valor real.
  * Prioridad: MVP
  * Depende de: wallet, store.
  * Criterio de aceptación: términos declaran que créditos no se retiran, venden, transfieren ni cambian por dinero.
* [ ] Crear Cookie Policy y cookie banner.
  * Prioridad: MVP
  * Depende de: ads/analytics.
  * Criterio de aceptación: usuario ve consentimiento para ads/analytics según región.
* [ ] Crear Contact y Support.
  * Prioridad: MVP
  * Depende de: soporte.
  * Criterio de aceptación: usuarios pueden reportar problemas legales, cuenta, ads o compras.
* [ ] Añadir explicación de gameplay ad-supported.
  * Prioridad: MVP
  * Depende de: adblock gate.
  * Criterio de aceptación: bloqueo por adblock explica que ads mantienen los juegos online.

---

## 21. Performance y mobile-first

**Descripción corta:** Móvil es obligatorio. Desktop puede mejorar la experiencia, pero ningún juego debe requerir teclado.

* [ ] Diseñar todos los flujos con viewport móvil como base.
  * Prioridad: MVP
  * Depende de: design system.
  * Criterio de aceptación: home, catálogo, play, store y wallet son usables con una mano.
* [ ] No cargar juegos hasta pulsar Play.
  * Prioridad: MVP
  * Depende de: Game Shell.
  * Criterio de aceptación: página SEO carga sin descargar bundle del juego.
* [ ] Lazy load thumbnails e imágenes optimizadas.
  * Prioridad: MVP
  * Depende de: CDN, imágenes.
  * Criterio de aceptación: catálogo no bloquea LCP por imágenes offscreen.
* [ ] Comprimir assets y servir por CDN.
  * Prioridad: MVP
  * Depende de: R2/CDN.
  * Criterio de aceptación: assets tienen compresión y caching.
* [ ] Reducir animaciones pesadas y soportar reduced motion.
  * Prioridad: MVP
  * Depende de: UI.
  * Criterio de aceptación: usuarios con reduced motion ven transiciones reducidas.
* [ ] Probar Android, iPhone y desktop.
  * Prioridad: MVP
  * Depende de: QA.
  * Criterio de aceptación: cada juego MVP pasa controles, orientación y performance mínima.

---

## 22. QA y checklist de soft launch

**Descripción corta:** Validación funcional, técnica, legal, monetización, SEO y mobile antes de abrir tráfico real.

* [ ] Verificar que home, catálogo y páginas SEO cargan.
  * Prioridad: MVP
  * Depende de: rutas SEO.
  * Criterio de aceptación: no hay errores críticos y el contenido está server-rendered.
* [ ] Verificar que `/play/:slug` carga, bloquea con adblock y permite jugar sin adblock.
  * Prioridad: MVP
  * Depende de: Game Shell, adblock.
  * Criterio de aceptación: regla de navegación con adblock y bloqueo de Play se cumple.
* [ ] Verificar store, wallet, inventory, ranking y quests.
  * Prioridad: MVP
  * Depende de: módulos plataforma.
  * Criterio de aceptación: flujo play -> reward -> wallet -> store -> equip funciona.
* [ ] Verificar admin, legal pages, cookies y consentimientos.
  * Prioridad: MVP
  * Depende de: admin/legal.
  * Criterio de aceptación: páginas legales existen y admin está protegido.
* [ ] Verificar analytics y ads mock.
  * Prioridad: MVP
  * Depende de: AnalyticsModule, AdsModule.
  * Criterio de aceptación: eventos se disparan y no hay anuncios sobre gameplay.
* [ ] Verificar mobile usable, sitemap, robots y no source maps en producción.
  * Prioridad: MVP
  * Depende de: performance, SEO, build.
  * Criterio de aceptación: QA no detecta errores críticos de consola ni fugas de source maps.

---

## 23. Checklist por juego

**Descripción corta:** Cada juego debe ser mobile-playable, cargar rápido, tener score, ranking, retry rápido, Game SDK, wallet/store/inventory y ads solo en pausas naturales.

### Reglas comunes para todos los juegos

* [ ] El juego funciona en teléfono sin teclado obligatorio.
  * Prioridad: MVP
  * Depende de: controles mobile.
  * Criterio de aceptación: se juega en Android e iPhone con táctil.
* [ ] La primera acción se entiende en menos de 5 segundos.
  * Prioridad: MVP
  * Depende de: tutorial inline.
  * Criterio de aceptación: usuario nuevo inicia sin explicación externa.
* [ ] Partida ideal de 30 segundos a 3 minutos con retry rápido.
  * Prioridad: MVP
  * Depende de: balance.
  * Criterio de aceptación: botón Retry reinicia en menos de 2 segundos.
* [ ] Integración con Game SDK, wallet, store, inventario, ranking y ads naturales.
  * Prioridad: MVP
  * Depende de: Game Shell y SDK.
  * Criterio de aceptación: game_start, game_over, score_submit y coins_earned se reportan.

### 23.1 Golden Rain Zombies

**Concepto:** Survival arcade top-down donde una lluvia tóxica convierte civiles en zombies y el jugador sobrevive usando paraguas.  
**Engine recomendado:** Phaser.

* [ ] Core loop: esquivar lluvia tóxica, rescatar/evitar civiles, usar paraguas, sobrevivir oleadas y subir score por segundos + rescates.
  * Prioridad: MVP
  * Depende de: controles, enemigos, score.
  * Criterio de aceptación: loop completo en 60-120 segundos.
* [ ] Controles mobile: joystick virtual izquierdo y botón paraguas/dash derecho.
  * Prioridad: MVP
  * Depende de: UI táctil.
  * Criterio de aceptación: controles no son tapados por ads.
* [ ] Controles desktop: WASD/flechas y espacio/click para paraguas.
  * Prioridad: MVP
  * Depende de: input manager.
  * Criterio de aceptación: desktop funciona sin afectar mobile.
* [ ] Mecánicas mínimas: lluvia por zonas, paraguas con cooldown, civiles convertibles, oleadas.
  * Prioridad: MVP
  * Depende de: IA simple.
  * Criterio de aceptación: hay decisiones de riesgo/recompensa.
* [ ] Obstáculos/enemigos mínimos: zombies lentos, zombies rápidos, charcos tóxicos, tormenta final.
  * Prioridad: MVP
  * Depende de: sprites, colisiones.
  * Criterio de aceptación: 4 amenazas diferenciadas.
* [ ] Powerups mínimos: paraguas extra, botas anti-charco, repelente zombie, coin magnet.
  * Prioridad: MVP
  * Depende de: balance.
  * Criterio de aceptación: powerups duran poco y no rompen el ranking.
* [ ] Score/ranking/coins: score por supervivencia, rescates y combo; ranking weekly; Lez Coins por score validado con cap diario.
  * Prioridad: MVP
  * Depende de: SDK, backend.
  * Criterio de aceptación: score imposible se rechaza.
* [ ] Ads naturales: interstitial en game over cada N muertes; banner fuera del área de acción.
  * Prioridad: MVP
  * Depende de: adRules.
  * Criterio de aceptación: no aparece ad durante oleada activa.
* [ ] Skins/cosméticos: paraguas violeta, paraguas roto, zombie pet visual, trail de lluvia amber.
  * Prioridad: MVP
  * Depende de: storeCompatibility.
  * Criterio de aceptación: equipItems altera visual sin ventaja competitiva.
* [ ] Assets/sonidos: ciudad oscura, lluvia tóxica, zombies, paraguas, splashes, alarma, golpes húmedos.
  * Prioridad: MVP
  * Depende de: arte/audio.
  * Criterio de aceptación: estética rara sin gore excesivo.
* [ ] Analytics: game_start, rain_hit, umbrella_used, civilian_saved, zombie_conversion, game_over, retry.
  * Prioridad: MVP
  * Depende de: SDK.
  * Criterio de aceptación: eventos permiten balancear dificultad.
* [ ] Game over: vida agotada, mordida fatal, toxicidad máxima.
  * Prioridad: MVP
  * Depende de: health system.
  * Criterio de aceptación: razón se envía en gameOver.
* [ ] Criterio MVP: una arena, 3 minutos máximos, 4 enemigos/obstáculos, ranking y retry.
  * Prioridad: MVP
  * Depende de: QA.
  * Criterio de aceptación: 20 partidas QA sin softlocks.
* [ ] Riesgos técnicos/diseño: demasiados NPC pueden bajar FPS; lluvia amarilla puede parecer chiste no deseado.
  * Prioridad: MVP
  * Depende de: optimización/arte.
  * Criterio de aceptación: mantener lectura tóxica stylized, no vulgar.
* [ ] Clip viral: paraguas salva a un civil justo antes de convertirse y luego una horda rodea al jugador.
  * Prioridad: Post-MVP
  * Depende de: momentos emergentes.
  * Criterio de aceptación: replay corto exportable o compartible.

### 23.2 Huevo No Te Quiebres

**Concepto:** Juego de físicas donde controlas un huevo frágil que debe avanzar sin romperse.  
**Engine recomendado:** Matter.js + Phaser.

* [ ] Core loop: avanzar, equilibrar el huevo, caer suave, evitar impactos y llegar a meta.
  * Prioridad: MVP
  * Depende de: físicas.
  * Criterio de aceptación: cada nivel dura 30-90 segundos.
* [ ] Controles mobile: mantener izquierda/derecha para inclinar, botón salto/amortiguar.
  * Prioridad: MVP
  * Depende de: input táctil.
  * Criterio de aceptación: control fino en pantalla pequeña.
* [ ] Controles desktop: A/D o flechas, espacio para amortiguar.
  * Prioridad: MVP
  * Depende de: input manager.
  * Criterio de aceptación: paridad funcional con mobile.
* [ ] Mecánicas mínimas: fragilidad por impacto, balanceo, rampas, plataformas blandas/duras.
  * Prioridad: MVP
  * Depende de: physics tuning.
  * Criterio de aceptación: romperse se siente justo.
* [ ] Obstáculos/enemigos mínimos: pinchos, caídas, martillos lentos, superficies resbalosas.
  * Prioridad: MVP
  * Depende de: nivel.
  * Criterio de aceptación: 6 niveles cortos reutilizables.
* [ ] Powerups mínimos: cáscara reforzada temporal, gel amortiguador, slow motion, coin trail.
  * Prioridad: MVP
  * Depende de: balance.
  * Criterio de aceptación: powerups son opcionales y visibles.
* [ ] Score/ranking/coins: tiempo, daño evitado, huevos intactos; ranking por nivel y endless; coins por completado.
  * Prioridad: MVP
  * Depende de: SDK.
  * Criterio de aceptación: ranking separa nivel y modo endless.
* [ ] Ads naturales: interstitial cada 3 fails o fin de nivel.
  * Prioridad: MVP
  * Depende de: AdsModule.
  * Criterio de aceptación: no interrumpe física activa.
* [ ] Skins/cosméticos: huevo zombie, huevo dorado cosmético, casco roto, trail de cáscara.
  * Prioridad: MVP
  * Depende de: store.
  * Criterio de aceptación: skins no modifican hitbox.
* [ ] Assets/sonidos: huevo, grietas, rampas, impactos, crack progresivo, música tensa mínima.
  * Prioridad: MVP
  * Depende de: arte/audio.
  * Criterio de aceptación: feedback de daño es claro.
* [ ] Analytics: crack_level, impact_force, level_complete, fail_obstacle, retry.
  * Prioridad: MVP
  * Depende de: SDK.
  * Criterio de aceptación: se identifica obstáculo más frustrante.
* [ ] Game over: impacto supera umbral, caída al vacío, tiempo agotado.
  * Prioridad: MVP
  * Depende de: físicas.
  * Criterio de aceptación: reason se reporta.
* [ ] Riesgos: físicas impredecibles; frustración si el huevo rompe por microimpactos.
  * Prioridad: MVP
  * Depende de: tuning.
  * Criterio de aceptación: tolerancia ajustada tras QA.
* [ ] Clip viral: huevo llega con 99% de grietas y se rompe a centímetros de la meta.
  * Prioridad: Post-MVP
  * Depende de: cámara/feedback.
  * Criterio de aceptación: momento legible en vertical.

### 23.3 Break Me

**Concepto:** Puzzle arcade donde cada nivel se supera rompiendo literalmente el juego, moviendo UI, usando glitches intencionales y manipulando reglas.  
**Engine recomendado:** PixiJS.

* [ ] Core loop: observar regla falsa, manipular UI/glitch, romper restricción y completar nivel.
  * Prioridad: MVP
  * Depende de: sistema de niveles.
  * Criterio de aceptación: 12 niveles cortos con twist claro.
* [ ] Controles mobile: tap, drag, long press y shake opcional no obligatorio.
  * Prioridad: MVP
  * Depende de: UX táctil.
  * Criterio de aceptación: todos los niveles se completan sin teclado.
* [ ] Controles desktop: click, drag, scroll y teclas opcionales.
  * Prioridad: MVP
  * Depende de: input.
  * Criterio de aceptación: no hay dependencia desktop-only.
* [ ] Mecánicas mínimas: mover botones, borrar paredes, invertir textos, glitch de colisión, fake error modal.
  * Prioridad: MVP
  * Depende de: framework UI.
  * Criterio de aceptación: cada mecánica enseña una sorpresa.
* [ ] Obstáculos mínimos: reglas mentirosas, botones que huyen, contador falso, UI bloqueante.
  * Prioridad: MVP
  * Depende de: diseño puzzle.
  * Criterio de aceptación: dificultad sube sin tutorial largo.
* [ ] Powerups mínimos: hint limitado, glitch pulse, reveal hitbox.
  * Prioridad: MVP
  * Depende de: hints.
  * Criterio de aceptación: hints no resuelven automáticamente.
* [ ] Score/ranking/coins: tiempo, hints no usados, glitches encontrados; ranking por speedrun.
  * Prioridad: MVP
  * Depende de: SDK.
  * Criterio de aceptación: score no premia esperar.
* [ ] Ads naturales: entre bloques de niveles o al abandonar.
  * Prioridad: MVP
  * Depende de: levelComplete.
  * Criterio de aceptación: nunca tapa puzzle activo.
* [ ] Skins/cosméticos: cursor/glitch trail, marco de error, tema de partículas violet.
  * Prioridad: MVP
  * Depende de: inventory.
  * Criterio de aceptación: cosméticos no revelan soluciones.
* [ ] Assets/sonidos: UI brutalista, sonidos de error, glitch, clicks secos, ruido digital.
  * Prioridad: MVP
  * Depende de: audio.
  * Criterio de aceptación: glitch no parece bug real de plataforma.
* [ ] Analytics: level_stuck_time, hint_used, fake_button_dragged, level_complete, reportBug.
  * Prioridad: MVP
  * Depende de: SDK.
  * Criterio de aceptación: distinguir bug intencional de bug real.
* [ ] Game over: no tradicional; fallo por tiempo en challenge mode o reset manual.
  * Prioridad: MVP
  * Depende de: modos.
  * Criterio de aceptación: post-game aparece tras bloque de niveles.
* [ ] Riesgos: usuarios pueden creer que la web está rota; accesibilidad de glitches.
  * Prioridad: MVP
  * Depende de: copy/UX.
  * Criterio de aceptación: shell y juego delimitan claramente experiencia.
* [ ] Clip viral: jugador arrastra el botón Play fuera de la pantalla para revelar la salida.
  * Prioridad: Post-MVP
  * Depende de: nivel diseñado para clip.
  * Criterio de aceptación: solución sorprende en menos de 10 segundos.

### 23.4 Cell Front Lite

**Concepto:** Juego tipo territorio/células donde conquistas zonas cerrando áreas con tu rastro y compites contra bots.  
**Engine recomendado:** Phaser.

* [ ] Core loop: salir de zona segura, dibujar rastro, cerrar área, expandir territorio y evitar bots.
  * Prioridad: MVP
  * Depende de: algoritmo de áreas.
  * Criterio de aceptación: cierre de área funciona en mapas pequeños.
* [ ] Controles mobile: swipe/dirección por joystick simplificado.
  * Prioridad: MVP
  * Depende de: input.
  * Criterio de aceptación: cambios de dirección son precisos.
* [ ] Controles desktop: flechas/WASD.
  * Prioridad: MVP
  * Depende de: input.
  * Criterio de aceptación: paridad con mobile.
* [ ] Mecánicas mínimas: zona segura, trail vulnerable, cierre de polígonos, bots agresivos.
  * Prioridad: MVP
  * Depende de: colisiones.
  * Criterio de aceptación: tocar trail propio fuera de regla o bot causa fallo.
* [ ] Obstáculos/enemigos: bot perseguidor, bot errático, pared móvil, zona venenosa.
  * Prioridad: MVP
  * Depende de: IA.
  * Criterio de aceptación: 3 tipos de amenaza.
* [ ] Powerups: speed boost, shield de trail, freeze bots, area bomb.
  * Prioridad: MVP
  * Depende de: balance.
  * Criterio de aceptación: powerups aparecen fuera de zona segura.
* [ ] Score/ranking/coins: % territorio, bots eliminados, tiempo; ranking por porcentaje y velocidad.
  * Prioridad: MVP
  * Depende de: SDK.
  * Criterio de aceptación: 100% no es requerido para score válido.
* [ ] Ads naturales: tras derrota o victoria de mapa.
  * Prioridad: MVP
  * Depende de: adRules.
  * Criterio de aceptación: no ad durante rastro activo.
* [ ] Skins/assets/sonidos: células, trails violet, bots, blobs, captura de área, pulso orgánico.
  * Prioridad: MVP
  * Depende de: arte/audio.
  * Criterio de aceptación: lectura clara en pantalla pequeña.
* [ ] Analytics/game over: trail_hit, bot_hit, area_closed, match_complete, death_by_bot.
  * Prioridad: MVP
  * Depende de: SDK.
  * Criterio de aceptación: errores de algoritmo se detectan.
* [ ] Riesgos: cálculo de áreas complejo y posible bajo rendimiento.
  * Prioridad: MVP
  * Depende de: optimización.
  * Criterio de aceptación: 60 FPS en mapas MVP.
* [ ] Clip viral: cierre gigante al 1% de vida mientras un bot toca casi el trail.
  * Prioridad: Post-MVP
  * Depende de: cámara y replay.
  * Criterio de aceptación: tensión visual legible.

### 23.5 Egg Catch Me

**Concepto:** Juego de atrapar y amortiguar huevos que caen para que no se rompan.  
**Engine recomendado:** Phaser.

* [ ] Core loop: mover canasta/colchón, atrapar huevos, amortiguar caídas, evitar objetos malos.
  * Prioridad: MVP
  * Depende de: input y spawner.
  * Criterio de aceptación: loop entendible en 3 segundos.
* [ ] Controles mobile: arrastrar horizontalmente y tap para amortiguar.
  * Prioridad: MVP
  * Depende de: UI táctil.
  * Criterio de aceptación: dedo no tapa huevos críticos.
* [ ] Controles desktop: mouse o flechas, click/espacio para amortiguar.
  * Prioridad: MVP
  * Depende de: input.
  * Criterio de aceptación: mouse funciona como modo principal desktop.
* [ ] Mecánicas/obstáculos: huevos normales/frágiles/dorados, piedras, bombas de harina, viento lateral.
  * Prioridad: MVP
  * Depende de: spawner.
  * Criterio de aceptación: dificultad escala cada 20 segundos.
* [ ] Powerups: slow fall, basket widen, shield one break, magnet.
  * Prioridad: MVP
  * Depende de: balance.
  * Criterio de aceptación: powerups comunican duración.
* [ ] Score/ranking/coins: huevos salvados, combo, huevos raros; ranking endless.
  * Prioridad: MVP
  * Depende de: SDK.
  * Criterio de aceptación: combo resetea al fallar.
* [ ] Ads naturales: game over o cada 5 niveles de velocidad.
  * Prioridad: MVP
  * Depende de: adRules.
  * Criterio de aceptación: ad nunca aparece con huevos cayendo.
* [ ] Skins/assets/sonidos: canastas, colchones, huevo zombie, crack, pop de combo, caída.
  * Prioridad: MVP
  * Depende de: arte/audio.
  * Criterio de aceptación: objetos buenos/malos se distinguen.
* [ ] Analytics/game over: egg_saved, egg_broken, bomb_caught, combo_lost, retry.
  * Prioridad: MVP
  * Depende de: SDK.
  * Criterio de aceptación: se ajusta spawn por datos.
* [ ] Riesgos: demasiado simple; necesita ritmo y combos satisfactorios.
  * Prioridad: MVP
  * Depende de: game feel.
  * Criterio de aceptación: QA reporta deseo de retry.
* [ ] Clip viral: lluvia imposible de huevos salvada con powerup de colchón gigante.
  * Prioridad: Post-MVP
  * Depende de: powerup visual.
  * Criterio de aceptación: clip claro en vertical.

### 23.6 Gravity Dungeon Dash

**Concepto:** Plataformas de reto con doble salto, dash, retroceso, obstáculos y niveles difíciles.  
**Engine recomendado:** Phaser.

* [ ] Core loop: correr, saltar, doble salto, dash, esquivar trampas y llegar al portal.
  * Prioridad: MVP
  * Depende de: físicas arcade.
  * Criterio de aceptación: 10 niveles cortos.
* [ ] Controles mobile: botones izquierda/derecha, salto y dash; opción auto-run para móvil.
  * Prioridad: MVP
  * Depende de: layout táctil.
  * Criterio de aceptación: botones grandes no tapan trampas.
* [ ] Controles desktop: A/D, espacio, shift.
  * Prioridad: MVP
  * Depende de: input.
  * Criterio de aceptación: respuesta inmediata.
* [ ] Mecánicas/obstáculos: pinchos, sierras, plataformas móviles, gravedad invertida, knockback.
  * Prioridad: MVP
  * Depende de: level design.
  * Criterio de aceptación: dificultad alta pero justa.
* [ ] Powerups: dash extra, shield, slow trap, checkpoint token.
  * Prioridad: MVP
  * Depende de: balance.
  * Criterio de aceptación: powerups no trivializan niveles.
* [ ] Score/ranking/coins: tiempo, muertes, gemas; ranking speedrun por nivel.
  * Prioridad: MVP
  * Depende de: SDK.
  * Criterio de aceptación: tiempo se mide server/session aware.
* [ ] Ads naturales: cada X muertes o al completar nivel.
  * Prioridad: MVP
  * Depende de: adRules.
  * Criterio de aceptación: no ad durante intento.
* [ ] Skins/assets/sonidos: runners oscuros, trails violet, dungeons, sierras, dash, death pop.
  * Prioridad: MVP
  * Depende de: arte/audio.
  * Criterio de aceptación: hitboxes son legibles.
* [ ] Analytics/game over: death_spike, death_saw, dash_used, level_complete, retry.
  * Prioridad: MVP
  * Depende de: SDK.
  * Criterio de aceptación: heatmap básico de muertes por nivel.
* [ ] Riesgos: controles móviles pueden frustrar; niveles demasiado difíciles dañan retención.
  * Prioridad: MVP
  * Depende de: QA mobile.
  * Criterio de aceptación: primer nivel completa >70% en QA.
* [ ] Clip viral: cadena de dash/doble salto con caída casi mortal y portal final.
  * Prioridad: Post-MVP
  * Depende de: level moments.
  * Criterio de aceptación: clip de 8-12 segundos.

### 23.7 Trash Fisher

**Concepto:** Juego de pesca absurda donde pescas basura, la vendes y mejoras tu equipo.  
**Engine recomendado:** Phaser.

* [ ] Core loop: lanzar anzuelo, bajar, recoger basura rara, subir, vender y mejorar equipo.
  * Prioridad: MVP
  * Depende de: economía interna de juego.
  * Criterio de aceptación: partida de 2-3 minutos con upgrade rápido.
* [ ] Controles mobile: drag para apuntar/lanzar y mover anzuelo.
  * Prioridad: MVP
  * Depende de: input.
  * Criterio de aceptación: una mano es suficiente.
* [ ] Controles desktop: mouse drag y A/D opcional.
  * Prioridad: MVP
  * Depende de: input.
  * Criterio de aceptación: mouse es natural.
* [ ] Mecánicas/obstáculos: peso límite, profundidad, corriente, basura tóxica, pez mordedor.
  * Prioridad: MVP
  * Depende de: spawner.
  * Criterio de aceptación: loot tiene rarezas claras.
* [ ] Powerups: imán, cable largo, gancho triple, bolsa resistente.
  * Prioridad: MVP
  * Depende de: upgrade system.
  * Criterio de aceptación: upgrades persisten solo dentro de run o según diseño validado.
* [ ] Score/ranking/coins: valor de basura, rarezas, profundidad; coins por run con cap.
  * Prioridad: MVP
  * Depende de: SDK.
  * Criterio de aceptación: venta interna no confunde con dinero real.
* [ ] Ads naturales: después de vender carga o terminar run.
  * Prioridad: MVP
  * Depende de: adRules.
  * Criterio de aceptación: no ad durante descenso/subida.
* [ ] Skins/assets/sonidos: cañas, ganchos, botas, latas, neumáticos, splash, sonar raro.
  * Prioridad: MVP
  * Depende de: arte/audio.
  * Criterio de aceptación: basura absurda es coleccionable.
* [ ] Analytics/game over: cast, item_caught, sell_completed, upgrade_bought, line_broken.
  * Prioridad: MVP
  * Depende de: SDK.
  * Criterio de aceptación: se identifica loot más atractivo.
* [ ] Riesgos: economía interna puede parecer cash si se usa vocabulario incorrecto.
  * Prioridad: MVP
  * Depende de: copy legal.
  * Criterio de aceptación: usar “scrap value” o score, no “earn money”.
* [ ] Clip viral: pescar un objeto absurdo gigante que rompe la barca visualmente.
  * Prioridad: Post-MVP
  * Depende de: rare loot.
  * Criterio de aceptación: sorpresa visual compartible.

### 23.8 Crazy Panels

**Concepto:** Puzzle de paneles donde debes lograr que todos queden del mismo color usando reglas de cambio por vecinos.  
**Engine recomendado:** Phaser o React Canvas.

* [ ] Core loop: tocar panel, cambiar vecinos, resolver tablero en mínimos movimientos.
  * Prioridad: MVP
  * Depende de: puzzle generator.
  * Criterio de aceptación: 30 niveles generados/curados.
* [ ] Controles mobile: tap en paneles grandes con undo.
  * Prioridad: MVP
  * Depende de: UI grid.
  * Criterio de aceptación: panel mínimo 44px táctil.
* [ ] Controles desktop: click y atajos R/undo opcionales.
  * Prioridad: MVP
  * Depende de: input.
  * Criterio de aceptación: no requiere teclado.
* [ ] Mecánicas/obstáculos: vecinos ortogonales, diagonales, panel bloqueado, panel bomba, límite de movimientos.
  * Prioridad: MVP
  * Depende de: reglas.
  * Criterio de aceptación: reglas se introducen progresivamente.
* [ ] Powerups: undo extra, hint, shuffle limitado, freeze panel.
  * Prioridad: MVP
  * Depende de: hints.
  * Criterio de aceptación: powerups no reemplazan solución.
* [ ] Score/ranking/coins: movimientos, tiempo, hints usados; ranking daily puzzle.
  * Prioridad: MVP
  * Depende de: SDK.
  * Criterio de aceptación: daily seed consistente por fecha.
* [ ] Ads naturales: tras completar/fallar tablero.
  * Prioridad: MVP
  * Depende de: levelComplete.
  * Criterio de aceptación: no ad durante pensamiento activo.
* [ ] Skins/assets/sonidos: paneles oscuros/violet, click mecánico, success pulse, glitch panel.
  * Prioridad: MVP
  * Depende de: design.
  * Criterio de aceptación: no multicolor fuera de reglas del juego; plataforma conserva identidad.
* [ ] Analytics/game over: puzzle_start, move_made, undo_used, hint_used, puzzle_complete, puzzle_fail.
  * Prioridad: MVP
  * Depende de: SDK.
  * Criterio de aceptación: dificultad se ajusta por tasa de completado.
* [ ] Riesgos: reglas de color pueden romper paleta; usar tonos dentro de surfaces/violet/amber controlado.
  * Prioridad: MVP
  * Depende de: art direction.
  * Criterio de aceptación: no parece feria de colores.
* [ ] Clip viral: resolver tablero imposible con un solo movimiento inesperado.
  * Prioridad: Post-MVP
  * Depende de: daily puzzle.
  * Criterio de aceptación: solución sorprendente reproducible.

### 23.9 Crypt Flap

**Concepto:** Murciélago en cripta oscura que usa ecolocalización para ver obstáculos, pero hacer ruido puede atraer peligro.  
**Engine recomendado:** Phaser.

* [ ] Core loop: flap, emitir eco para revelar obstáculos, avanzar y decidir cuándo hacer ruido.
  * Prioridad: MVP
  * Depende de: shader/visibilidad.
  * Criterio de aceptación: mecánica se entiende en primera partida.
* [ ] Controles mobile: tap para flap, mantener o segundo botón para eco.
  * Prioridad: MVP
  * Depende de: input.
  * Criterio de aceptación: eco no se activa accidentalmente.
* [ ] Controles desktop: espacio/click flap, E/shift eco.
  * Prioridad: MVP
  * Depende de: input.
  * Criterio de aceptación: mouse-only posible con doble zona.
* [ ] Mecánicas/obstáculos: columnas, estalactitas, fantasmas atraídos por eco, zonas mudas.
  * Prioridad: MVP
  * Depende de: level generator.
  * Criterio de aceptación: oscuridad no es injusta.
* [ ] Powerups: silent echo, shield wing, slow time, coin bat swarm.
  * Prioridad: MVP
  * Depende de: balance.
  * Criterio de aceptación: eco sigue siendo decisión.
* [ ] Score/ranking/coins: distancia, ecos eficientes, zonas superadas; ranking endless.
  * Prioridad: MVP
  * Depende de: SDK.
  * Criterio de aceptación: distancia validada por duración.
* [ ] Ads naturales: game over.
  * Prioridad: MVP
  * Depende de: adRules.
  * Criterio de aceptación: retry rápido tras ad cooldown.
* [ ] Skins/assets/sonidos: murciélagos, cripta, ondas violet, whispers, flap, eco ping.
  * Prioridad: MVP
  * Depende de: arte/audio.
  * Criterio de aceptación: sonido comunica peligro.
* [ ] Analytics/game over: echo_used, ghost_alerted, obstacle_hit, distance_checkpoint, retry.
  * Prioridad: MVP
  * Depende de: SDK.
  * Criterio de aceptación: balance entre eco y amenaza medible.
* [ ] Riesgos: pantalla muy oscura puede ser ilegible en móviles con brillo bajo.
  * Prioridad: MVP
  * Depende de: accessibility.
  * Criterio de aceptación: modo claridad mantiene estética.
* [ ] Clip viral: eco revela una cara gigante justo antes de esquivarla.
  * Prioridad: Post-MVP
  * Depende de: set pieces.
  * Criterio de aceptación: susto no depende de audio solamente.

### 23.10 Barricade in the Night Lite

**Concepto:** Survival top-down donde recolectas recursos, construyes barricadas y sobrevives oleadas zombies.  
**Engine recomendado:** Phaser.

* [ ] Core loop: recolectar madera/scrap, construir barricadas, sobrevivir oleada, reparar y repetir.
  * Prioridad: MVP
  * Depende de: inventory in-run.
  * Criterio de aceptación: 3 oleadas en modo Lite.
* [ ] Controles mobile: joystick + botones interactuar/construir/ataque.
  * Prioridad: MVP
  * Depende de: layout.
  * Criterio de aceptación: máximo 3 botones activos.
* [ ] Controles desktop: WASD, mouse aim, E construir.
  * Prioridad: MVP
  * Depende de: input.
  * Criterio de aceptación: desktop mejora pero no es obligatorio.
* [ ] Mecánicas/obstáculos: recursos, barricadas, reparación, oleadas, noche progresiva.
  * Prioridad: MVP
  * Depende de: AI zombies.
  * Criterio de aceptación: loop de preparación y ataque claro.
* [ ] Enemigos/powerups: zombies básicos/rápidos/tank; linterna, reparación instantánea, stun flare.
  * Prioridad: MVP
  * Depende de: balance.
  * Criterio de aceptación: tres roles enemigos.
* [ ] Score/ranking/coins: oleadas, recursos usados, kills, tiempo; ranking survival.
  * Prioridad: MVP
  * Depende de: SDK.
  * Criterio de aceptación: score no premia AFK.
* [ ] Ads naturales: entre oleadas o game over.
  * Prioridad: MVP
  * Depende de: waveComplete.
  * Criterio de aceptación: nunca durante ataque activo.
* [ ] Skins/assets/sonidos: superviviente, barricadas, madera, zombies, noche, golpes, alarma.
  * Prioridad: MVP
  * Depende de: arte/audio.
  * Criterio de aceptación: amenaza se lee en móvil.
* [ ] Analytics/game over: resource_collected, barricade_built, barricade_broken, wave_complete, death.
  * Prioridad: MVP
  * Depende de: SDK.
  * Criterio de aceptación: se identifica si construir es intuitivo.
* [ ] Riesgos: demasiada complejidad para Lite; reducir crafting a 1 recurso inicial.
  * Prioridad: MVP
  * Depende de: scope.
  * Criterio de aceptación: onboarding menor a 5 segundos.
* [ ] Clip viral: última barricada cae y el jugador sobrevive con 1 HP hasta amanecer.
  * Prioridad: Post-MVP
  * Depende de: oleada final.
  * Criterio de aceptación: tensión clara.

### 23.11 Bomb Wars Stickman Lite

**Concepto:** Arena arcade de stickmen con bombas, bots, powerups y rondas cortas.  
**Engine recomendado:** Phaser.

* [ ] Core loop: moverse por arena, plantar/lanzar bombas, esquivar explosiones, eliminar bots.
  * Prioridad: Post-MVP
  * Depende de: arena AI.
  * Criterio de aceptación: rondas de 60-120 segundos.
* [ ] Controles mobile: joystick + botón bomba + botón dash.
  * Prioridad: Post-MVP
  * Depende de: UI.
  * Criterio de aceptación: apuntado no es frustrante.
* [ ] Controles desktop: WASD, espacio bomba, shift dash.
  * Prioridad: Post-MVP
  * Depende de: input.
  * Criterio de aceptación: respuesta rápida.
* [ ] Mecánicas/obstáculos/powerups: bombas con timer, cajas destructibles, bots, radio extra, bomba rápida, shield.
  * Prioridad: Post-MVP
  * Depende de: colisiones.
  * Criterio de aceptación: explosiones tienen telegraph claro.
* [ ] Score/ranking/coins/ads: kills, supervivencia, win; ads entre rondas; coins por win con cap.
  * Prioridad: Post-MVP
  * Depende de: SDK.
  * Criterio de aceptación: ranking no acepta kills imposibles.
* [ ] Skins/assets/sonidos/analytics/game over: stickmen, bombas, explosiones, arena; bomb_planted, bot_killed, self_explode, round_end.
  * Prioridad: Post-MVP
  * Depende de: arte/audio.
  * Criterio de aceptación: explosiones legibles en móvil.
* [ ] Riesgos/viral: caos excesivo puede ocultar lectura; clip de cadena de explosiones eliminando 3 bots.
  * Prioridad: Post-MVP
  * Depende de: VFX tuning.
  * Criterio de aceptación: caos divertido, no injusto.

### 23.12 Parkour Sky View

**Concepto:** Runner/parkour en el cielo con plataformas, obstáculos, saltos y caídas espectaculares.  
**Engine recomendado:** Three.js simple o Phaser pseudo-3D.

* [ ] Core loop: correr, saltar, deslizar, cambiar carril y sobrevivir plataformas aéreas.
  * Prioridad: Post-MVP
  * Depende de: runner controller.
  * Criterio de aceptación: sesión 1-3 minutos.
* [ ] Controles mobile: swipe izquierda/derecha/arriba/abajo y tap dash.
  * Prioridad: Post-MVP
  * Depende de: gestures.
  * Criterio de aceptación: gestos no fallan en navegadores móviles.
* [ ] Controles desktop: flechas/WASD y espacio.
  * Prioridad: Post-MVP
  * Depende de: input.
  * Criterio de aceptación: paridad funcional.
* [ ] Mecánicas/obstáculos/powerups: gaps, drones, paredes, trampolines, slow fall, double jump, coin line.
  * Prioridad: Post-MVP
  * Depende de: generación de niveles.
  * Criterio de aceptación: caída es espectacular pero retry inmediato.
* [ ] Score/ranking/coins/ads: distancia, flips, pickups; ads en caída/game over; coins por distancia cap.
  * Prioridad: Post-MVP
  * Depende de: SDK.
  * Criterio de aceptación: score coherente con duración.
* [ ] Skins/assets/sonidos/analytics/game over: plataformas cielo, viento, dash, caída; jump, fall, obstacle_hit, distance.
  * Prioridad: Post-MVP
  * Depende de: arte/audio.
  * Criterio de aceptación: performance móvil estable.
* [ ] Riesgos/viral: 3D puede pesar; clip de caída infinita con recuperación imposible.
  * Prioridad: Post-MVP
  * Depende de: optimización.
  * Criterio de aceptación: build ligero.

### 23.13 Inflation Run

**Concepto:** Runner satírico genérico donde los precios suben, los billetes pierden valor y el jugador esquiva obstáculos económicos absurdos.  
**Engine recomendado:** Phaser.

* [ ] Core loop: correr, recoger valor, esquivar subidas de precio, mantener poder de compra hasta meta.
  * Prioridad: Post-MVP
  * Depende de: runner.
  * Criterio de aceptación: sátira genérica, no financiera real.
* [ ] Controles mobile: swipe carriles y tap jump.
  * Prioridad: Post-MVP
  * Depende de: input.
  * Criterio de aceptación: no requiere teclado.
* [ ] Controles desktop: flechas/WASD.
  * Prioridad: Post-MVP
  * Depende de: input.
  * Criterio de aceptación: paridad.
* [ ] Mecánicas/obstáculos/powerups: etiquetas de precio, carritos, impuestos ficticios, billete shield, coupon slow, price freeze.
  * Prioridad: Post-MVP
  * Depende de: art direction.
  * Criterio de aceptación: no parece consejo financiero ni crypto.
* [ ] Score/ranking/coins/ads: distancia, valor preservado, combos; ads en game over; Lez Coins separadas de billetes ficticios.
  * Prioridad: Post-MVP
  * Depende de: legal copy.
  * Criterio de aceptación: no hay confusión con dinero real.
* [ ] Skins/assets/sonidos/analytics/game over: billetes cartoon oscuros, tickets, cajas; price_hit, coupon_used, value_zero.
  * Prioridad: Post-MVP
  * Depende de: arte/audio.
  * Criterio de aceptación: humor absurdo, no político específico.
* [ ] Riesgos/viral: riesgo legal/comunicacional por tema económico; clip de precio gigante aplastando al jugador.
  * Prioridad: Post-MVP
  * Depende de: revisión legal.
  * Criterio de aceptación: disclaimers si hace falta.

### 23.14 Cardboard Shooter Lite

**Concepto:** Shooter arcade con estética de cartón, armas absurdas y bots.  
**Engine recomendado:** Phaser.

* [ ] Core loop: moverse, apuntar automático/asistido, disparar armas absurdas, eliminar bots y sobrevivir rondas.
  * Prioridad: Post-MVP
  * Depende de: shooter controls.
  * Criterio de aceptación: mobile viable con auto-aim.
* [ ] Controles mobile: joystick movimiento + botón disparo/arma especial, auto-aim opcional.
  * Prioridad: Post-MVP
  * Depende de: input.
  * Criterio de aceptación: sin teclado obligatorio.
* [ ] Controles desktop: WASD + mouse aim/shoot.
  * Prioridad: Post-MVP
  * Depende de: input.
  * Criterio de aceptación: desktop puede ser más preciso.
* [ ] Mecánicas/obstáculos/powerups: coberturas de cartón, bots, torretas, pegamento slow, arma confeti, escudo caja.
  * Prioridad: Post-MVP
  * Depende de: IA.
  * Criterio de aceptación: armas absurdas tienen feedback claro.
* [ ] Score/ranking/coins/ads: kills, accuracy, rondas; ads entre rondas; coins por score validado.
  * Prioridad: Post-MVP
  * Depende de: SDK.
  * Criterio de aceptación: anti-cheat limita fire rate imposible.
* [ ] Skins/assets/sonidos/analytics/game over: personajes cartón, armas, papel rasgado; shot_fired, bot_hit, round_complete, death.
  * Prioridad: Post-MVP
  * Depende de: arte/audio.
  * Criterio de aceptación: estética no infantil genérica.
* [ ] Riesgos/viral: shooter puede requerir más tuning; clip de arma absurda que dobla el cartón del mapa.
  * Prioridad: Post-MVP
  * Depende de: balance.
  * Criterio de aceptación: violencia stylized y no realista.

### 23.15 Juegos futuros/post-MVP

* [ ] Runner del Desodorante: runner absurdo con nube protectora, obstáculos de mal olor y powerups de frescura.
  * Prioridad: Futuro
  * Depende de: runner framework.
  * Criterio de aceptación: humor visual sin ser ofensivo.
* [ ] Cartas de Monstruos: colección/batalla ligera sin cash-out, sin promesas de valor y con disclaimers claros.
  * Prioridad: Futuro
  * Depende de: legal, store, inventory.
  * Criterio de aceptación: no se percibe como gambling ni trading con valor real.
* [ ] Alien Flashlight Horror: micro-horror con linterna, batería limitada y jumpscares controlados.
  * Prioridad: Futuro
  * Depende de: performance móvil.
  * Criterio de aceptación: accesibilidad y control de sustos.

---

## 24. Priorización por fases

**Descripción corta:** Orden de construcción para lanzar rápido sin perder base técnica.

### MVP obligatorio

* [ ] Plataforma navegable, catálogo, Game Shell, 10 juegos iniciales, SEO básico, wallet mock/server-prepared, store básica, rankings básicos, ads/adblock, analytics, legal mínimo, admin mínimo, anti-copy básico y mobile playable.
  * Prioridad: MVP
  * Depende de: arquitectura base.
  * Criterio de aceptación: soft launch con tráfico limitado puede operar una semana.
* [ ] Juegos MVP recomendados: Golden Rain Zombies, Huevo No Te Quiebres, Break Me, Cell Front Lite, Egg Catch Me, Gravity Dungeon Dash, Trash Fisher, Crazy Panels, Crypt Flap, Barricade in the Night Lite.
  * Prioridad: MVP
  * Depende de: checklists por juego.
  * Criterio de aceptación: 10 juegos live pasan QA mobile.

### Post-MVP inmediato

* [ ] Pagos reales para créditos/cosméticos, más idiomas, más juegos, mejores quests, optimización ads, eventos semanales, skins por temporada, backend completo y anti-cheat avanzado.
  * Prioridad: Post-MVP
  * Depende de: MVP estable, legal.
  * Criterio de aceptación: métricas de MVP guían qué juegos escalar.
* [ ] Añadir Bomb Wars Stickman Lite, Parkour Sky View, Inflation Run y Cardboard Shooter Lite como beta/live progresivo.
  * Prioridad: Post-MVP
  * Depende de: producción de juegos.
  * Criterio de aceptación: cada juego entra primero en beta medible.

### Fase 2

* [ ] Multiplayer en juegos seleccionados, apps independientes para juegos ganadores, temporadas, creator codes, microcreadores, pagos avanzados y Google H5 Ads si aplica.
  * Prioridad: Futuro
  * Depende de: retención, revenue, compliance.
  * Criterio de aceptación: solo se invierte en juegos con señales de GDAU/retry fuertes.

### Fase 3

* [ ] Spin-offs, app Android/iOS, torneos cosméticos, comunidad fuerte, marketplace interno sin cash-out solo si es legalmente seguro y distribución externa tipo CrazyGames/Poki/Newgrounds/itch.io.
  * Prioridad: Futuro
  * Depende de: marca, legal, acuerdos externos.
  * Criterio de aceptación: expansión no rompe economía interna ni anti-copy.

---

## 25. Riesgos principales

**Descripción corta:** Riesgos de producto, legales, técnicos, monetización, UX y SEO que deben gestionarse desde el día uno.

* [ ] Riesgo legal: monedas internas mal entendidas como dinero real.
  * Prioridad: MVP
  * Depende de: legal, copy, UI.
  * Criterio de aceptación: disclaimers consistentes en wallet/store/terms/rewards.
* [ ] Riesgo UX: ads agresivos reducen retención.
  * Prioridad: MVP
  * Depende de: ad cooldown, analytics.
  * Criterio de aceptación: ads solo en pausas naturales y con cap por sesión.
* [ ] Riesgo técnico: juegos copiados o hotlinkeados.
  * Prioridad: MVP
  * Depende de: Game Shell, CSP, WAF, anti-hotlink.
  * Criterio de aceptación: copia externa pierde wallet/rankings/rewards y no puede enviar scores.
* [ ] Riesgo mobile: controles malos destruyen el producto.
  * Prioridad: MVP
  * Depende de: QA dispositivos.
  * Criterio de aceptación: cada juego se valida en Android e iPhone antes de live.
* [ ] Riesgo SEO: contenido duplicado o client-side only.
  * Prioridad: MVP
  * Depende de: SSR/SSG, metadata.
  * Criterio de aceptación: páginas SEO tienen copy único y contenido indexable.
* [ ] Riesgo visual: parecer casino/crypto/template barato.
  * Prioridad: MVP
  * Depende de: design system.
  * Criterio de aceptación: auditoría visual bloquea colores y patrones prohibidos.

---

## 26. Definición de “listo para lanzar”

**Descripción corta:** Criterios mínimos para activar soft launch público con confianza operativa.

* [ ] Home, catálogo, páginas SEO, Game Shell, store, wallet, inventory, rankings, quests, admin y legal funcionan en producción.
  * Prioridad: MVP
  * Depende de: QA soft launch.
  * Criterio de aceptación: cero errores críticos conocidos en flujos principales.
* [ ] 10 juegos MVP son jugables en móvil, tienen score, retry, ranking, analytics, coins server-side/mock server-prepared y ads naturales.
  * Prioridad: MVP
  * Depende de: checklist por juego.
  * Criterio de aceptación: cada juego pasa 20 partidas QA sin softlocks.
* [ ] Adblock permite navegar pero bloquea Play con el mensaje oficial.
  * Prioridad: MVP
  * Depende de: AdsModule, Game Shell.
  * Criterio de aceptación: evento play_blocked_by_adblock registrado.
* [ ] Producción no expone source maps, usa assets con hash, CSP correcta, WAF/rate limit y anti-hotlink.
  * Prioridad: MVP
  * Depende de: seguridad.
  * Criterio de aceptación: checklist anti-copy completado.
* [ ] sitemap.xml, robots.txt, metadata, OG/Twitter cards y contenido SEO por juego/categoría existen.
  * Prioridad: MVP
  * Depende de: SEO.
  * Criterio de aceptación: crawler puede descubrir páginas live.
* [ ] Analytics responde: qué juegos se juegan, dónde mueren usuarios, cuántos retries, cuánto adblock y qué ingresos por red/juego/país.
  * Prioridad: MVP
  * Depende de: AnalyticsModule, AdsModule.
  * Criterio de aceptación: dashboard muestra métricas de soft launch.
* [ ] Equipo tiene runbook de operación: cómo desactivar juego, cambiar ads, revertir reward, revisar bugs y publicar nuevo juego.
  * Prioridad: MVP
  * Depende de: admin, documentación.
  * Criterio de aceptación: una persona no técnica puede seguir el runbook básico.
