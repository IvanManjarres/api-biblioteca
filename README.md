# BookNest — API Biblioteca

> API REST para la gestión de una biblioteca: libros, usuarios y préstamos.

**Asignatura:** Desarrollo Web Ágil
**Universidad del Magdalena — Ingeniería de Sistemas — 2026-1**
**Profesor:** Ing. Carlos Oliveros

---

## Equipo

| Nombre | Rol |
|--------|-----|
| César Benítez | Scrum Master / Scrum Dev |
| Rodrigo Venegas | Product Owner |
| Iván Manjarres | Scrum Dev |
| Víctor Romero | Scrum Dev |

---

## Descripción

BookNest es una aplicación web diseñada para gestionar de manera sencilla los recursos de una biblioteca. El sistema permite registrar y consultar libros, administrar usuarios y controlar préstamos y devoluciones mediante una plataforma centralizada con interfaz web y API REST.

---

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Runtime | Node.js |
| Framework | Express.js 5 |
| ORM | Sequelize 6 |
| Base de datos | SQL Server 2022 |
| Driver BD | Tedious |
| Frontend | HTML5 + CSS3 + JavaScript vanilla |

---

## Requisitos previos

- **Node.js** v18 o superior
- **SQL Server 2022** accesible en la red local
- **npm** (incluido con Node.js)

---

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/IvanManjarres/api-biblioteca.git
cd api-biblioteca
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar la base de datos

Editar el archivo `src/config/database.js` con los datos de conexión:

```js
const sequelize = new Sequelize('biblioteca_db', 'sa', 'TuPassword', {
  host: '192.168.X.X',   // IP del servidor SQL Server
  port: 1433,
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
    }
  },
  logging: false
});
```

> **Nota:** La base de datos `biblioteca_db` y las tablas se crean automáticamente al iniciar el servidor gracias a `sequelize.sync()`.

### 4. Iniciar el servidor

```bash
npm start
```

El servidor quedará corriendo en: `http://localhost:3000`

Para desarrollo con recarga automática:

```bash
npm run dev
```

---

## Estructura del proyecto

```
api-biblioteca/
├── src/
│   ├── index.js                  # Entrada principal, configuración de Express
│   ├── config/
│   │   └── database.js           # Conexión a SQL Server con Sequelize
│   ├── models/
│   │   ├── libro.js              # Modelo Libro
│   │   ├── usuario.js            # Modelo Usuario
│   │   └── prestamo.js           # Modelo Préstamo (relaciones)
│   ├── controllers/
│   │   ├── libroController.js    # Lógica de negocio — Libros
│   │   ├── usuarioController.js  # Lógica de negocio — Usuarios
│   │   └── prestamoController.js # Lógica de negocio — Préstamos
│   └── routes/
│       ├── libros.js             # Rutas /api/libros
│       ├── usuarios.js           # Rutas /api/usuarios
│       └── prestamos.js          # Rutas /api/prestamos
├── public/
│   └── index.html                # Interfaz web (dashboard)
├── package.json
└── README.md
```

---

## Endpoints de la API

### Libros — `/api/libros`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/libros` | Obtener todos los libros |
| `GET` | `/api/libros/:id` | Obtener un libro por ID |
| `GET` | `/api/libros/disponibles` | Obtener libros con copias disponibles |
| `POST` | `/api/libros` | Registrar un nuevo libro |
| `PUT` | `/api/libros/:id` | Editar información de un libro |
| `DELETE` | `/api/libros/:id` | Eliminar un libro |

**Ejemplo — Crear libro (`POST /api/libros`):**

```json
{
  "titulo": "Cien años de soledad",
  "autor": "Gabriel García Márquez",
  "isbn": "978-0-06-088328-7",
  "cantidad": 3
}
```

**Respuesta exitosa (`201`):**

```json
{
  "id": 1,
  "titulo": "Cien años de soledad",
  "autor": "Gabriel García Márquez",
  "isbn": "978-0-06-088328-7",
  "cantidad": 3,
  "disponibles": 3
}
```

---

### Usuarios — `/api/usuarios`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/usuarios` | Obtener todos los usuarios |
| `GET` | `/api/usuarios/:id` | Obtener un usuario por ID |
| `GET` | `/api/usuarios/buscar?q=` | Buscar usuario por email o cédula |
| `POST` | `/api/usuarios` | Registrar un nuevo usuario |
| `PUT` | `/api/usuarios/:id` | Editar datos de un usuario |
| `DELETE` | `/api/usuarios/:id` | Eliminar un usuario |

