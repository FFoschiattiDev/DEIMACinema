# Watchlist

Aplicación web personal para registrar y administrar películas y series.

Desarrollada con **Node.js + Express + MySQL + EJS** siguiendo el patrón **MVC**.

---

## Tecnologías

- Node.js
- Express.js
- MySQL
- mysql2
- EJS
- express-session
- dotenv

---

## Requisitos previos

1. **Node.js** (v18 o superior): [https://nodejs.org](https://nodejs.org)
2. **MySQL** (v8 o superior): [https://dev.mysql.com/downloads/](https://dev.mysql.com/downloads/)

---

## Instalación

### 1. Crear la base de datos

Abre una terminal de MySQL y ejecuta el script:

```bash
mysql -u root -p < database.sql
```

O abre el archivo `database.sql` en tu cliente MySQL y ejecútalo manualmente.

Esto creará:
- La base de datos `watchlist_db`
- La tabla `users` con los 4 usuarios predefinidos
- La tabla `watchlist` con datos de ejemplo

### 2. Configurar variables de entorno

Edita el archivo `.env` con tus credenciales de MySQL:

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=watchlist_db

SESSION_SECRET=watchlist_secret
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Ejecutar la aplicación

Desarrollo (con recarga automática):

```bash
npm run dev
```

Producción:

```bash
npm start
```

### 5. Abrir en el navegador

```
http://localhost:3000
```

---

## Usuarios

La aplicación tiene **4 usuarios predefinidos**. No existe sistema de registro.

| ID | Usuario |
|----|---------|
| 1  | Lucas   |
| 2  | Luz     |
| 3  | Rami    |
| 4  | Foscha  |

Al abrir la aplicación, seleccionas tu usuario y accedes directamente a tu watchlist personal.

Cada usuario solo puede ver, editar y eliminar sus propios elementos.

---

## Arquitectura MVC

El proyecto sigue el patrón **Model-View-Controller**:

```
watchlist/
├── app.js                    # Entrada principal
├── config/
│   └── database.js           # Conexión a MySQL
├── models/
│   ├── User.js               # Modelo de usuarios
│   └── Watchlist.js           # Modelo de watchlist
├── controllers/
│   ├── authController.js      # Lógica de autenticación
│   └── watchlistController.js # Lógica CRUD
├── routes/
│   ├── authRoutes.js          # Rutas de autenticación
│   └── watchlistRoutes.js     # Rutas de watchlist
├── middleware/
│   └── authMiddleware.js      # Verificación de sesión
├── views/                     # Plantillas EJS
└── public/                    # Archivos estáticos (CSS, JS)
```

### Flujo de una petición

Una petición como `GET /watchlist` sigue este flujo:

```
Navegador
    ↓
Route (watchlistRoutes.js)
    ↓
Controller (watchlistController.js)
    ↓
Model (Watchlist.js)
    ↓
MySQL (base de datos)
    ↓
Model (devuelve datos)
    ↓
Controller (prepara respuesta)
    ↓
View (EJS renderiza HTML)
    ↓
Navegador (muestra la página)
```

- **Routes**: Definen las URLs y las conectan con los controladores.
- **Controllers**: Contienen la lógica de negocio. Reciben la petición, llaman a los modelos y envían la respuesta.
- **Models**: Se comunican directamente con MySQL mediante queries parametrizadas.
- **Views**: Plantillas EJS que solo se encargan de presentar los datos.

---

## Funcionalidades

- ✅ Login por selección de usuario (sin contraseña)
- ✅ Dashboard con estadísticas personales
- ✅ CRUD completo (crear, leer, editar, eliminar)
- ✅ Búsqueda por título
- ✅ Filtros por tipo (película/serie) y estado
- ✅ Verificación de propiedad en cada operación
- ✅ Interfaz oscura, minimalista y responsive
- ✅ Confirmación antes de eliminar

---

## Licencia

Proyecto educativo.
