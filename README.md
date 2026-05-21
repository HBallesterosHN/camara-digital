# Mapa Digital del Comité MIPYMES y Transformación Digital

MVP web para la **Cámara de Comercio Digital de Honduras**: registro de miembros del comité, directorio público (sin correo ni WhatsApp), dashboard analítico y panel administrativo con PIN.

## Stack

- Next.js (App Router) + TypeScript  
- Tailwind CSS v4  
- Prisma ORM + PostgreSQL  

## Requisitos

- Node.js 20+ recomendado  
- PostgreSQL 14+ (local o servicio administrado: Neon, Supabase, Vercel Postgres, Railway, etc.)

## Instalación

```bash
npm install
```

Copie variables de entorno:

```bash
cp .env.example .env
```

Edite `.env` y defina al menos:

| Variable                 | Descripción |
|--------------------------|-------------|
| `DATABASE_URL`           | Cadena PostgreSQL (`postgresql://…`) o Prisma Accelerate (`prisma+postgres://…`). |
| `DATABASE_URL_DIRECT`    | **Opcional.** URL `postgresql://…` al mismo origen. Solo se usa cuando `DATABASE_URL` comienza por `prisma+` (Accelerate): el cliente y el seed conectan por la URL directa. Si su `DATABASE_URL` ya es `postgresql://` (Neon estándar), **no** hace falta esta variable (y no la mezcle salvo que use Accelerate). |
| `ADMIN_PIN`              | **Obligatorio** para `/admin` y las rutas `POST /api/admin/verify` y `GET /api/admin/members`. Si falta o está vacío, el servidor responde `503` con un mensaje explícito (no use PIN vacío en producción). |

## Checklist de flujo (QA)

1. **Inicio** (`/`): hero, CTAs a registro y directorio, secciones de fases y beneficios.  
2. **Registro** (`/registro`): validación en cliente; al enviar, `POST /api/members` persiste en PostgreSQL.  
3. **Directorio** (`/directorio`): datos desde Prisma en el servidor; filtros en cliente; contador de resultados.  
4. **Dashboard** (`/dashboard`): métricas y barras con los mismos datos de la base.  
5. **Admin** (`/admin`): PIN correcto → `localStorage` + lista vía `GET /api/admin/members` con header `x-admin-pin` (valor igual a `ADMIN_PIN` en el servidor, espacios ignorados al comparar).

## Base de datos

Generar el cliente de Prisma:

```bash
npm run db:generate
```

Aplicar migraciones (recomendado para entornos persistentes):

```bash
npm run db:migrate
```

Alternativa rápida en desarrollo (sincroniza el esquema sin historial de migraciones):

```bash
npm run db:push
```

Poblar datos de demostración (8 miembros ficticios, incluido el perfil de Héctor Ballesteros):

```bash
npm run db:seed
```

Explorar datos con Prisma Studio:

```bash
npm run db:studio
```

### Prisma Accelerate y desarrollo local

Si `DATABASE_URL` usa **Prisma Accelerate** (`prisma+postgres://…`), las consultas salen por HTTP hacia el servicio de Prisma. En algunos equipos o redes puede aparecer **P5010** (*Cannot fetch data from service* / *fetch failed*) al abrir `/directorio`, `/dashboard` o al ejecutar el seed.

**Solución:** en `.env`, agregue `DATABASE_URL_DIRECT` con la cadena **postgresql://…** que ofrece el mismo proveedor (Neon: *connection string* estándar; Supabase: *URI* en modo sesión o directo). No elimine `DATABASE_URL` si la usa Vercel para producción: en local, con ambas variables, este proyecto **solo** sustituye la URL en el cliente cuando `DATABASE_URL` comienza por `prisma+` (no afecta si ya usa solo `postgresql://`).

Si `DATABASE_URL` es **únicamente** `postgresql://…` (Neon sin Accelerate), no defina `DATABASE_URL_DIRECT` salvo que también use una URL `prisma+` en la misma base.

En `/directorio` y `/dashboard`, si la base sigue sin responder, verá un aviso institucional con estos pasos en lugar de la pantalla genérica de error de Next.js.

## Desarrollo

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) (u otro puerto si el 3000 está ocupado).

## Producción

```bash
npm run build
npm start
```

El script `build` ejecuta `prisma generate` antes de `next build` para que el cliente Prisma exista en despliegues limpios.

## Despliegue en Vercel

1. Cree un proyecto en [Vercel](https://vercel.com) apuntando a este repositorio.  
2. En **Settings → Environment Variables**, agregue `DATABASE_URL` y `ADMIN_PIN` (y cualquier otra variable de `.env.example`).  
3. Use una base PostgreSQL compatible (por ejemplo **Vercel Postgres** o **Neon**).  
4. En el primer despliegue o en una ejecución local contra la misma base, aplique migraciones:

   ```bash
   npx prisma migrate deploy
   ```

5. Opcional: ejecute el seed en la base de producción solo si desea datos de demostración:

   ```bash
   npm run db:seed
   ```

6. Vuelva a desplegar si cambia el esquema Prisma; el `postinstall` ejecuta `prisma generate` en Vercel.

**Nota de seguridad:** el acceso `/admin` con PIN y `localStorage` es solo para prototipo. Para producción real se requiere autenticación robusta, roles y auditoría.

## Rutas principales

| Ruta            | Descripción                                      |
|-----------------|--------------------------------------------------|
| `/`             | Landing institucional.                           |
| `/registro`     | Formulario completo y validación en cliente.   |
| `/directorio`   | Cards filtrables (vista pública).                |
| `/dashboard`    | Métricas y barras simples en Tailwind.           |
| `/admin`        | Tabla con datos sensibles; PIN + `localStorage`. |

## API

| Método y ruta            | Uso |
|--------------------------|-----|
| `GET /api/members`       | Lista pública para integraciones (mismos campos que el directorio). |
| `POST /api/members`      | Crea un miembro (validación en servidor). |
| `POST /api/admin/verify` | Cuerpo `{ "pin": "..." }` — valida `ADMIN_PIN`. |
| `GET /api/admin/members` | Lista completa; header `x-admin-pin` igual a `ADMIN_PIN`. |

## Licencia y uso

Prototipo institucional; ajuste textos legales y políticas de datos antes de uso formal con información personal.
