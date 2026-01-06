# 🚀 Guía de Despliegue en Railway.app

## 📋 Pre-requisitos

1. Cuenta en [Railway.app](https://railway.app)
2. Repositorio Git (GitHub, GitLab, etc.)
3. Railway CLI instalado (opcional): `npm i -g @railway/cli`

## 🔧 Configuración del Backend (API)

### Paso 1: Crear Proyecto en Railway

1. Accede a [Railway Dashboard](https://railway.app/dashboard)
2. Click en **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Autoriza Railway y selecciona tu repositorio

### Paso 2: Agregar PostgreSQL

1. En tu proyecto, click **"+ New"**
2. Selecciona **"Database"** → **"PostgreSQL"**
3. Railway creará automáticamente las variables:
   - `PGHOST`
   - `PGPORT`
   - `PGUSER`
   - `PGPASSWORD`
   - `PGDATABASE`
   - `DATABASE_URL`

### Paso 3: Agregar Redis

1. Click **"+ New"** nuevamente
2. Selecciona **"Database"** → **"Redis"**
3. Railway creará automáticamente:
   - `REDIS_HOST`
   - `REDIS_PORT`
   - `REDIS_PASSWORD`
   - `REDIS_URL`

### Paso 4: Configurar el Servicio Backend

1. Selecciona el servicio de tu aplicación
2. Ve a **"Settings"**:
   - **Root Directory**: `api`
   - **Builder**: Docker
   - **Dockerfile Path**: `Dockerfile.railway`

3. Ve a **"Variables"** y agrega:

```bash
# JWT Secrets (IMPORTANTE: usa valores seguros)
JWT_SECRET=genera_un_secreto_largo_y_aleatorio_minimo_32_caracteres
REFRESH_TOKEN_SECRET=otro_secreto_diferente_tambien_largo_y_aleatorio

# Frontend URL (se configurará después)
FRONTEND_URL=https://tu-frontend.railway.app

# Email Configuration
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USER=apikey
MAIL_PASS=tu_api_key_de_sendgrid

# Rate Limiting
THROTTLE_TTL=60000
THROTTLE_LIMIT=100

# Database (Railway las proporciona automáticamente)
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_NAME=${{Postgres.PGDATABASE}}

# Redis (Railway las proporciona automáticamente)
REDIS_HOST=${{Redis.REDIS_HOST}}
REDIS_PORT=${{Redis.REDIS_PORT}}
REDIS_PASSWORD=${{Redis.REDIS_PASSWORD}}
```

**Nota**: Railway permite referenciar variables de otros servicios usando `${{ServiceName.VARIABLE}}`

### Paso 5: Configurar Dominio

1. En **"Settings"** → **"Networking"**
2. Railway genera un dominio automático: `https://tu-api-production.up.railway.app`
3. (Opcional) Puedes agregar un dominio custom

## 🌐 Configuración del Frontend

### Paso 1: Agregar Servicio Frontend

1. Click **"+ New"** → **"GitHub Repo"**
2. Selecciona el mismo repositorio
3. En **"Settings"**:
   - **Root Directory**: `front`
   - **Builder**: Dockerfile (o Nixpacks si no tienes Dockerfile)
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `pnpm preview` (o usar servidor estático)

### Paso 2: Variables del Frontend

```bash
# API URL (usar el dominio del backend)
VITE_API_URL=https://tu-api-production.up.railway.app
```

### Paso 3: Actualizar CORS en Backend

Vuelve al servicio backend y actualiza `FRONTEND_URL`:

```bash
FRONTEND_URL=https://tu-frontend-production.up.railway.app
```

## 🔄 Proceso de Despliegue

### Despliegue Automático

Railway desplegará automáticamente cuando:
- Hagas push a la rama principal
- Detecte cambios en el repositorio

### Despliegue Manual

Usando Railway CLI:

```bash
# Instalar CLI
npm i -g @railway/cli

# Login
railway login

# Vincular proyecto
railway link

# Desplegar
railway up
```

## ✅ Verificación Post-Despliegue

### 1. Revisar Logs

```bash
# En Railway Dashboard
Selecciona servicio → "Deployments" → Click en deployment → Ver logs

# O con CLI
railway logs
```

### 2. Verificar Migraciones

Las migraciones se ejecutan automáticamente en el `CMD` del Dockerfile:
```bash
pnpm migration:run && node dist/main
```

### 3. Probar Endpoints

```bash
# Health check
curl https://tu-api-production.up.railway.app/api/v1/health

# Swagger docs
https://tu-api-production.up.railway.app/api/v1/docs
```

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

1. Verifica que las variables de PostgreSQL están correctamente referenciadas
2. Revisa que el servicio de Postgres esté activo
3. Chequea los logs: `railway logs`

### Error: "Port already in use"

Railway asigna el puerto automáticamente en `process.env.PORT`. Verifica que tu aplicación use:
```typescript
await app.listen(process.env.PORT ?? 3000);
```

### Migraciones no se ejecutan

Si las migraciones fallan, puedes ejecutarlas manualmente:

```bash
# Conectarse al servicio
railway run bash

# Ejecutar migraciones
pnpm migration:run
```

### Error en pdfmake/fonts

Si falta la carpeta de fuentes, agrega al Dockerfile.railway:
```dockerfile
COPY --from=builder /app/node_modules/pdfmake ./node_modules/pdfmake
```

## 📊 Monitoreo

Railway proporciona:
- **Métricas**: CPU, RAM, Network
- **Logs en tiempo real**
- **Alertas** (en planes pagos)

## 💰 Costos

- **Plan Free**: $5 USD de crédito mensual gratis
- **Plan Pro**: $20 USD/mes con más recursos

Recursos del plan free:
- 512MB RAM
- 1GB Disco
- Shared CPU

## 🔐 Seguridad

1. **Nunca** commitear archivos `.env`
2. Usar **secrets** seguros para JWT
3. Activar **CORS** solo para dominios específicos
4. Considerar **rate limiting** en producción

## 📚 Referencias

- [Railway Docs](https://docs.railway.app/)
- [Railway Templates](https://railway.app/templates)
- [Railway Discord](https://discord.gg/railway)

## 🎯 Checklist de Despliegue

- [ ] PostgreSQL service creado
- [ ] Redis service creado
- [ ] Variables de entorno configuradas
- [ ] JWT_SECRET y REFRESH_TOKEN_SECRET únicos y seguros
- [ ] FRONTEND_URL actualizado
- [ ] CORS configurado correctamente
- [ ] Migraciones ejecutándose correctamente
- [ ] Health endpoint respondiendo
- [ ] Swagger docs accesibles
- [ ] Frontend conectado al backend
- [ ] PDFs generándose correctamente
