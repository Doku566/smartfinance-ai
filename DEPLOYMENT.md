# 🚀 Guía de Deployment - SmartFinance AI

Esta guía cubre el deployment completo del proyecto en diferentes plataformas.

## 📋 Tabla de Contenidos

1. [Deployment Local](#deployment-local)
2. [Deployment con Docker](#deployment-con-docker)
3. [Deployment en Cloud (Vercel + Railway)](#deployment-en-cloud)
4. [Variables de Entorno](#variables-de-entorno)
5. [Troubleshooting](#troubleshooting)

---

## 🏠 Deployment Local

### Prerequisitos
- Node.js 18+
- PostgreSQL 15+
- npm o yarn
- OpenAI API Key

### Paso 1: Clonar y Setup

```bash
# Clonar repositorio
git clone <tu-repo>
cd smartfinance-ai

# Hacer ejecutable el script de setup
chmod +x setup.sh

# Ejecutar setup automático
./setup.sh
```

### Paso 2: Configurar Variables de Entorno

**Backend (.env)**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/smartfinance?schema=public"
JWT_SECRET="tu-secreto-super-seguro-cambiar-en-produccion"
OPENAI_API_KEY="sk-tu-api-key-aqui"
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

**Frontend (.env)** (opcional)
```env
VITE_API_URL=http://localhost:3001/api
```

### Paso 3: Iniciar Base de Datos

```bash
# Si usas PostgreSQL local
createdb smartfinance

# O usa Docker para PostgreSQL
docker run --name smartfinance-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=smartfinance \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### Paso 4: Ejecutar Migraciones

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### Paso 5: Iniciar Servicios

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

✅ Aplicación corriendo en:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

---

## 🐳 Deployment con Docker

La forma más fácil y recomendada para desarrollo y producción.

### Paso 1: Configurar OpenAI Key

```bash
export OPENAI_API_KEY="sk-tu-api-key"
```

### Paso 2: Iniciar con Docker Compose

```bash
# Construir e iniciar todos los servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
```

### Paso 3: Ejecutar Migraciones (primera vez)

```bash
docker-compose exec backend npx prisma migrate deploy
```

### Comandos Útiles Docker

```bash
# Detener servicios
docker-compose down

# Reiniciar servicios
docker-compose restart

# Reconstruir imágenes
docker-compose build

# Ver estado de servicios
docker-compose ps

# Limpiar todo (incluye volúmenes)
docker-compose down -v
```

---

## ☁️ Deployment en Cloud

### Opción 1: Vercel (Frontend) + Railway (Backend + DB)

#### **Backend en Railway**

1. **Crear cuenta en Railway.app**
2. **Nuevo Proyecto → Deploy from GitHub**
3. **Configurar Variables de Entorno:**
   ```
   DATABASE_URL=<railway-postgres-url>
   JWT_SECRET=<generar-secreto-seguro>
   OPENAI_API_KEY=<tu-api-key>
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL=https://tu-app.vercel.app
   ```

4. **Agregar PostgreSQL:**
   - Click en "New" → Database → PostgreSQL
   - Railway genera automáticamente DATABASE_URL

5. **Deploy:**
   - Railway detecta automáticamente Node.js
   - Build command: `npm install && npx prisma generate && npm run build`
   - Start command: `npx prisma migrate deploy && npm start`

#### **Frontend en Vercel**

1. **Importar proyecto desde GitHub**
2. **Configurar Build Settings:**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Variables de Entorno:**
   ```
   VITE_API_URL=https://tu-backend.railway.app/api
   ```

4. **Deploy:** Vercel hace deploy automático

---

### Opción 2: Render (Full Stack)

#### **Base de Datos (PostgreSQL)**
1. New → PostgreSQL
2. Copiar la URL de conexión

#### **Backend (Web Service)**
1. New → Web Service
2. Connect tu repositorio
3. **Settings:**
   - Build Command: `cd backend && npm install && npx prisma generate && npm run build`
   - Start Command: `cd backend && npx prisma migrate deploy && npm start`
   - Environment Variables: (agregar todas las env vars)

#### **Frontend (Static Site)**
1. New → Static Site
2. **Settings:**
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`
   - Environment Variable: `VITE_API_URL=https://tu-backend.onrender.com/api`

---

### Opción 3: AWS (EC2 + RDS)

#### **1. Configurar RDS (PostgreSQL)**
```bash
# Crear instancia RDS PostgreSQL
# Guardar endpoint y credenciales
```

#### **2. Lanzar EC2 Instance**
```bash
# Ubuntu 22.04 LTS
# t2.medium o superior
```

#### **3. Conectar y Setup**
```bash
# SSH a la instancia
ssh -i key.pem ubuntu@ec2-instance-ip

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar Docker (opcional)
sudo apt-get update
sudo apt-get install docker.io docker-compose

# Clonar repositorio
git clone <tu-repo>
cd smartfinance-ai

# Configurar .env con RDS endpoint
# Iniciar con Docker o PM2
```

#### **4. Configurar Nginx**
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
    }
}
```

#### **5. SSL con Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

---

## 🔐 Variables de Entorno

### Backend Variables

| Variable | Descripción | Ejemplo | Requerido |
|----------|-------------|---------|-----------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` | ✅ |
| `JWT_SECRET` | Secret para JWT tokens | `super-secret-key-123` | ✅ |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` | ✅ |
| `PORT` | Puerto del servidor | `3001` | ❌ |
| `NODE_ENV` | Entorno | `production` | ❌ |
| `FRONTEND_URL` | URL del frontend (CORS) | `https://app.com` | ✅ |

### Frontend Variables

| Variable | Descripción | Ejemplo | Requerido |
|----------|-------------|---------|-----------|
| `VITE_API_URL` | URL del backend API | `https://api.app.com/api` | ✅ |

### Generar JWT Secret Seguro

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# OpenSSL
openssl rand -hex 64
```

---

## 🔧 Troubleshooting

### Error: "Cannot connect to database"

**Solución:**
```bash
# Verificar que PostgreSQL esté corriendo
docker ps  # o
sudo systemctl status postgresql

# Verificar DATABASE_URL en .env
# Asegúrate que el formato sea correcto
```

### Error: "OpenAI API key not found"

**Solución:**
```bash
# Asegúrate de tener OPENAI_API_KEY en .env
# Para Docker:
export OPENAI_API_KEY="tu-key"
docker-compose up -d
```

### Error: "Port already in use"

**Solución:**
```bash
# Cambiar puerto en .env o matar proceso
lsof -ti:3001 | xargs kill -9  # Backend
lsof -ti:3000 | xargs kill -9  # Frontend
```

### Error: "Prisma Client not generated"

**Solución:**
```bash
cd backend
npx prisma generate
npm run dev
```

### Frontend no se conecta al Backend

**Solución:**
1. Verificar CORS en backend (FRONTEND_URL)
2. Verificar VITE_API_URL en frontend
3. Verificar que ambos servicios estén corriendo
4. Revisar console del navegador para errores específicos

### Errores de TypeScript

**Solución:**
```bash
# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar tsconfig.json
```

---

## 📊 Monitoreo en Producción

### Logs con Docker

```bash
# Ver todos los logs
docker-compose logs -f

# Logs específicos con timestamps
docker-compose logs -f --timestamps backend

# Últimas 100 líneas
docker-compose logs --tail=100 backend
```

### Health Checks

**Endpoint:** `GET /health`

```bash
curl http://localhost:3001/health
# Response: {"status":"OK","timestamp":"..."}
```

### Monitoreo de Base de Datos

```bash
# Conectar a Prisma Studio
cd backend
npx prisma studio

# O conectar directamente
psql $DATABASE_URL
```

---

## 🎯 Checklist Pre-Deployment

- [ ] Todas las variables de entorno configuradas
- [ ] JWT_SECRET es único y seguro
- [ ] OpenAI API Key válida
- [ ] Base de datos accesible
- [ ] Migraciones ejecutadas
- [ ] CORS configurado correctamente
- [ ] SSL/HTTPS configurado (producción)
- [ ] Backup de base de datos configurado
- [ ] Logs configurados
- [ ] Health checks funcionando

---

## 🆘 Soporte

Si encuentras problemas:

1. Revisa los logs: `docker-compose logs -f`
2. Verifica las variables de entorno
3. Consulta la sección de Troubleshooting
4. Abre un issue en GitHub

---

**¡Listo para deploy! 🚀**