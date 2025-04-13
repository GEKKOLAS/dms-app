# DesignersApp 🎨

DesignersApp es una aplicación diseñada para gestionar diseños y asignarlos a diseñadores. Ideal para equipos creativos que desean organizar sus proyectos y asignar tareas de manera eficiente.

---

## Características 🚀

- 🖌️ **Gestión de Diseños**: Crea, lista y administra diseños con títulos y descripciones.
- 👩‍🎨 **Asignación de Diseñadores**: Asigna diseños a diseñadores desde una lista de opciones.
- 📋 **Vista de Proyectos**: Explora todos los diseños disponibles en una vista organizada.
- 🌟 **Interfaz Moderna**: Utiliza componentes de UI accesibles y personalizables basados en Radix UI.

---

## Instalación ⚙️

1. Clona este repositorio:
    ```bash
    git clone https://github.com/tu-usuario/DesignersApp.git](https://github.com/GEKKOLAS/dms-app.git
    ```

2. Navega al directorio del proyecto:
    ```bash
    cd DesignersApp
    cd dms-app
    ```

3. Instala las dependencias:
    ```bash
    npm install
    ```

4. Configura las variables de entorno:
    Crea un archivo `.env.local` en la raíz del proyecto y agrega las siguientes variables:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
    ```
    Reemplaza `tu_supabase_url` y `tu_supabase_anon_key` con las credenciales de tu proyecto en Supabase.

5. Ejecuta la aplicación:
    ```bash
    npm run dev
    ```

---

## Uso 🖥️

1. Accede a la aplicación en `http://localhost:3000`.

2. Explora los diseños disponibles en la vista principal.

3. Crea nuevos diseños utilizando el botón **Add Design**:
   - Ingresa un título y una descripción para el diseño.
   - Guarda el diseño para que aparezca en la lista.

4. Asigna diseños a diseñadores:
   - Selecciona un diseñador y un diseño desde los menús desplegables.
   - Haz clic en **Save** para completar la asignación.

---

## Tecnología 🔧

- **Frontend**: React con componentes de Radix UI.
- **Backend**: Supabase para la gestión de datos.
- **Estado**: React Hook Form para formularios controlados.

---

## Contribución 🤝

¡Ayúdanos a mejorar DesignersApp! Si quieres contribuir, sigue estos pasos:

1. Haz un fork del proyecto.
2. Crea una nueva rama para tu mejora:
    ```bash
    git checkout -b mi-mejora
    ```
3. Haz tus cambios y realiza un commit:
    ```bash
    git commit -m "Descripción de la mejora"
    ```
4. Envía un pull request con tus cambios.

---

## Créditos 👏

- Desarrollado por Nicolás y su equipo.
- Inspirado en la necesidad de organizar proyectos creativos de manera eficiente.

---

## Licencia 📝

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.
