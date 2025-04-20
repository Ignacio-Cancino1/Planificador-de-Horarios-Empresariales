# Planificador-de-Horarios-Empresariales
Desarrollo de una aplicación para la gestión de eficiente de horarios y turnos de  empleados permitiendo la asignación, visualización y organización de la planifi cación del personal. La aplicación facilitara la distribución de horarios, evitara  conflictos y mejorar la comunicación entre la empresa y sus empleados. 

🚀 Instalación y Configuración
Requisitos previos

-Node.js (v16 o superior)
-npm (v8 o superior) o yarn
-Git (opcional)

Pasos para instalar

-Clonar el repositorio (si no lo has hecho):
En la consola o Terminal
-git clone https://github.com/Ignacio-Cancino1/Planificador-de-Horarios-Empresariales.git
-cd planificador-horario

Instalar dependencias:
En la consola o Terminal
-npm install
# o
-yarn install

Instalar dependencias adicionales (si no se instalaron automáticamente):

En la consola o Terminal
-npm install react-icons react-router-dom

Iniciar la aplicación:

En la consola o Terminal
-npm run dev
# o
-yarn dev
# o
npm start

🏗️ Estructura del Proyecto

src/
├── pages/
│   ├── Dashboard.jsx       # Página principal después del login
│   ├── Employees.jsx       # Listado de empleados
│   ├── EmployeeProfile.jsx # Perfil detallado de empleado
│   ├── Login.jsx           # Página de autenticación
│   └── Home.jsx            # Página de inicio pública
├── App.jsx                 # Configuración de rutas principal
└── index.js                # Punto de entrada

🔑 Credenciales de Prueba
Usuario: admin@gmail.com
Contraseña: 2633

🛠️ Componentes Implementados
1. Autenticación
-Login funcional con validación frontend
-Protección de rutas privadas
-Manejo de sesión simulada

2. Dashboard
-Vista principal post-login
-Accesos rápidos a funcionalidades
-Botón de cierre de sesión

3. Gestión o Lista de Empleados
-Listado completo de empleados con:
-Foto
-Datos básicos
-Estado (activo/inactivo)
-Acceso a perfiles individuales

4. Perfil de Empleado
-Vista detallada con:
-Foto de perfil
-Descripción completa
-Botón para ver horarios
-Estado visual

🎨 Guía de Estilos
-CSS Modules para estilos encapsulados
-React Icons para iconografía
-Diseño responsive para todos los dispositivos

📌 Próximas Mejoras
-Implementación de pages
-Funcionalidad de edición de perfiles
-Exportación de reportes en PDF
-Conexion con la base de datos

🚨 Solución de Problemas Comunes
Errores de importación
En la consola o Terminal
# Si aparece "Module not found":
npm install [nombre-paquete]
# o
npm ci
Problemas con mayúsculas/minúsculas (Windows)
Asegurar que los nombres de archivos coincidan exactamente con las importaciones

Ejecutar:

En la consola o Terminal
npm cache clean --force
🤝 Contribución
Haz fork del proyecto

Crea una rama (git checkout -b feature/nueva-funcionalidad)

Haz commit de tus cambios (git commit -m 'Añade nueva funcionalidad')

Haz push a la rama (git push origin feature/nueva-funcionalidad)

Abre un Pull Request


🌐 🚀 Planificador de Horarios Empresariales
🌐 Despliegue en Vercel
Acceso a la Aplicación
🔗 URL de Producción:
https://planificador-de-horarios-empresariales.vercel.app

Configuración Automática
Deploy with Vercel

Pasos para Despliegue Manual
Conectar repositorio en Vercel Dashboard

Configurar proyecto:

Framework: Create React App

Build Command: npm run build

Output Directory: build

Agregar variables de entorno (si aplica)

¡Desplegar! 🎉

Características del Despliegue
✔️ Actualizaciones automáticas con cada push a main
✔️ Preview Deployments para cada Pull Request
✔️ SSL automático y CDN global
✔️ Dominio personalizable en configuraciones

Solución de Problemas
🔧 Si las rutas no funcionan, añade este vercel.json:

json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
📊 Monitoreo incluido:

Análisis de rendimiento

Registros de errores en tiempo real

Optimización automática de assets

💡 Pro Tip: Para conectar un dominio personalizado:

Ve a Settings → Domains

Sigue las instrucciones de verificación DNS

¡Disfruta de tu app en tudominio.com!

🔗 Enlace permanente: planificador-de-horarios-empresariales.vercel.app
