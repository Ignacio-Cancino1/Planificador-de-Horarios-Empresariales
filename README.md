
# 🗓️ Planificador de Horarios Empresariales

Aplicación web diseñada para facilitar la gestión eficiente de horarios, turnos y disponibilidad de empleados dentro de una empresa.  
Permite asignar turnos, visualizar calendarios compartidos, generar reportes y gestionar usuarios con control de acceso por roles.

---

## 🚀 Instalación y Configuración

### 🔧 Requisitos Previos

- Node.js (v16 o superior)  
- npm o yarn  
- Python >= 3.10  
- PostgreSQL >= 14  
- Git (opcional)  

---

### 📥 Clonar el Repositorio

```bash
git clone https://github.com/Ignacio-Cancino1/Planificador-de-Horarios-Empresariales.git
cd Planificador-de-Horarios-Empresariales
```

---

### 🖥️ Frontend (React)

```bash
cd frontend
npm install       # o yarn install
npm install react-icons react-router-dom
npm run dev
```

---

### 🐍 Backend (Flask + PostgreSQL)

```bash
cd backend
python -m venv venv
source venv/bin/activate     # En Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

---

### 🔐 Configuración de Variables (.env o config.py)

```env
SECRET_KEY=clave-secreta-supersegura
```

Verifica que `config.py` importe:  
`os.environ.get("SECRET_KEY")`

---

## 🏗️ Estructura del Proyecto

```
📁 src/                      # Frontend (React)
├── App.jsx                 → Definición de rutas y protección por rol
└── pages/
    ├── AssignShift.jsx           → Asignación de turnos (admin)
    ├── ChangePassword.jsx        → Cambio obligatorio de contraseña
    ├── Dashboard.jsx             → Panel general de administrador
    ├── EmployeeProfile.jsx       → Perfil individual del empleado
    ├── Employees.jsx             → Gestión de empleados
    ├── Homee.jsx                 → Pantalla de inicio
    ├── Login.jsx                 → Formulario de acceso
    ├── ReportsPage.jsx           → Visualización y descarga de reportes
    ├── ShiftCalendar.jsx         → Calendario con turnos asignados
    ├── Unauthorized.jsx          → Acceso denegado (por rol)
    └── UserDashboard.jsx         → Panel de vista del empleado

📁 backend/                 # Backend (Flask API)
├── app.py                  → Punto de entrada principal del servidor Flask
├── config.py               → Configuración general del entorno (SECRET_KEY, DB, etc.)
├── server.js               → Adaptación para despliegue (opcional)
├── .env                    → Variables de entorno
├── package.json            → Dependencias (si integras con Node)
├── requirements.txt        → Librerías necesarias para instalar el backend
├── venv/                   → Entorno virtual de Python

├── models/                 → Definición de modelos de base de datos
│   ├── __init__.py
│   └── models.py

├── controllers/            → Controladores (lógica para cada recurso)
│   └── (aquí agregarías archivos como empleados_controller.py, etc.)

├── routes/                 → Definición de endpoints
│   ├── __init__.py
│   ├── asignaciones.py
│   ├── disponibilidad.py
│   ├── empleados.py
│   ├── notificaciones.py
│   ├── reportes.py
│   ├── turnos.py
│   └── usuarios.py

└── middlewares/            → Funciones para protección de rutas
    └── auth.py
