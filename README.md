# Mapa Digital del Comité MIPYMES y Transformación Digital

MVP web para la **Cámara de Comercio Digital de Honduras**: registro de miembros del comité, directorio (sin correo ni WhatsApp en la vista pública), dashboard analítico y panel administrativo. El área interna exige **inicio de sesión con Google** (Auth.js / NextAuth); `/admin` mantiene además el **PIN** (`ADMIN_PIN`) en el flujo actual.

## Stack

- Next.js (App Router) + TypeScript  
- Tailwind CSS v4  
- Prisma ORM + PostgreSQL  
- **Auth.js (next-auth v5)** — proveedor Google, sesión JWT  

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
| `GOOGLE_CLIENT_ID`       | Credencial OAuth 2.0 de Google Cloud (tipo *Web application*). |
| `GOOGLE_CLIENT_SECRET`   | Secreto del cliente OAuth de Google. |
| `NEXTAUTH_SECRET`        | Secreto para firmar cookies de sesión (p. ej. `openssl rand -base64 32`). También puede usarse `AUTH_SECRET`. |
| `NEXTAUTH_URL`           | URL canónica del sitio (p. ej. `http://localhost:3000` en local, `https://su-dominio.vercel.app` en producción). También puede usarse `AUTH_URL`. |

## Autenticación (Google)

- **Público:** solo `/` (inicio).  
- **Privado (requiere sesión Google):** `/registro`, `/directorio`, `/dashboard`, `/admin`, y las APIs `GET/POST /api/members`, `GET /api/admin/members`, `POST /api/admin/verify`.  
- Sin sesión, el middleware redirige a **`/login`** con `callbackUrl` para volver a la ruta solicitada tras autenticarse.  
- **`/admin`:** además del login Google, el panel sigue pidiendo el **PIN** en cliente (`localStorage` + header `x-admin-pin`) como antes.

### Google Cloud Console

1. Cree un proyecto o use uno existente → **APIs y servicios** → **Credenciales** → **Crear credenciales** → **ID de cliente de OAuth**.  
2. Tipo de aplicación: **Aplicación web**.  
3. **URI de redireccionamiento autorizados:** `https://<NEXTAUTH_URL>/api/auth/callback/google` (sin barra final en `NEXTAUTH_URL`; en local: `http://localhost:3000/api/auth/callback/google`).  
4. Copie **ID de cliente** y **Secreto del cliente** a `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`.

Opcional: restrinja el acceso en la pantalla de consentimiento a usuarios de su dominio (Workspace) cuando pase a producción.

## Checklist de flujo (QA)

1. **Inicio** (`/`): público; hero y CTAs (al pulsar área privada sin sesión → `/login` y retorno con `callbackUrl`).  
2. **Login** (`/login`): “Continuar con Google”; tras éxito, redirección a `callbackUrl` o `/directorio`.  
3. **Registro** (`/registro`): requiere Google; validación en cliente; `POST /api/members` con cookie de sesión.  
4. **Directorio** (`/directorio`): requiere Google; datos desde Prisma en el servidor; filtros en cliente.  
5. **Dashboard** (`/dashboard`): requiere Google; métricas desde la base.  
6. **Admin** (`/admin`): requiere Google **y** PIN correcto → `localStorage` + `GET /api/admin/members` con header `x-admin-pin` (igual a `ADMIN_PIN` en el servidor).  
7. **Cerrar sesión:** botón en el encabezado (desktop y móvil) → vuelve a `/`.

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
2. En **Settings → Environment Variables**, agregue `DATABASE_URL`, `ADMIN_PIN`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET` y `NEXTAUTH_URL` (véase `.env.example`).  
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

**Nota de seguridad:** la sesión con Google protege el área del comité en este MVP. El PIN de `/admin` sigue siendo un segundo factor ligero; para producción real conviene roles, auditoría y almacenamiento seguro del PIN fuera del cliente.

## Rutas principales

| Ruta            | Descripción |
|-----------------|-------------|
| `/`             | Landing institucional (**pública**). |
| `/login`        | Acceso con Google; redirige con `callbackUrl` si aplica. |
| `/registro`     | Formulario y validación (**requiere Google**). |
| `/directorio`   | Cards filtrables (**requiere Google**). |
| `/dashboard`    | Métricas (**requiere Google**). |
| `/admin`        | Tabla sensible (**Google + PIN** + `localStorage` para el PIN). |

## API

| Método y ruta            | Uso |
|--------------------------|-----|
| `GET/POST …/api/auth/*`  | Auth.js (OAuth Google, sesión, cierre de sesión). |
| `GET /api/members`       | Lista para directorio (**requiere sesión Google**). |
| `POST /api/members`      | Crea un miembro (**requiere sesión Google**). |
| `POST /api/admin/verify` | Cuerpo `{ "pin": "..." }` — valida `ADMIN_PIN` (**requiere sesión Google**). |
| `GET /api/admin/members` | Lista completa; header `x-admin-pin` + sesión Google. |

## Licencia y uso

Prototipo institucional; ajuste textos legales y políticas de datos antes de uso formal con información personal.
