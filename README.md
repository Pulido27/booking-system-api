# Booking System API

Sistema de reservas y gestión de citas con autenticación basada en roles, diseñado para proveedores de servicios (barberos, dentistas, consultores, etc.).

Desarrollado como proyecto de aprendizaje para demostrar arquitectura backend profesional con TypeScript, Prisma ORM y PostgreSQL.

## Características principales

- **Autenticación JWT** con tres roles: Admin, Provider y Client
- **Gestión de servicios** con precios y duraciones configurables
- **Sistema de disponibilidad** mediante bloques de tiempo (TimeSlots)
- **Reservas inteligentes** que previenen conflictos de horario automáticamente
- **Estados de citas** (Pendiente → Confirmada → Completada/Cancelada)
- **Validaciones robustas** con Zod en toda la API
- **Documentación interactiva** con Swagger UI

## Stack técnico

- **Runtime:** Node.js 20 LTS
- **Lenguaje:** TypeScript 5.9 (modo estricto)
- **Framework:** Express 5
- **Base de datos:** PostgreSQL
- **ORM:** Prisma 7 con adapters
- **Validación:** Zod
- **Autenticación:** JWT + Bcrypt
- **Logging:** Pino
- **Documentación:** Swagger

## Estructura del proyecto
```
src/
├── config/          # Configuración (env, logger)
├── lib/             # Cliente Prisma con adapter
├── middlewares/     # Auth, roles, manejo de errores
├── modules/         # Arquitectura por dominio
│   ├── auth/        # Registro, login
│   ├── services/    # CRUD de servicios
│   ├── timeslots/   # Disponibilidad
│   └── appointments/# Sistema de reservas
├── utils/           # Errores custom, helpers
├── app.ts           # Configuración Express
└── server.ts        # Punto de entrada
```

## Instalación

### Requisitos previos

- Node.js >= 20.20.0
- PostgreSQL >= 14
- npm o yarn

### Pasos

1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/booking-system-api.git
cd booking-system-api
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

4. Ejecutar migraciones
```bash
npx prisma migrate dev
```

5. Iniciar servidor
```bash
npm run dev
```

El servidor estará corriendo en `http://localhost:3000`

## 📚 Documentación de la API

Accede a Swagger UI en:
```
http://localhost:3000/api-docs
```

### Endpoints principales

#### Autenticación
- `POST /api/v1/auth/register` - Registro de usuarios
- `POST /api/v1/auth/login` - Iniciar sesión
- `GET /api/v1/auth/me` - Usuario actual (protegido)

#### Servicios
- `GET /api/v1/services` - Listar servicios (público)
- `POST /api/v1/services` - Crear servicio (Provider/Admin)
- `PUT /api/v1/services/:id` - Actualizar servicio
- `DELETE /api/v1/services/:id` - Eliminar servicio (Admin)

#### Disponibilidad (TimeSlots)
- `GET /api/v1/timeslots` - Listar disponibilidad (público)
- `GET /api/v1/timeslots/provider/:id` - Por provider
- `POST /api/v1/timeslots` - Crear disponibilidad (Provider/Admin)
- `DELETE /api/v1/timeslots/:id` - Eliminar slot

#### Citas (Appointments)
- `POST /api/v1/appointments` - Reservar cita (Client)
- `GET /api/v1/appointments` - Mis citas (filtrado por rol)
- `PATCH /api/v1/appointments/:id` - Actualizar estado
- `DELETE /api/v1/appointments/:id` - Cancelar cita

## 🔐 Roles y permisos

### CLIENT
- Ver catálogo de servicios y disponibilidad
- Crear reservas
- Ver y cancelar sus propias citas

### PROVIDER
- Crear y gestionar servicios
- Definir disponibilidad (TimeSlots)
- Ver y gestionar citas de sus servicios
- Confirmar/completar citas

### ADMIN
- Acceso completo al sistema
- Gestionar usuarios, servicios y citas
- Eliminar cualquier recurso

## 🧪 Ejemplo de uso

### 1. Registrar un provider
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "barbero@example.com",
    "password": "password123",
    "name": "Juan Barbero",
    "role": "PROVIDER"
  }'
```

### 2. Crear un servicio
```bash
curl -X POST http://localhost:3000/api/v1/services \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "name": "Corte de cabello",
    "description": "Corte profesional",
    "price": 200,
    "duration": 30
  }'
```

### 3. Definir disponibilidad
```bash
curl -X POST http://localhost:3000/api/v1/timeslots \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "startTime": "2026-02-20T09:00:00Z",
    "endTime": "2026-02-20T18:00:00Z"
  }'
```

### 4. Reservar una cita (como cliente)
```bash
curl -X POST http://localhost:3000/api/v1/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token_cliente}" \
  -d '{
    "serviceId": "{id_servicio}",
    "timeSlotId": "{id_slot}",
    "appointmentTime": "2026-02-20T10:00:00Z"
  }'
```

## 🤝 Contribuciones

Este es un proyecto de aprendizaje personal. Sugerencias y feedback son bienvenidos a través de issues.

## 📝 Licencia

MIT
---

**¿Por qué este proyecto?**

Este proyecto me permitió profundizar en:
- TypeScript estricto y tipado avanzado
- Prisma ORM (versión 7 con adapters)
- Arquitectura escalable por dominios
- Validaciones complejas de lógica de negocio
- Manejo de relaciones en bases de datos
- Autenticación y autorización basada en roles