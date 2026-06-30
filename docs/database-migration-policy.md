# Política de migraciones y rollback de LezGamez

Esta política aplica a `apps/api/prisma/migrations` y a cualquier cambio de esquema de PostgreSQL.

## Reglas obligatorias

1. Nunca editar una migración que ya fue aplicada en `main` o producción.
2. Todo cambio de schema debe generar una migración nueva.
3. Toda migración debe pasar contra PostgreSQL real en CI.
4. El seed debe ser idempotente: correrlo dos veces no debe duplicar datos.
5. Las tablas financieras o de auditoría nunca se borran sin plan de migración de datos.
6. Los cambios destructivos requieren una migración en dos pasos.

## Cambios no destructivos permitidos

- Crear tablas nuevas.
- Crear índices nuevos.
- Crear columnas nullable.
- Crear enums nuevos.
- Agregar relaciones opcionales.
- Crear tablas de histórico o auditoría.

## Cambios destructivos

Todo cambio destructivo requiere plan explícito en el PR:

- Borrar columnas.
- Renombrar columnas.
- Cambiar tipos de datos.
- Cambiar claves únicas.
- Borrar tablas.
- Convertir columna nullable en required.

## Estrategia de migración en dos pasos

Para cambios riesgosos:

1. Agregar nueva estructura sin borrar la anterior.
2. Hacer backfill de datos.
3. Desplegar código que escriba en ambas estructuras si hace falta.
4. Validar métricas y logs.
5. En otro PR, retirar estructura anterior.

## Rollback

Prisma no genera rollback automático para producción. El rollback recomendado es:

1. Revertir el código que depende del nuevo schema.
2. Mantener la DB compatible hacia atrás cuando sea posible.
3. Crear una migración correctiva hacia adelante si el schema ya fue aplicado.
4. Restaurar backup solo en incidentes severos y con ventana de mantenimiento.

## Backups

Antes de aplicar migraciones productivas:

- Tomar backup de PostgreSQL.
- Registrar commit SHA desplegado.
- Registrar timestamp de inicio y fin.
- Verificar migración en staging.

## CI requerido

El workflow `API DB Validation` debe validar:

- `prisma generate`.
- `prisma migrate deploy` contra PostgreSQL real.
- `prisma db seed` una vez.
- `prisma db seed` una segunda vez para validar idempotencia.
- `typecheck` de API.
- `build` de API.

## Reward caps

`RewardCap` debe ser diario. La clave única correcta es:

```txt
userId + gameSlug + capDate
```

Esto evita que un cap global bloquee rewards de días futuros y permite auditoría diaria.

## Leaderboards

Los rankings se guardan en `LeaderboardEntry` por período:

```txt
daily
weekly
all_time
```

Cada entrada usa:

```txt
userId + gameSlug + period + periodStart
```

Esto permite consultar rankings rápidos sin recalcular siempre desde `Score` cuando el volumen crezca.
