# 🚀 SmartFinance AI - Personal Finance Management Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)

Una plataforma completa de gestión financiera personal con inteligencia artificial integrada. Este proyecto demuestra implementación full-stack moderna con funcionalidades de ML/AI reales.

## ✨ Características Principales

### 🤖 Inteligencia Artificial
- **Análisis Financiero con GPT-4**: Insights personalizados sobre tus finanzas
- **Categorización Automática**: Categorización inteligente de transacciones usando NLP
- **Predicción de Gastos**: Algoritmos ML para predecir gastos futuros
- **Chat con IA**: Asistente conversacional para consultas financieras
- **Detección de Anomalías**: Identificación automática de gastos inusuales

### 💰 Gestión Financiera
- **Dashboard Interactivo**: Visualización en tiempo real de finanzas
- **Gestión de Transacciones**: CRUD completo con filtros avanzados
- **Análisis por Categorías**: Gráficos de torta y barras
- **Tendencias Temporales**: Visualización de ingresos/gastos por mes
- **Resúmenes Automáticos**: Balance, ingresos y gastos totales

### 🎨 Interfaz de Usuario
- **Diseño Moderno**: UI/UX con Tailwind CSS
- **Responsive**: 100% adaptable a móviles y tablets
- **Animaciones Fluidas**: Transiciones suaves
- **Dark Mode Ready**: Preparado para modo oscuro

## 🏗️ Arquitectura Técnica

```
SmartFinance AI
├── Frontend (React + TypeScript + Vite)
│   ├── Components (Modular & Reusable)
│   ├── Services (API Integration)
│   ├── Charts (Recharts)
│   └── State Management (React Hooks)
│
├── Backend (Node.js + Express + TypeScript)
│   ├── Controllers (Business Logic)
│   ├── Services (AI/ML Integration)
│   ├── Models (Prisma ORM)
│   ├── Middleware (Auth & Error Handling)
│   └── Routes (RESTful API)
│
└── Database (PostgreSQL)
    └── Prisma Schema (Type-safe queries)
```

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Recharts** - Data Visualization
- **Axios** - HTTP Client
- **React Router** - Navigation
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express** - Web Framework
- **TypeScript** - Type Safety
- **Prisma** - ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **OpenAI API** - AI Integration
- **Bcrypt** - Password Hashing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📦 Instalación y Setup

### Prerequisitos
```bash
- Node.js 18+
- PostgreSQL 15+
- npm o yarn
- OpenAI API Key
```

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tuusuario/smartfinance-ai.git
cd smartfinance-ai
```

### 2. Setup Backend

```bash
cd backend
npm install

# Crear archivo .env
cp .env.example .env
```

Editar `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/smartfinance"
JWT_SECRET="tu-secreto-jwt-super-seguro"
OPENAI_API_KEY="sk-tu-api-key-de-openai"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

```bash
# Generar Prisma Client
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Iniciar servidor
npm run dev
```

Backend corriendo en: `http://localhost:3001`

### 3. Setup Frontend

```bash
cd frontend
npm install

# Crear archivo .env (opcional)
echo "VITE_API_URL=http://localhost:3001/api" > .env

# Iniciar aplicación
npm run dev
```

Frontend corriendo en: `http://localhost:3000`

## 🐳 Docker Setup (Recomendado)

```bash
# Configurar OpenAI API Key
export OPENAI_API_KEY="tu-api-key"

# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

Accede a:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- Database: `localhost:5432`

## 🧪 Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## 📚 API Documentation

### Autenticación

#### POST `/api/auth/register`
Registrar nuevo usuario
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST `/api/auth/login`
Iniciar sesión
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET `/api/auth/profile`
Obtener perfil (requiere token)

### Transacciones

#### GET `/api/transactions`
Listar transacciones (con filtros opcionales)
```
?startDate=2024-01-01&endDate=2024-12-31&category=Food&type=EXPENSE
```

#### POST `/api/transactions`
Crear transacción
```json
{
  "description": "Grocery shopping",
  "amount": 150.50,
  "date": "2024-01-15",
  "type": "EXPENSE"
}
```

#### PUT `/api/transactions/:id`
Actualizar transacción

#### DELETE `/api/transactions/:id`
Eliminar transacción

#### GET `/api/transactions/analytics`
Obtener análisis y estadísticas

### IA Features

#### GET `/api/ai/insights`
Obtener insights financieros con IA

#### GET `/api/ai/predictions`
Obtener predicciones de gastos futuros

#### POST `/api/ai/chat`
Chat con asistente IA
```json
{
  "question": "How can I save more money?"
}
```

## 🎯 Características Técnicas Destacadas

### 1. **Arquitectura Clean Code**
- Separación de responsabilidades
- Controladores, Servicios y Modelos separados
- Middleware reutilizable
- Type-safe en todo el stack

### 2. **Seguridad**
- JWT Authentication
- Password hashing con bcrypt
- Rate limiting
- Helmet.js para headers de seguridad
- CORS configurado
- Validación de entrada

### 3. **Optimización**
- Lazy loading de componentes
- Code splitting
- API caching
- Optimistic UI updates
- Debouncing en búsquedas

### 4. **Machine Learning**
- Linear regression para predicciones
- Detección de anomalías estadísticas
- Categorización con NLP
- Análisis de tendencias

### 5. **UX/UI Excellence**
- Loading states
- Error handling elegante
- Toast notifications
- Smooth animations
- Responsive design

## 📈 Roadmap

- [ ] Múltiples cuentas bancarias
- [ ] Exportación a PDF/Excel
- [ ] Metas de ahorro
- [ ] Recordatorios de pagos
- [ ] Aplicación móvil nativa
- [ ] Integración con bancos (Plaid)
- [ ] Compartir presupuesto familiar
- [ ] OCR para recibos
- [ ] Reportes personalizados

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tuusuario](https://github.com/tuusuario)
- LinkedIn: [Tu Perfil](https://linkedin.com/in/tuperfil)
- Portfolio: [tuportfolio.com](https://tuportfolio.com)

## 🌟 Agradecimientos

- OpenAI por la API de GPT-4
- Comunidad de React y Node.js
- Todos los contribuidores

---

⭐ Si este proyecto te ayudó, considera darle una estrella en GitHub!

## 📸 Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### AI Insights
![AI Insights](screenshots/insights.png)

### Transactions
![Transactions](screenshots/transactions.png)

### Mobile View
![Mobile](screenshots/mobile.png)#   s m a r t f i n a n c e - a i  
 