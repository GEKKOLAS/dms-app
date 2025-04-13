# DesignersApp

DesignersApp es una aplicación que permite gestionar diseños y asignarlos a diseñadores. Este proyecto utiliza **Supabase** como backend para la gestión de datos y **React** con componentes de UI personalizados para la interfaz de usuario.

---

## Características

- **Gestión de Diseños**: Crear, listar y asignar diseños.
- **Asignación de Diseñadores**: Seleccionar un diseñador de una lista y asignarle un diseño.
- **Interfaz de Usuario Moderna**: Utiliza componentes de UI como diálogos, formularios y selectores basados en Radix UI.

---

## Requisitos Previos

Antes de ejecutar este proyecto, asegúrate de tener instalado lo siguiente:

- **Node.js** (versión 16 o superior)
- **npm** o **yarn**
- Una cuenta de **Supabase** con una base de datos configurada.

---

## Instalación

1. Clona este repositorio:

   ```bash
   git clone https://github.com/tu-usuario/DesignersApp.git
   cd DesignersApp

2. Instalar Dependencias

npm install

3. Configura Supabase

Configuración de la Base de Datos
Asegúrate de que tu base de datos en Supabase tenga las siguientes tablas:

# Estructura de Tablas

## Tabla: designs
| Columna      | Tipo     | Descripción                           |
|--------------|----------|---------------------------------------|
| id           | integer  | Identificador único del diseño.       |
| title        | text     | Título del diseño.                    |
| description  | text     | Descripción del diseño.               |
| assigned_to  | integer  | ID del diseñador asignado.            |

## Tabla: designers
| Columna      | Tipo     | Descripción                           |
|--------------|----------|---------------------------------------|
| id           | integer  | Identificador único del diseñador.    |
| name         | text     | Nombre del diseñador.                 |

## Tabla: design_assignments
| Columna      | Tipo       | Descripción                           |
|--------------|------------|---------------------------------------|
| design_id    | integer    | ID del diseño asignado.               |
| designer_id  | integer    | ID del diseñador asignado.            |
| assigned_at  | timestamp  | Fecha de asignación.                  |


4.Ejecución del Proyecto
Inicia el servidor de desarrollo:

npm run dev

# Estructura de Directorios de DesignersApp



Dependencias Principales
React: Biblioteca para construir interfaces de usuario.
Supabase: Backend como servicio para la gestión de datos.
Radix UI: Componentes accesibles y personalizables.
React Hook Form: Manejo de formularios en React.

Scripts Disponibles
npm run dev: Inicia el servidor de desarrollo.
npm run build: Construye la aplicación para producción.
npm run start: Inicia el servidor en modo producción.
npm run lint: Ejecuta el linter para verificar errores de código.

Contribuciones
¡Las contribuciones son bienvenidas! Si deseas contribuir, por favor:

Haz un fork del repositorio.
Crea una rama para tu funcionalidad (git checkout -b feature/nueva-funcionalidad).
Realiza tus cambios y haz un commit (git commit -m 'Agrega nueva funcionalidad').
Haz push a tu rama (git push origin feature/nueva-funcionalidad).
Abre un Pull Request.

Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

Contacto
Si tienes preguntas o sugerencias, no dudes en contactarme:

Email: tu-email@example.com
GitHub: tu-usuario