```

---

## 🔐 Autenticación y Seguridad

- Login con email  
- Tokens JWT firmados y verificados
- Para cada usuario nuevo creado su contraseña es cambiar123
- Campo `requiere_cambio_clave` obliga a cambiar la contraseña en el primer login  
- Rutas protegidas por rol (`admin_required` y `token_required`)  
- Clave secreta gestionada desde `.env`  

---

## 🔁 Funcionalidades Clave

### ✅ Login y Control de Acceso
- Inicio de sesión con redirección automática según rol  
- Cambio de contraseña forzado si el usuario es nuevo  

### 📆 Calendario Compartido
- Visualización de turnos por mes  
- Ambos roles (admin y empleado) pueden ver todos los turnos  
- Filtro por empleado para admins y empleados  
- Exportación a PDF de los turnos visibles  

### 👥 Gestión de Empleados
- CRUD de empleados  
- Creación automática del usuario con clave temporal (`cambiar123`)  
- Visualización de estado y detalles individuales  

### 📄 Reportes
- Generación de reportes de turnos diarios/mensuales  
- Exportación a PDF con diseño personalizado  

---

## 🧪 Credenciales de Prueba

- Email: admin@gmail.com  
- Contraseña: 2633  

---

## 🧰 Solución de Problemas

**Error:** `ModuleNotFoundError: flask_sqlalchemy`  
➡️ Solución:  
```bash
pip install flask_sqlalchemy
```

**Error de token:** `Signature verification failed`  
➡️ Verifica que `SECRET_KEY` sea consistente en `.env`, `config.py`, y `auth.py`.

---

## 🌐 Despliegue en Vercel

- URL: [https://planificador-de-horarios-empresariales.vercel.app](https://planificador-de-horarios-empresariales.vercel.app)

**Recomendaciones para Vercel:**

- Framework: Vite o Create React App  
- Build Command: `npm run build`  
- Output Directory: `build`  

Archivo `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
---

## 🌐 Despliegue en Producción

### 🔹 Backend (Render)

1. Crear un servicio de tipo **Web Service** en [Render](https://render.com/).
2. Configurar el path raíz al directorio `backend/`.
3. Especificar los siguientes comandos:

   - **Build Command:**  
     ```bash
     pip install -r requirements.txt
     ```

   - **Start Command:**  
     ```bash
     gunicorn app:app
     ```

4. Agregar las siguientes variables de entorno en Render:

   | Clave          | Valor                                               |
   |----------------|-----------------------------------------------------|
   | `DATABASE_URL` | Internal Database URL de la base PostgreSQL en Render |
   | `SECRET_KEY`   | Una clave secreta segura para Flask (`os.urandom`, por ejemplo) |

5. Crear una base de datos PostgreSQL en Render desde el panel (+ New → Postgres), y copiar su `Internal Database URL`.

6. Migrar datos desde la base de datos local a Render (puedes usar herramientas como **DBeaver** para transferir las tablas y sus registros).

---

### 🔹 Frontend (Vercel)

1. Subir el proyecto React a GitHub y conectarlo a [Vercel](https://vercel.com/).
2. En la sección **Environment Variables**, agregar:

   | Clave           | Valor                                              |
   |-----------------|----------------------------------------------------|
   | `VITE_API_URL`  | URL pública del backend desplegado en Render (por ejemplo: `https://planificador-api.onrender.com`) |

3. Realizar un nuevo deploy para que tome los cambios.

---

✅ Con esto, tanto backend como frontend estarán desplegados correctamente en la nube y conectados entre sí.

---

## 📌 Mejoras Futuras

- Edición de datos del empleado desde el frontend  
- Integración con Google Calendar  
- Módulo de asistencia y vacaciones  
- Dashboard con estadísticas gráficas  

---

## 🤝 Contribución

1. Haz fork del proyecto  
2. Crea una rama:  
   `git checkout -b feature/nueva-funcionalidad`  
3. Realiza tus cambios y commitea:  
   `git commit -m "Agrega nueva funcionalidad"`  
4. Sube tu rama:  
   `git push origin feature/nueva-funcionalidad`  
5. Abre un Pull Request  

---

## 👤 Autor

**Ignacio Cancino**  
- GitHub: [https://github.com/Ignacio-Cancino1](https://github.com/Ignacio-Cancino1)  
- Despliegue: [planificador-de-horarios-empresariales.vercel.app](https://planificador-de-horarios-empresariales.vercel.app)