**Ejemplo — Crear usuario (`POST /api/usuarios`):**

```json
{
  "nombre": "Juan Pérez",
  "email": "juan@gmail.com",
  "cedula": "1234567890"
}
```

**Buscar usuario:**
```
GET /api/usuarios/buscar?q=juan@gmail.com
GET /api/usuarios/buscar?q=1234567890
```

---

### Préstamos — `/api/prestamos`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/prestamos` | Registrar un préstamo |
| `PUT` | `/api/prestamos/:id/devolver` | Registrar devolución de un libro |
| `GET` | `/api/prestamos/activos` | Ver todos los préstamos activos |
| `GET` | `/api/prestamos/usuario/:id` | Ver historial de préstamos de un usuario |

**Ejemplo — Registrar préstamo (`POST /api/prestamos`):**

```json
{
  "usuarioId": 1,
  "libroId": 2
}
```

**Respuesta historial por usuario (`GET /api/prestamos/usuario/1`):**

```json
{
  "usuario": "Juan Pérez",
  "totalPrestamos": 3,
  "prestamos": [
    {
      "id": 5,
      "libroId": 2,
      "usuarioId": 1,
      "fechaPrestamo": "2026-03-15T10:00:00.000Z",
      "fechaDevolucion": "2026-03-18T14:30:00.000Z",
      "libro": { "id": 2, "titulo": "El principito", "autor": "Antoine de Saint-Exupéry" }
    }
  ]
}
```

---

## Validaciones y reglas de negocio

- No se puede registrar un préstamo si el libro **no tiene copias disponibles** → `400`
- No se puede eliminar un libro que tiene **préstamos activos** → `400`
- No se puede eliminar un usuario que tiene **préstamos activos** → `400`
- No se puede devolver un libro que **ya fue devuelto** → `400`
- El campo `isbn` debe ser **único** por libro → `400`
- Los campos `email` y `cedula` deben ser **únicos** por usuario → `400`
- Rutas no encontradas retornan `404` con mensaje descriptivo
- Errores internos del servidor retornan `500`

---

## Interfaz web

Al iniciar el servidor, la interfaz web está disponible en:

```
http://localhost:3000
```

Incluye un dashboard con:
- Gestión completa de **Libros** (crear, editar, eliminar, listar)
- Gestión completa de **Usuarios** (crear, editar, eliminar, buscar)
- Gestión de **Préstamos** (registrar, devolver, ver activos)
- **Historial de préstamos** por usuario

---

## Product Backlog

| ID | Historia de usuario | Sprint | Prioridad |
|----|---------------------|--------|-----------|
| HU-01 | Repositorio y estructura configurados | Sprint 0 | Alta |
| HU-02 | Conexión a base de datos configurada | Sprint 0 | Alta |
| HU-03 | Registrar nuevos libros | Sprint 1 | Alta |
| HU-04 | Consultar todos los libros | Sprint 1 | Alta |
| HU-05 | Consultar un libro por ID | Sprint 1 | Alta |
| HU-06 | Editar información de un libro | Sprint 1 | Media |
| HU-07 | Eliminar un libro del catálogo | Sprint 1 | Media |
| HU-07b | Buscar libros disponibles | Sprint 1 | Media |
| HU-08 | Registrar nuevos usuarios | Sprint 2 | Alta |
| HU-09 | Consultar todos los usuarios | Sprint 2 | Alta |
| HU-10 | Consultar un usuario por ID | Sprint 2 | Alta |
| HU-11 | Editar datos de un usuario | Sprint 2 | Media |
| HU-12 | Eliminar un usuario del sistema | Sprint 2 | Media |
| HU-12b | Buscar usuario por cédula o email | Sprint 2 | Media |
| HU-13 | Registrar préstamo de libro | Sprint 3 | Alta |
| HU-14 | Registrar devolución de libro | Sprint 3 | Alta |
| HU-15 | Ver todos los préstamos activos | Sprint 3 | Alta |
| HU-16 | Ver historial de préstamos por usuario | Sprint 3 | Media |
| HU-17 | Impedir préstamo sin copias disponibles | Sprint 4 | Alta |
| HU-18 | Impedir eliminar libro con préstamos activos | Sprint 4 | Alta |
| HU-19 | Impedir eliminar usuario con préstamos activos | Sprint 4 | Alta |
| HU-20 | Retornar mensajes de error claros | Sprint 4 | Media |
| HU-21 | Probar todos los endpoints con Postman | Sprint 5 | Media |
| HU-22 | Documentar el proyecto en el README | Sprint 5 | Media |
