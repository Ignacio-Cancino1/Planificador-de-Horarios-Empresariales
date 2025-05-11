
🗓️ Planificador de Horarios Empresariales
Aplicación web diseñada para facilitar la gestión eficiente de horarios, turnos y disponibilidad de empleados dentro de una empresa. Permite asignar turnos, visualizar calendarios compartidos, generar reportes y gestionar usuarios con control de acceso por roles.

🚀 Instalación y Configuración
Requisitos Previos
Node.js (v16 o superior)

npm o yarn

Python >= 3.10

PostgreSQL >= 14

Git (opcional)

Clonar el Repositorio
git clone https://github.com/Ignacio-Cancino1/Planificador-de-Horarios-Empresariales.git
cd Planificador-de-Horarios-Empresariales

Frontend (React)
cd frontend
npm install
(o)
yarn install
npm install react-icons react-router-dom
npm run dev

Backend (Flask + PostgreSQL)
cd backend
python -m venv venv
source venv/bin/activate (en Windows: venv\Scripts\activate)
pip install -r requirements.txt
python app.py

Configuración de Variables (.env o config.py)
SECRET_KEY=clave-secreta-supersegura

Verifica que config.py importe os.environ.get("SECRET_KEY").

🏗️ Estructura del Proyecto
src/
├── pages/
│ ├── Login.jsx → Autenticación y redirección por rol o cambio de contraseña
│ ├── ChangePassword.jsx → Cambio obligatorio de contraseña
│ ├── Dashboard.jsx → Panel de administración
│ ├── UserDashboard.jsx → Vista de empleados
│ ├── Employees.jsx → Gestión de empleados
│ ├── ShiftCalendar.jsx → Calendario de turnos compartido
│ └── ReportsPage.jsx → Generación de reportes en PDF
└── App.jsx → Ruteo y protección de rutas

🔐 Autenticación y Seguridad
Login con email o RUT

Tokens JWT firmados y verificados

Campo requiere_cambio_clave obliga a cambiar la contraseña en el primer login

Rutas protegidas por rol (admin_required y token_required)

Clave secreta gestionada desde .env

🔁 Funcionalidades Clave
Login y Control de Acceso
Inicio de sesión con redirección automática según rol

Cambio de contraseña forzado si el usuario es nuevo

Calendario Compartido
Visualización de turnos por mes

Ambos roles (admin y empleado) pueden ver todos los turnos

Filtro por empleado para admins y empleados

Exportación a PDF de los turnos visibles

Gestión de Empleados
CRUD de empleados

Creación automática del usuario con clave temporal (cambiar123)

Visualización de estado y detalles individuales

Reportes
Generación de reportes de turnos diarios/mensuales

Exportación a PDF con diseño personalizado

🧪 Credenciales de Prueba
Email: admin@gmail.com
Contraseña: 2633

🧰 Solución de Problemas
Error: ModuleNotFoundError: flask_sqlalchemy
Solución: pip install flask_sqlalchemy

Error de token: Signature verification failed
Asegúrate que SECRET_KEY sea consistente en .env, config.py, y auth.py.

🌐 Despliegue en Vercel
URL: https://planificador-de-horarios-empresariales.vercel.app

Recomendaciones:
Framework: Vite o Create React App
Build Command: npm run build
Output Directory: build

Archivo vercel.json:

{
"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}

📌 Mejoras Futuras
Edición de datos del empleado desde el frontend

Integración con Google Calendar

Módulo de asistencia y vacaciones

Dashboard con estadísticas gráficas

🤝 Contribución
Haz fork del proyecto

Crea una rama:
git checkout -b feature/nueva-funcionalidad

Commitea tus cambios:
git commit -m "Agrega nueva funcionalidad"

Push a la rama:
git push origin feature/nueva-funcionalidad

Abre un Pull Request

🧑 Autor
Ignacio Cancino
GitHub: https://github.com/Ignacio-Cancino1
Despliegue: https://planificador-de-horarios-empresariales.vercel.app
