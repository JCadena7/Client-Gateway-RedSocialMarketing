<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

<h1 align="center">🚀 RedSocialMarketing — Backend Microservicios</h1>

<p align="center">
  Backend distribuido basado en arquitectura de <strong>microservicios</strong>, construido con <strong>NestJS</strong>, <strong>PostgreSQL</strong> y <strong>Docker</strong>, aplicando <strong>Arquitectura Limpia</strong> y patrones de diseño modernos.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm"/>
</p>

---

## 📐 Arquitectura General

El sistema está compuesto por un **Client Gateway** que actúa como punto de entrada único (API Gateway pattern) y múltiples microservicios independientes que se comunican entre sí de forma desacoplada.

```
                        ┌─────────────────────────┐
                        │       CLIENT / HTTP      │
                        └────────────┬────────────┘
                                     │
                        ┌────────────▼────────────┐
                        │      CLIENT GATEWAY      │
                        │  (API Gateway / Proxy)   │
                        └──┬──────┬──────┬──────┬──┘
                           │      │      │      │
              ┌────────────▼─┐ ┌──▼───┐ ┌▼────┐ ┌▼──────────┐  ┌──────────┐
              │   auth-ms    │ │user  │ │post │ │comment-ms │  │categoria │
              │              │ │  -ms │ │ -ms │ │           │  │    -ms   │
              └──────────────┘ └──────┘ └─────┘ └───────────┘  └──────────┘
                    │               │        │          │              │
              ┌─────▼───────────────▼────────▼──────────▼──────────────▼──┐
              │                   PostgreSQL (por MS)                       │
              └─────────────────────────────────────────────────────────────┘
```

---

## 📦 Repositorios de Microservicios

| Servicio | Descripción | Repositorio |
|---|---|---|
| 🌐 **Client Gateway** | Punto de entrada, enrutamiento y validación | [client-gateway](https://github.com/JCadena7/Client-Gateway-RedSocialMarketing) |
| 🔐 **auth-ms** | Autenticación y autorización (JWT) | [auth-ms](https://github.com/JCadena7/auth-ms) |
| 👤 **user-ms** | Gestión de usuarios y perfiles | [user-ms](https://github.com/JCadena7/user-ms) |
| 📝 **post-ms** | Publicaciones y contenido | [post-ms](https://github.com/JCadena7/post-ms) |
| 💬 **comment-ms** | Comentarios en publicaciones | [comment-ms](https://github.com/JCadena7/comment-ms) |
| 🏷️ **categoria-ms** | Categorías y etiquetado de contenido | [categoria-ms](https://github.com/JCadena7/Categoria-MS-RedSocialMarketing) |

---

## 🧱 Stack Tecnológico

- **Framework:** [NestJS](https://nestjs.com/) con TypeScript
- **Base de datos:** PostgreSQL (instancia por microservicio)
- **ORM:** TypeORM / Prisma
- **Comunicación entre MS:** TCP (NestJS Microservices Transport)
- **Contenedores:** Docker + Docker Compose
- **Gestor de paquetes:** pnpm
- **Patrones aplicados:**
  - Clean Architecture (capas: domain, application, infrastructure)
  - Repository Pattern
  - DTO (Data Transfer Objects)
  - Gateway Pattern (API Gateway)
  - Dependency Injection

---

## 🚀 Levantar el proyecto completo

### Pre-requisitos

- [Docker](https://www.docker.com/) y Docker Compose instalados
- [pnpm](https://pnpm.io/) instalado globalmente
- Node.js >= 18

### 1. Clonar todos los repositorios

```bash
# Client Gateway
git clone https://github.com/JCadena7/Client-Gateway-RedSocialMarketing

# Microservicios
git clone https://github.com/JCadena7/auth-ms
git clone https://github.com/JCadena7/user-ms
git clone https://github.com/JCadena7/post-ms
git clone https://github.com/JCadena7/comment-ms
git clone https://github.com/JCadena7/Categoria-MS-RedSocialMarketing
```

### 2. Configurar variables de entorno

Cada microservicio tiene su propio archivo `.env`. Copia el `.env.example` en cada repositorio:

```bash
cp .env.example .env
```

Variables comunes a configurar:

```env
# Base de datos
DATABASE_URL=postgresql://user:password@localhost:5432/nombre_db

# Puerto del servicio
PORT=3000

# JWT (auth-ms y client-gateway)
JWT_SECRET=tu_secreto_super_seguro

# Comunicación entre MS (TCP)
MS_HOST=localhost
MS_PORT=3001
```

### 3. Levantar con Docker Compose

```bash
docker-compose up --build
```

### 4. Levantar en modo desarrollo (individual)

```bash
pnpm install
pnpm run start:dev
```

---

## 📂 Estructura de cada Microservicio (Clean Architecture)

```
src/
├── domain/                  # Entidades y contratos (interfaces)
│   ├── entities/
│   └── repositories/
├── application/             # Casos de uso / lógica de negocio
│   ├── use-cases/
│   └── dtos/
├── infrastructure/          # Implementaciones concretas
│   ├── database/
│   ├── repositories/
│   └── mappers/
└── presentation/            # Controllers, Guards, Interceptors
    ├── controllers/
    └── guards/
```

---

## 🧪 Tests

```bash
# Unit tests
pnpm run test

# e2e tests
pnpm run test:e2e

# Cobertura
pnpm run test:cov
```

---

## 🐳 Docker

Cada microservicio incluye su propio `Dockerfile` y el proyecto cuenta con un `docker-compose.yml` raíz para orquestar todos los servicios.

```bash
# Construir imágenes
docker-compose build

# Levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

---

## 👨‍💻 Autor

**JCadena7**

- GitHub: [@JCadena7](https://github.com/JCadena7)

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**.
