# Mapa Digital del Comité MIPYMES y Transformación Digital

MVP web para la **Cámara de Comercio Digital de Honduras**: registro de miembros del comité, directorio (sin correo ni WhatsApp en la vista pública), dashboard analítico y panel administrativo. El área interna exige **inicio de sesión con Google** (Auth.js / NextAuth) y que el correo esté **autorizado en base de datos** (`AllowedUser`): sin fila activa no se crea sesión útil (redirección a `/unauthorized`). Los administradores (`role = admin`) gestionan accesos desde `/admin`.

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
| `GOOGLE_CLIENT_ID`       | Credencial OAuth 2.0 de Google Cloud (tipo *Web application*). |
| `GOOGLE_CLIENT_SECRET`   | Secreto del cliente OAuth de Google. |
| `NEXTAUTH_SECRET`        | Secreto para firmar cookies de sesión (p. ej. `openssl rand -base64 32`). También puede usarse `AUTH_SECRET`. |
| `NEXTAUTH_URL`           | URL canónica del sitio (p. ej. `http://localhost:3000` en local, `https://su-dominio.vercel.app` en producción). También puede usarse `AUTH_URL`. |

## Autenticación y autorización (Google + lista blanca)

- **Público:** `/`, `/login`, `/unauthorized`, y rutas de Auth.js bajo `/api/auth/*`.  
- **Miembro autorizado** (`AllowedUser` con `isActive = true`): puede usar `/registro`, `/directorio`, `/dashboard` y `GET/POST /api/members`.  
- **Administrador** (`role = admin` además de activo): incluye `/admin` y las APIs bajo `/api/admin/*` (gestión de accesos y exportación de registros).  
- Sin sesión, el middleware redirige a **`/login`** con `callbackUrl`. Con sesión Google pero **sin** fila activa en `AllowedUser`, el flujo de inicio de sesión redirige a **`/unauthorized`** (no se completa el acceso al área privada).  
- Las APIs vuelven a comprobar el estado en base de datos (no solo el JWT ni el cliente).

### Google Cloud Console

1. Cree un proyecto o use uno existente → **APIs y servicios** → **Credenciales** → **Crear credenciales** → **ID de cliente de OAuth**.  
2. Tipo de aplicación: **Aplicación web**.  
3. **URI de redireccionamiento autorizados:** `https://<NEXTAUTH_URL>/api/auth/callback/google` (sin barra final en `NEXTAUTH_URL`; en local: `http://localhost:3000/api/auth/callback/google`).  
4. Copie **ID de cliente** y **Secreto del cliente** a `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`.

Opcional: restrinja el acceso en la pantalla de consentimiento a usuarios de su dominio (Workspace) cuando pase a producción.

## Checklist de flujo (QA)

1. **Inicio** (`/`): público; hero y CTAs (al pulsar área privada sin sesión → `/login` y retorno con `callbackUrl`).  
2. **Login** (`/login`): “Continuar con Google”; si el correo no está en `AllowedUser` activo → `/unauthorized`. Si está autorizado, redirección a `callbackUrl` o `/directorio`.  
3. **Registro** (`/registro`): requiere miembro autorizado; validación en cliente; `POST /api/members` con cookie de sesión.  
4. **Directorio** (`/directorio`): requiere miembro autorizado; datos desde Prisma en el servidor; filtros en cliente.  
5. **Dashboard** (`/dashboard`): requiere miembro autorizado; métricas desde la base.  
6. **Admin** (`/admin`): requiere **rol admin** en `AllowedUser`; gestión de usuarios autorizados y tabla de registros.  
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

Poblar datos de demostración (8 miembros ficticios, incluido el perfil de Héctor Ballesteros) y asegurar un administrador inicial (`hordhn@gmail.com`):

```bash
npm run db:seed
```

**Orden recomendado:** primero esquema en la base (`db:migrate` / `migrate deploy` o `db:push`), **después** el seed. Si el seed falla con *«The table … AllowedUser does not exist»* (P2021), aún no se aplicó la migración que crea esa tabla.

### Si `migrate deploy` devuelve P3005 (esquema no vacío)

Suele pasar cuando la base ya tenía tablas (p. ej. creadas con `db push`) y Prisma no puede aplicar la primera migración sobre una base “no vacía”.

- **Opción rápida (Neon / dev):** sincronizar el esquema actual y luego seed:

  ```bash
  npx prisma db push
  npm run db:seed
  ```

- **Opción con historial de migraciones:** *baselining* — marcar como ya aplicada la migración inicial que corresponde a lo que ya hay en la base, y luego `npx prisma migrate deploy`. Véase [Baselining](https://www.prisma.io/docs/guides/migrate/developing-with-prisma-migrate/baselining).

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
2. En **Settings → Environment Variables**, agregue `DATABASE_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET` y `NEXTAUTH_URL` (véase `.env.example`).  
3. Use una base PostgreSQL compatible (por ejemplo **Vercel Postgres** o **Neon**).  
4. En el primer despliegue o en una ejecución local contra la misma base, aplique migraciones:

   ```bash
   npx prisma migrate deploy
   ```

5. Ejecute el seed al menos una vez en una base nueva para crear el admin inicial y datos de demostración, o inserte manualmente filas en `AllowedUser` antes de que el primer usuario entre:

   ```bash
   npm run db:seed
   ```

6. Vuelva a desplegar si cambia el esquema Prisma; el `postinstall` ejecuta `prisma generate` en Vercel.

**Nota de seguridad:** el acceso al comité depende de Google OAuth y de la tabla `AllowedUser` en el servidor. Revise periódicamente roles y cuentas inactivas; el panel admin exige rol `admin` en la misma tabla.

## Rutas principales

| Ruta              | Descripción |
|-------------------|-------------|
| `/`               | Landing institucional (**pública**). |
| `/login`          | Acceso con Google; redirige con `callbackUrl` si aplica. |
| `/unauthorized`   | Correo sin acceso habilitado (público). |
| `/registro`       | Formulario (**miembro autorizado**). |
| `/directorio`     | Cards filtrables (**miembro autorizado**). |
| `/dashboard`      | Métricas (**miembro autorizado**). |
| `/admin`          | Gestión de accesos y registros sensibles (**admin**). |

## API

| Método y ruta                    | Uso |
|----------------------------------|-----|
| `GET/POST …/api/auth/*`         | Auth.js (OAuth Google, sesión, cierre de sesión). |
| `GET /api/members`               | Lista (**miembro autorizado**). |
| `POST /api/members`             | Crea un miembro (**miembro autorizado**). |
| `GET /api/admin/members`        | Lista completa de registros (**admin**). |
| `GET/POST/PATCH/DELETE …/api/admin/allowed-users` | CRUD de correos autorizados (**admin**). |

## Licencia y uso

Prototipo institucional; ajuste textos legales y políticas de datos antes de uso formal con información personal.
