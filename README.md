
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

📁 src/                         # Frontend (React)
├── pages/
│   ├── AssignShift.jsx              → Asignación de turnos (admin)
│   ├── ChangePassword.jsx          → Cambio obligatorio de contraseña
│   ├── Dashboard.jsx               → Panel general de administrador
│   ├── EmployeeProfile.jsx         → Perfil individual del empleado
│   ├── Employees.jsx               → Gestión de empleados
│   ├── Homee.jsx                   → Pantalla de inicio
│   ├── Login.jsx                   → Formulario de acceso
│   ├── ReportsPage.jsx             → Visualización y descarga de reportes
│   ├── ShiftCalendar.jsx           → Calendario con turnos asignados
│   ├── Unauthorized.jsx            → Acceso denegado (por rol)
│   └── UserDashboard.jsx           → Panel de vista del empleado
└── App.jsx                         → Definición de rutas y protección por rol

📁 backend/                    # Backend (Flask API)
├── app.py                         → Punto de entrada principal del servidor Flask
├── config.py                      → Configuración general del entorno (SECRET_KEY, DB, etc.)
├── server.js                      → Adaptación para deploy (opcional si lo usas)
├── .env                           → Variables de entorno
│
├── models/                        → Definición de modelos de base de datos
│   ├── models.py
│   └── __init__.py
│
├── controllers/                  → Controladores (lógica para cada recurso)
│   └── (faltan en la imagen pero deberían estar aquí si usas lógica separada)
│
├── routes/                        → Definición de endpoints
│   ├── asignaciones.py
│   ├── disponibilidad.py
│   ├── empleados.py
│   ├── notificaciones.py
│   ├── reportes.py
│   ├── turnos.py
│   └── usuarios.py
│
├── middlewares/                  → Funciones para protección de rutas
│   └── auth.py
│
├── venv/                          → Entorno virtual de Python
├── package.json                   → Dependencias (solo si integras Node o Vite aquí)
└── requirements.txt               → Librerías necesarias para instalar el backend

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
