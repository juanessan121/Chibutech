# Manual de Usuario — Chibutech
## Sistema de Gestión Comunitaria — Consejo de Gobierno Comunitario Chibuleo-San Francisco

> Este manual describe el uso completo del sistema Chibutech: control de agua potable, mingas (trabajo comunitario), catastro de terrenos, cobros/multas y administración de usuarios y directiva.

---

## Cómo usar este manual

Cada sección incluye un espacio de imagen como el siguiente:

```
![Espacio para captura: descripción](capturas/nombre-archivo.png)
```

Para agregar tus propias capturas de pantalla:
1. Toma la captura de la pantalla indicada.
2. Guárdala con **exactamente el nombre de archivo** indicado (por ejemplo `login-formulario.png`) dentro de la carpeta:
   `docs/manual/capturas/`
3. La imagen aparecerá automáticamente en este documento la próxima vez que lo abras con un lector de Markdown (VS Code, GitHub, Typora, etc.).

La carpeta `docs/manual/capturas/` ya está creada y lista para recibir las imágenes.

---

## Índice

1. [Roles y permisos del sistema](#1-roles-y-permisos-del-sistema)
2. [Acceso al sistema](#2-acceso-al-sistema)
   - 2.1 [Página de Inicio (Landing)](#21-página-de-inicio-landing)
   - 2.2 [Inicio de Sesión (Login)](#22-inicio-de-sesión-login)
   - 2.3 [Recuperar Contraseña](#23-recuperar-contraseña)
   - 2.4 [Cambiar Contraseña Temporal](#24-cambiar-contraseña-temporal-primer-ingreso)
3. [Panel Principal (Dashboard)](#3-panel-principal-dashboard)
4. [Mi Perfil / Mi Expediente](#4-mi-perfil--mi-expediente)
5. [Módulo de Usuarios y Directiva](#5-módulo-de-usuarios-y-directiva)
   - 5.1 [Menú de Usuarios](#51-menú-de-usuarios)
   - 5.2 [Buscar Usuario](#52-buscar-usuario)
   - 5.3 [Padrón General](#53-padrón-general)
   - 5.4 [Agregar / Editar Usuario](#54-agregar--editar-usuario)
   - 5.5 [Directiva (Organigrama Actual)](#55-directiva-organigrama-actual)
   - 5.6 [Gestión de Directivas](#56-gestión-de-directivas)
6. [Módulo de Mingas](#6-módulo-de-mingas)
   - 6.1 [Control de Mingas (menú)](#61-control-de-mingas-menú)
   - 6.2 [Programar Minga](#62-programar-minga)
   - 6.3 [Mingas Activas](#63-mingas-activas)
   - 6.4 [Registro de Asistencia (Tomar Lista)](#64-registro-de-asistencia-tomar-lista)
   - 6.5 [Historial de Mingas](#65-historial-de-mingas)
7. [Módulo de Catastro y Terrenos](#7-módulo-de-catastro-y-terrenos)
   - 7.1 [Menú de Catastros](#71-menú-de-catastros)
   - 7.2 [Catastro de Predios (Padrón General)](#72-catastro-de-predios-padrón-general)
   - 7.3 [Registro Múltiple de Terrenos](#73-registro-múltiple-de-terrenos)
   - 7.4 [Corrección Técnica de Predio (Edición)](#74-corrección-técnica-de-predio-edición)
   - 7.5 [Ficha de Predio (Detalles del Terreno)](#75-ficha-de-predio-detalles-del-terreno)
   - 7.6 [Mis Terrenos (comunero)](#76-mis-terrenos-comunero)
8. [Módulo de Cobros y Finanzas](#8-módulo-de-cobros-y-finanzas)
   - 8.1 [Panel de Cobros (menú)](#81-panel-de-cobros-menú)
   - 8.2 [Ventanilla de Cobro](#82-ventanilla-de-cobro)
   - 8.3 [Generar Multa Manual](#83-generar-multa-manual)
   - 8.4 [Registrar Egreso](#84-registrar-egreso)
   - 8.5 [Arqueo e Historial (Libro Diario)](#85-arqueo-e-historial-libro-diario)
   - 8.6 [Emitir Planillas (Pago de Agua)](#86-emitir-planillas-pago-de-agua)
   - 8.7 [Mis Deudas (comunero)](#87-mis-deudas-comunero)
   - 8.8 [Centro de Reportes](#88-centro-de-reportes)
9. [Módulo de Administración](#9-módulo-de-administración)
   - 9.1 [Panel de Administración](#91-panel-de-administración)
   - 9.2 [Configuración Global del Sistema](#92-configuración-global-del-sistema)
   - 9.3 [Bitácora de Auditoría](#93-bitácora-de-auditoría)
10. [Reglas de negocio clave (resumen)](#10-reglas-de-negocio-clave-resumen)
11. [Guía técnica: subir Chibutech a un servidor con cPanel](#11-guía-técnica-subir-chibutech-a-un-servidor-con-cpanel)
    - 11.0 [Diagnóstico del error "Acceso denegado" que estás viendo](#110-diagnóstico-del-error-acceso-denegado-que-estás-viendo)
    - 11.1 [Requisitos del hosting](#111-requisitos-del-hosting)
    - 11.2 [Paso 1 — Crear la base de datos y el usuario en cPanel](#112-paso-1--crear-la-base-de-datos-y-el-usuario-en-cpanel)
    - 11.3 [Paso 2 — Importar la base de datos vía phpMyAdmin (sin error)](#113-paso-2--importar-la-base-de-datos-vía-phpmyadmin-sin-error)
    - 11.4 [Paso 3 — Subir y configurar el backend (Laravel)](#114-paso-3--subir-y-configurar-el-backend-laravel)
    - 11.5 [Paso 4 — Compilar y subir el frontend (React)](#115-paso-4--compilar-y-subir-el-frontend-react)
    - 11.6 [Paso 5 — Dominios, CORS y HTTPS](#116-paso-5--dominios-cors-y-https)
    - 11.7 [Mantenimiento: actualizar el sistema tras cambios](#117-mantenimiento-actualizar-el-sistema-tras-cambios)
    - 11.8 [Alternativa: servidor propio (VPS) con Docker](#118-alternativa-servidor-propio-vps-con-docker)
    - 11.9 [Checklist de "Acceso denegado" — todas las causas posibles](#119-checklist-de-acceso-denegado--todas-las-causas-posibles)

---

## 1. Roles y permisos del sistema

El sistema controla lo que cada usuario puede ver y hacer mediante **roles** y **permisos**. El menú lateral se adapta automáticamente: solo aparecen las opciones para las que el usuario tiene permiso.

**Roles base:**
- **Comunero**: usuario regular de la comunidad. Ve su propio estado de cuenta ("Mis Deudas"), sus terrenos ("Mis Terrenos") y su expediente personal. No accede a los módulos de gestión.
- **Administrador**: acceso amplio a los módulos de gestión, según los permisos que tenga asignados.

**Cargos de Directiva** (además de su rol base, otorgan acceso a los módulos de gestión): Presidente, Vicepresidente, Secretario, Tesorero, Vocal Principal 1, Vocal Principal 2, Vocal Principal 3, Vocal Suplente 1, Vocal Suplente 2.

**Permisos identificados en el sistema:**

| Permiso | Qué habilita |
|---|---|
| `ver_usuarios` | Ver el Padrón General y buscar usuarios |
| `crear_usuario` | Crear/editar usuarios, gestionar Directiva, registrar y editar terrenos |
| `ver_mingas` | Ver el listado y control de mingas |
| `gestionar_mingas` | Programar mingas, tomar asistencia, posponer/reactivar/cancelar |
| `ver_catastro` | Ver el Catastro de Predios |
| `gestionar_multas` | Todo el módulo de Cobros: ventanilla, multas, egresos, arqueo, planillas |
| `ver_reportes` | Generar reportes en PDF (Padrón, Morosidad, Balance) |
| `administrar_sistema` | Acceso al módulo de Administración (Configuración y Bitácora) |

> 📷 **Sugerencia:** documenta aquí, en una tabla propia, qué cargo de tu Junta corresponde a qué combinación de permisos, según se haya configurado en tu instalación.

![Espacio para captura: menú lateral mostrando las secciones visibles para un rol de gestión](capturas/sidebar-menu-completo.png)

---

## 2. Acceso al sistema

### 2.1 Página de Inicio (Landing)

**Propósito:** Es la primera pantalla que ve cualquier visitante al abrir el sistema Chibutech. Presenta el sistema, su misión (gestión del agua, mingas y catastro) y funciona como punto de entrada hacia el inicio de sesión.

**Cómo se llega:** Es la ruta raíz del sitio (`/`). Se accede automáticamente al abrir la URL del sistema, sin necesidad de iniciar sesión.

**Botones y acciones disponibles:**
- **"Ingresar al Portal"** (barra de navegación superior): lleva a la pantalla de Login.
- **"Acceder al Sistema"** (botón principal en la sección de bienvenida): también lleva a la pantalla de Login.

**Información mostrada:**
- Encabezado con el nombre "Junta de Agua Chibuleo" y frase de bienvenida sobre la importancia del agua.
- Tres tarjetas informativas: "Cuidado Agrícola" (turnos de regadío), "Gestión del Recurso" (catastro de usuarios y cobros) y "Trabajo Comunitario" (registro de Mingas).
- Pie de página con el nombre del "Consejo de Gobierno Comunitario Chibuleo-San Francisco" y el año actual.

![Espacio para captura: vista completa de la página de bienvenida con el botón "Acceder al Sistema" y las tres tarjetas](capturas/landing-inicio.png)

---

### 2.2 Inicio de Sesión (Login)

**Propósito:** Permite a comuneros, directiva y administradores autenticarse para acceder al sistema con su cédula (y contraseña si su rol lo requiere).

**Cómo se llega:** Ruta `/login`. Se llega haciendo clic en "Ingresar al Portal" o "Acceder al Sistema" desde la página de inicio.

**Campos del formulario:**
- **Cédula de Identidad** (obligatorio): solo letras y números, sin espacios ni símbolos. Si se deja vacío: *"Ingresa tu número de cédula."*
- **Contraseña** (opcional para comuneros): campo oculto tipo contraseña.

**Botones:**
- **"Volver al Inicio"**: regresa a la Landing.
- **"¿Olvidaste tu contraseña?"**: lleva a Recuperar Contraseña.
- **"Ingresar al Sistema"**: envía el formulario. Mientras procesa muestra "Autenticando...".

**Mensajes:**
- Error: *"Por favor, ingresa tu número de cédula."* o *"Credenciales incorrectas. Intenta de nuevo."*
- Éxito: *"¡Bienvenido al sistema!"*

**Reglas de negocio:**
- El sistema permite iniciar sesión únicamente con la cédula para el rol **Comunero** (la contraseña es opcional). Otros roles requieren cédula + contraseña.
- Si la cuenta tiene marcada una **contraseña temporal**, tras el login se redirige obligatoriamente a "Cambiar Contraseña Temporal" antes de poder usar el sistema.

![Espacio para captura: formulario de inicio de sesión con los campos Cédula y Contraseña](capturas/login-formulario.png)

---

### 2.3 Recuperar Contraseña

**Propósito:** Permite a un usuario que olvidó su contraseña solicitar una contraseña temporal, enviada a su correo electrónico registrado.

**Cómo se llega:** Ruta `/forgot-password`, desde el enlace "¿Olvidaste tu contraseña?" en Login.

**Campo del formulario:**
- **Número de Cédula \*** (obligatorio): solo letras y números. Si está vacío: *"Ingresa tu número de cédula."*

**Botones:**
- **"Volver al Login"**: regresa al Login.
- **"Enviar contraseña temporal"**: solicita el envío. Muestra "Enviando..." mientras procesa.
- **"Ir al Login"** (tras envío exitoso): regresa al Login.

**Mensaje de éxito:** *"¡Correo enviado!"* — *"Hemos enviado una contraseña temporal al correo electrónico registrado para la cédula [cédula ingresada]. Revisa tu bandeja de entrada (y la carpeta de spam). Al ingresar con esa contraseña, el sistema te pedirá que establezcas una nueva."*

**Regla de negocio:** El correo de destino es el que ya está registrado en el sistema para esa cédula; el usuario no lo ingresa en esta pantalla.

![Espacio para captura: formulario de recuperación y pantalla de confirmación "¡Correo enviado!"](capturas/recuperar-password.png)

---

### 2.4 Cambiar Contraseña Temporal (primer ingreso)

**Propósito:** Obliga al usuario a establecer una nueva contraseña permanente tras ingresar con una contraseña temporal, por seguridad.

**Cómo se llega:** Ruta `/cambiar-password-temporal`. El sistema redirige aquí automáticamente después de un login con contraseña temporal activa; no se navega manualmente.

**Campos del formulario:**
- **Nueva contraseña \*** (obligatorio, mínimo 6 caracteres). Errores: *"La nueva contraseña es obligatoria."* / *"Debe tener al menos 6 caracteres."*
- **Confirmar nueva contraseña \*** (obligatorio, debe coincidir). Errores: *"Confirma tu nueva contraseña."* / *"Las contraseñas no coinciden."*

**Botones:**
- **"Cerrar sesión"**: cierra la sesión sin completar el cambio, regresa al Login.
- **"Guardar nueva contraseña"**: valida y guarda. Muestra "Guardando..." mientras procesa.

**Mensajes:** Banner ámbar permanente: *"Contraseña temporal activa — Hola [nombre], ingresaste con una contraseña temporal. Por seguridad, debes establecer una nueva contraseña antes de continuar."* Éxito: *"¡Contraseña actualizada exitosamente!"*, luego redirige al Dashboard.

**Regla de negocio:** Es un paso obligatorio; no se puede acceder al Dashboard mientras la contraseña temporal siga activa (salvo cerrando sesión).

![Espacio para captura: pantalla de cambio de contraseña obligatorio con el banner de aviso](capturas/cambiar-password-temporal.png)

---

## 3. Panel Principal (Dashboard)

**Propósito:** Pantalla central tras iniciar sesión. Para directiva/administradores ofrece accesos directos a los módulos de gestión y estadísticas generales de la comunidad. Para comuneros muestra su propio estado de cuenta, terrenos y obligaciones pendientes.

**Cómo se llega:** Ruta `/dashboard`, destino automático tras el login (si no hay contraseña temporal pendiente).

**Botón común:** **"Ver Resumen Estadístico e Información Adicional"** / **"Ocultar Resumen Estadístico"** — despliega u oculta tarjetas de estadísticas y gráficos.

### Vista para roles de gestión (Administrador, Presidente, Vicepresidente, Tesorero, Secretario, Vocales, según permisos)

Cuadrícula de módulos, cada uno con botón **"Abrir Módulo"**:
- **Gestión de Usuarios** (permiso `crear_usuario`) → `/dashboard/usuarios`.
- **Catastros** (permiso `crear_usuario`) → `/dashboard/catastro`.
- **Control de Mingas** (permiso `gestionar_mingas`) → `/dashboard/mingas`.
- **Cobros y Multas** (permiso `gestionar_multas`) → `/dashboard/cobros`.
- **Reportes y Finanzas** (permiso `ver_reportes`) → `/dashboard/reportes`.

Encabezado: *"Bienvenido. Rol activo: [rol]. ¿Qué deseas gestionar hoy?"*, con indicadores de "Comuneros Activos" y "Recaudación Mensual".

### Vista para comuneros

Tres tarjetas:
- **"Mis Terrenos y Derechos"**: lista hasta 3 predios (clave catastral, área en hectáreas, sector); clic navega al detalle del primero (o a "Mis Terrenos" si no hay ninguno).
- **"Próxima Minga"**: fecha, lugar, actividad y multa por inasistencia de la próxima jornada; si no hay ninguna: *"No hay mingas programadas por el momento."*
- **"Obligaciones y Multas"**: total a pagar, cantidad de multas/planillas pendientes y detalle de hasta 2 deudas; si no debe nada: *"¡Estás al día! No tienes deudas pendientes."* Clic navega a Mis Deudas.

Encabezado: *"¡Hola, [nombre]!"* con mensaje *"Aquí puedes revisar tu estado de cuenta y obligaciones comunitarias"*, e indicadores de estado de deuda y cantidad de predios.

### Sección desplegable de estadísticas

- Tarjeta de perfil resumido (no visible para Administrador) con botón **"Ver mi Expediente"**.
- Tarjetas de indicadores (varían por rol): Comuneros Registrados, Recaudación del Mes, Multas Pendientes, Mingas del Mes, Terrenos Catastrados, Ingresos del Año (gestión); Mis Multas Pendientes, Total a Pagar, Asistencia a Mingas, Lotes Registrados (comunero).
- Gráficos (roles de gestión): "Recaudación Mensual (Planillas + Multas)", "Asistencia Global a Mingas", "Predios por Sector Catastrado".
- Gráficos (comuneros): "Mis Predios Catastrados", "Detalle de Obligaciones".

**Regla de negocio:** El contenido completo del Dashboard depende del rol y los permisos específicos del usuario conectado.

![Espacio para captura: Dashboard para un rol de gestión con la cuadrícula de módulos](capturas/dashboard-admin.png)

![Espacio para captura: Dashboard para un comunero con las tarjetas Mis Terrenos, Próxima Minga y Obligaciones](capturas/dashboard-comunero.png)

![Espacio para captura: sección de estadísticas desplegada con tarjetas de indicadores y gráficos](capturas/dashboard-estadisticas.png)

---

## 4. Mi Perfil / Mi Expediente

**Propósito:** Permite al comunero consultar sus datos personales, ver sus derechos de riego asignados (ramal, turno, caudal, cuota) y actualizar su información de contacto y contraseña de acceso.

**Cómo se llega:** Botón "Ver mi Expediente" en la tarjeta de perfil del Dashboard, o desde el menú de navegación.

**Información no editable (Ficha de Perfil):** Identificación (C.I.), Nombres Completos, Fecha de Nacimiento, Estado en el Padrón ("ACTIVO / AL DÍA").

**Información no editable (Derechos de Riego Asignados):** Ramal / Acequia Asignada, Turno Semanal Autorizado, Caudal Concedido (l/s), Cuota de Mantenimiento, Vocal del Ramal Responsable.

**Formulario "Actualizar Datos de Contacto":**
- **Número de Teléfono Celular \*** (obligatorio). Error: *"El teléfono es obligatorio."*
- **Correo Electrónico de Alertas \*** (obligatorio, tipo email). Error: *"El correo electrónico es obligatorio."*
- Botón **"Guardar Información"** (muestra "Guardando...").
- Éxito: *"¡Datos de contacto actualizados correctamente!"*

**Formulario "Cambiar Contraseña de Acceso":**
- **Contraseña Actual \*** (obligatorio).
- **Contraseña Nueva \*** (obligatorio, mínimo 6 caracteres).
- **Confirmar Contraseña Nueva \*** (obligatorio, debe coincidir).
- Botón **"Actualizar Contraseña"** (muestra "Actualizando...").
- Éxito: *"¡Contraseña actualizada con éxito!"*

![Espacio para captura: pantalla "Mi Expediente de Comunero" completa con ficha, derechos de riego y formularios](capturas/perfil-usuario.png)

---

## 5. Módulo de Usuarios y Directiva

### 5.1 Menú de Usuarios

**Propósito:** Pantalla de entrada al módulo de usuarios. Permite elegir entre buscar/consultar usuarios registrados o dar de alta a un nuevo miembro.

**Cómo se llega:** Ruta `/dashboard/usuarios`, desde el menú lateral "Usuarios".

**Elementos:**
- Tarjeta **"Padrón General y Búsqueda"** → botón **"Abrir Padrón"** → `/dashboard/usuarios/padron`.
- Tarjeta **"Agregar Usuario"** → botón **"Nuevo Registro"** → `/dashboard/usuarios/agregar`.

![Espacio para captura: menú con las dos tarjetas de Usuarios](capturas/usuarios-menu.png)

---

### 5.2 Buscar Usuario

**Propósito:** Búsqueda rápida de un usuario específico por cédula o nombre.

**Cómo se llega:** Ruta `/dashboard/usuarios/buscar`.

**Campo de búsqueda:** texto libre, placeholder "Escribe la cédula o nombre...". Busca por nombre o cédula, sin distinguir mayúsculas. La búsqueda es automática mientras se escribe.

**Botón:** **"Volver al Menú"** regresa a `/dashboard/usuarios`.

**Tabla de resultados:** Cédula, Nombre Completo, Sector, Rol (insignia de color), Estado ("Activo" ✓ verde / "Suspendido" ✗).

**Mensaje sin resultados:** *"No se encontró a nadie con '[texto buscado]'"*

![Espacio para captura: campo de búsqueda con resultados de la tabla](capturas/usuarios-buscar.png)

---

### 5.3 Padrón General

**Propósito:** Listado maestro de todos los usuarios/comuneros registrados. Permite buscar, editar datos, cambiar rol o contraseña, y eliminar del padrón.

**Cómo se llega:** Ruta `/dashboard/usuarios/padron`, desde Menú de Usuarios → "Abrir Padrón".

**Buscador:** "Buscar por cédula, nombre o sector..." (filtra en tiempo real). Insignia **"Total: {n}"**.

**Columnas de la tabla:** Cédula (con etiqueta "Tú" si es el usuario conectado), Nombre Completo, Sector, Rol (insignia de color), Estado (Activo / ⏳ Pendiente / Suspendido), y columna de Acciones:
- **Editar datos** (lápiz) → `/dashboard/usuarios/editar/{id}`.
- **Cambiar rol / permisos** (escudo) → abre modal (deshabilitado si es el propio usuario conectado).
- **Eliminar** (papelera, rojo) → modal de confirmación.

**Modal "Cambiar Rol" / "Restablecer Contraseña":**
- Si la persona tiene **cargo de directiva**: el modal se titula "Restablecer Contraseña" (el cargo se administra desde el módulo Directiva). Campo: **Nueva contraseña \*** (obligatorio, mín. 4 caracteres, con mostrar/ocultar).
- Si **no** tiene cargo de directiva: modal "Cambiar Rol". Campo **Rol en el sistema \*** (Comunero / Administrador) y campo opcional **Nueva Contraseña**.
- Botones: **"Cancelar"** y **"Confirmar Cambio"** / **"Restablecer Contraseña"**.

**Modal de eliminación:** *"¿Eliminar a {nombre} del padrón?"* — *"Esta acción no se puede deshacer."* Botón **"Eliminar"**.

**Mensajes:**
- Éxito eliminación: *"{nombre} ha sido eliminado del padrón correctamente."*
- Éxito cambio de rol: *"Rol actualizado a '{nuevoRol}' correctamente."*
- Éxito cambio de contraseña: *"Contraseña actualizada correctamente."*

**Reglas de negocio:**
- Roles asignables libremente: **Comunero** y **Administrador**.
- Los cargos de directiva NO se asignan aquí, sino desde el módulo de Directiva; aquí solo se restablece su contraseña.
- Un usuario no puede cambiar su propio rol.

#### Pasos para cambiar el rol de un comunero
1. Ir a **Padrón General**.
2. Buscar a la persona si la lista es larga.
3. Clic en el ícono de escudo ("Cambiar rol / permisos").
4. Seleccionar el nuevo rol en el modal.
5. Clic en **"Confirmar Cambio"**.

#### Pasos para eliminar un usuario del padrón
1. Localizar al usuario en la tabla.
2. Clic en el ícono de papelera.
3. Confirmar en el modal con **"Eliminar"**.

![Espacio para captura: tabla del padrón con columnas Cédula, Nombre, Sector, Rol, Estado y Acciones](capturas/usuarios-padron-tabla.png)

![Espacio para captura: modal de cambio de rol o restablecimiento de contraseña](capturas/usuarios-padron-modal-rol.png)

---

### 5.4 Agregar / Editar Usuario

**Propósito:** Formulario completo en 3 pasos para registrar a un nuevo comunero con datos personales, contacto y dependientes (hijos). La misma pantalla se usa para **editar** un usuario existente.

**Cómo se llega:**
- Alta: `/dashboard/usuarios/agregar`, desde Menú de Usuarios → "Nuevo Registro".
- Edición: `/dashboard/usuarios/editar/{id}`, desde el ícono lápiz en el Padrón General.

#### Paso 1 — Datos Personales
- **Cédula del Titular \*** — solo números, máx. 10 dígitos, validada con el algoritmo oficial de cédula ecuatoriana. Error: *"Cédula Ecuatoriana inválida"*.
- **Fecha de Nacimiento \***
- **Nombres Completos \*** / **Apellidos Completos \*** — solo letras.
- **Género \*** — selección de catálogo.
- **Zona \*** — selección de catálogo.
- **Sector \*** — depende de la Zona elegida (se habilita después).
- **Checkbox "¿Tiene alguna condición especial o discapacidad?"** — despliega:
  - **Tipo de Condición \***.
  - Si es discapacidad: **% Discapacidad**, **Código Carnet CONADIS**, **Foto/Archivo del Carnet** (JPG, PNG o PDF).
  - **Observación** (si la condición no es "Ninguna").
  - Botón **"Añadir Otra"** para más de una condición.
- **Nivel Académico \*** — Ninguno, Primaria, Secundaria, Tercer Nivel, Cuarto Nivel, Quinto Nivel.
  - Si es Tercer Nivel o superior: sección **"Títulos de Educación Superior"** (nombre del título + archivo PDF/imagen, botón "Añadir Otro Título").

#### Paso 2 — Información de Contacto
- **Número de Teléfono \*** — exactamente 10 dígitos.
- **Operadora** (opcional).
- **Correo Electrónico \*** — obligatorio salvo que el registro quede "Pendiente". Verificación en vivo del dominio del correo.
- **Checkbox "Registrar como Pendiente (requiere confirmación posterior)"** — si se marca, el registro queda en estado Pendiente hasta aprobación manual.

#### Paso 3 — Registro de Hijos
- **¿Cuántos hijos tiene?** (0 a 15) — genera bloques automáticamente.
- Por cada hijo: **Nombres \***, **Apellidos \***, **Cédula** (opcional), **Género**, **Nivel Máximo de Estudios** (con sección de títulos si aplica).

**Validaciones por paso:** cada paso valida sus campos antes de avanzar; mensajes de error indican campos incompletos o con formato incorrecto.

**Mensajes de éxito:**
- Edición: *"¡Actualización exitosa! Perfil guardado."*
- Alta Activo: *"¡Registro exitoso! Perfil completo guardado."*
- Alta Pendiente: *"¡Registro guardado como Pendiente! Requiere aprobación."*

**Regla de negocio:** al crear un usuario nuevo, el sistema asigna automáticamente usuario = cédula, contraseña inicial = cédula, rol por defecto = Comunero.

#### Pasos para registrar un nuevo comunero
1. Desde Menú de Usuarios, clic en **"Nuevo Registro"**.
2. Completar Paso 1 (datos personales, condición especial y nivel académico si aplica).
3. Completar Paso 2 (contacto y estado de registro).
4. Completar Paso 3 (hijos, si tiene).
5. Enviar el formulario y confirmar el mensaje de éxito.

#### Pasos para editar un usuario existente
1. Ir al Padrón General y hacer clic en el ícono de lápiz de la persona.
2. Modificar los campos necesarios en los 3 pasos.
3. Enviar el formulario.

![Espacio para captura: Paso 1 Datos Personales con cédula, nombres, zona y sector](capturas/usuarios-agregar-paso1.png)

![Espacio para captura: Paso 2 Contacto con teléfono, correo y checkbox de estado Pendiente](capturas/usuarios-agregar-paso2.png)

![Espacio para captura: Paso 3 Registro de Hijos con el campo de cantidad y bloques por hijo](capturas/usuarios-agregar-paso3.png)

---

### 5.5 Directiva (Organigrama Actual)

**Propósito:** Muestra la estructura organizativa vigente: Presidente, Vicepresidente, Secretario, Tesorero y Vocales. Permite consultar directivas de periodos pasados.

**Cómo se llega:** Ruta `/dashboard/directiva`, desde el menú lateral "Directiva". El historial se ve agregando `?periodo={año}` a la URL.

**Elementos:**
- Si se ve un periodo histórico: aviso rojo *"⚠️ Estás visualizando un archivo histórico de la Directiva del periodo {periodo}. Estas autoridades ya NO están en funciones."*
- Botón **"Administrar y Registrar Directivas"** (solo Administrador/Presidente) → `/dashboard/directiva/gestionar`.
- **Organigrama en 3 niveles**: Presidente (arriba) → Vicepresidente/Secretario/Tesorero → Vocales y Representantes.
- Cargos sin titular muestran "Por designar" / "⬚ Vacante".

Pantalla de solo lectura (excepto el botón de administración).

![Espacio para captura: organigrama completo con Presidente, Vicepresidente/Secretario/Tesorero y Vocales](capturas/directiva-organigrama.png)

---

### 5.6 Gestión de Directivas

**Propósito:** Registrar un nuevo periodo directivo completo, consultar el historial de periodos anteriores, y reemplazar/designar miembros individuales sin crear un periodo nuevo.

**Cómo se llega:** Ruta `/dashboard/directiva/gestionar`, desde "Directiva" → botón "Administrar y Registrar Directivas" (Administrador o Presidente).

Tres pestañas: **Registrar Nuevo Periodo**, **Ver Historial Pasado**, **Cambiar Miembro**.

#### Pestaña "Registrar Nuevo Periodo"
- **Fecha Inicio de Funciones \***.
- **Fecha Fin de Periodo (Proyectada)** (opcional).
- **N° Resolución de Nombramiento \*** (ej. "RES-2026-001").
- Por cada uno de los 9 cargos (Presidente, Vicepresidente, Secretario, Tesorero, Vocal Principal 1/2/3, Vocal Suplente 1/2): búsqueda de persona por cédula/apellido, y campo **"Asignar Contraseña"** temporal para ese cargo.
- Nota: *"Al guardar, los miembros de la directiva actual pasarán al estado 'Finalizado' automáticamente."*
- Botón **"Guardar Nueva Directiva"**.

#### Pestaña "Ver Historial Pasado"
Tabla: Periodo, Presidente a Cargo, Resolución, Estado, Acciones (**Ver Organigrama**, **Usar para Docs**, **Desactivar**, **Reactivar**).

**Modal "Reactivar Directiva":** advierte que la directiva actual pasará a "Finalizado" y la del periodo elegido volverá a ser la oficial. Botón **"Confirmar Reactivación"**.

#### Pestaña "Cambiar Miembro"
- Aviso de cargos sin designar, si aplica.
- **Cargo a reemplazar/designar/registrar \*** (selección de los 9 cargos).
- **Persona a designar \*** (búsqueda por cédula/apellido).
- **Contraseña temporal para el nuevo miembro** (opcional).
- Botón **"Designar Miembro"** / **"Confirmar Cambio"**.

**Reglas de negocio:**
- Al registrar una nueva directiva completa, la anterior pasa automáticamente a "Finalizado".
- Si una persona designada ya ocupaba otro cargo, ese cargo queda vacante automáticamente.

#### Pasos para registrar un nuevo periodo directivo completo
1. Ir a Directiva → "Administrar y Registrar Directivas".
2. En "Registrar Nuevo Periodo", llenar fecha de inicio y N° de resolución.
3. Buscar y asignar a cada cargo la persona correspondiente, con contraseña temporal.
4. Clic en **"Guardar Nueva Directiva"**.

#### Pasos para cambiar un miembro sin crear un periodo nuevo
1. Ir a "Gestión de Directivas" → pestaña "Cambiar Miembro".
2. Seleccionar el cargo.
3. Buscar y seleccionar a la nueva persona.
4. Clic en **"Designar Miembro"** o **"Confirmar Cambio"**.

![Espacio para captura: pestaña Registrar Nuevo Periodo con fecha, resolución y asignación de cargos](capturas/directiva-gestion-nuevo.png)

![Espacio para captura: pestaña Ver Historial Pasado con tabla de periodos y acciones](capturas/directiva-gestion-historial.png)

![Espacio para captura: pestaña Cambiar Miembro con listado de cargos y formulario de designación](capturas/directiva-gestion-cambiar.png)

---

## 6. Módulo de Mingas

Una **minga** es una jornada de trabajo comunitario obligatorio.

### 6.1 Control de Mingas (menú)

**Propósito:** Pantalla principal del módulo. Da acceso a programar, tomar asistencia, revisar el historial y ver mingas activas, con contador en vivo.

**Cómo se llega:** Menú lateral "Mingas" → "Control de Mingas". Ruta `/dashboard/mingas`.

**Tarjetas:**
1. **Programar Minga** → botón "Crear Convocatoria" → `/dashboard/mingas/programar`.
2. **Tomar Asistencia** → botón "Registrar" → `/dashboard/mingas/activas`.
3. **Historial** → botón "Ver Archivo" → `/dashboard/mingas/historial`.
4. **Mingas Activas** → insignia con el número de mingas activas, botón "Ver y Gestionar" → `/dashboard/mingas/activas`.

**Regla de negocio:** se considera "minga activa" toda minga en estado Programada, En Ejecución, Pospuesta o Suspendida.

![Espacio para captura: las 4 tarjetas del menú de Mingas con el contador de mingas activas](capturas/mingas-menu-principal.png)

---

### 6.2 Programar Minga

**Propósito:** Crear una convocatoria (minga u otro evento comunitario), definiendo fecha, lugar, motivo, multa por inasistencia y sectores/zonas convocados.

**Cómo se llega:** Menú "Mingas → Programar Minga". Ruta `/dashboard/mingas/programar`. Los campos se habilitan progresivamente (uno tras otro).

**Campos:**
1. **Tipo de Evento \*** — Minga Comunitaria, Asamblea General, Sesión de Directiva, Inspección de Campo.
2. **Fecha y Hora Programada \*** — no permite fechas pasadas. Error: *"La fecha es obligatoria"*.
3. **Lugar de Encuentro \*** — Error: *"El lugar es obligatorio"*.
4. **Motivo o Trabajo a Realizar \*** — Error: *"Debe especificar un motivo"*.
5. **Valor Multa Inasistencia ($) \*** — Error: *"Ingrese el valor de la multa"*.
6. **Observación Inicial** (opcional).
7. **Sectores Asignados \*** — modo "Todos los sectores" (por defecto) o "Escoger sectores" (buscador + checkboxes por sector). Error si no se marca ninguno: *"Debe seleccionar al menos un sector o zona para la convocatoria."*

**Botones:**
- **"Crear Convocatoria a Minga"** (envío, muestra "Guardando Convocatoria...").
- **"Volver al Menú"**.

**Éxito:** *"¡Convocatoria de Minga creada exitosamente!"* (redirige automáticamente al menú de Mingas).

#### Pasos para programar una nueva minga
1. Ir a Mingas → Programar Minga.
2. Elegir Tipo de Evento y Fecha/Hora.
3. Escribir Lugar y Motivo.
4. Indicar el Valor de la Multa por Inasistencia.
5. (Opcional) Escribir Observación Inicial.
6. Elegir "Todos los sectores" o marcar sectores específicos.
7. Clic en **"Crear Convocatoria a Minga"**.

![Espacio para captura: formulario completo de Programar Minga con la selección de sectores](capturas/mingas-programar-formulario.png)

---

### 6.3 Mingas Activas

**Propósito:** Listado de mingas en curso o pendientes. Permite ver detalle, tomar asistencia, posponer, reactivar o cancelar.

**Cómo se llega:** Menú "Mingas → Mingas Activas". Ruta `/dashboard/mingas/activas`.

**Cada minga es una tarjeta expandible** con Estado (Programada / En Ejecución / Pospuesta / Suspendida), Motivo, Fecha, Lugar, Total convocados y Multa. Al expandir: Observación, Zonas y Sectores convocados.

**Botones dentro de cada tarjeta:**
- **Tomar Lista** (si está "En Ejecución", o "Programada" con fecha ya pasada) → Registro de Asistencia.
- **Posponer** (Programada, Pospuesta o Suspendida) → modal con Nueva fecha.
- **Reactivar** (Pospuesta o Suspendida) → modal con Nueva fecha.
- **Cancelar** (cualquier estado activo) → modal de confirmación.

**Modal de acción:** campo **Nueva fecha \*** (obligatoria para Posponer/Reactivar), campo de Motivo/Observación (opcional). Botones **"Cancelar"** y confirmación (**"Marcar como Pospuesta"**, **"Confirmar Cancelación"** o **"Reprogramar y Activar"**).

**Estado vacío:** *"No hay mingas activas — Todas las mingas están finalizadas o canceladas."*

#### Pasos para posponer, reactivar o cancelar una minga
1. Entrar a Mingas Activas y expandir la tarjeta deseada.
2. Pulsar Posponer, Reactivar o Cancelar.
3. Completar Nueva fecha (si aplica) y observación.
4. Confirmar con el botón del modal.

![Espacio para captura: lista de mingas activas con una tarjeta expandida y botones de acción](capturas/mingas-activas-lista.png)

![Espacio para captura: modal de "Posponer Minga" con campo de nueva fecha y observación](capturas/mingas-activas-modal-posponer.png)

---

### 6.4 Registro de Asistencia (Tomar Lista)

**Propósito:** Pasar lista el día de la minga: marcar Presente, Faltó (genera multa) o Justificado.

**Cómo se llega:** Desde **Mingas Activas**, botón "Tomar Lista" en la minga correspondiente. Ruta `/dashboard/mingas/asistencia?id=...`.

Sin datos de minga: aviso *"Para pasar lista, ve a Mingas Activas y haz clic en Tomar Lista en la minga correspondiente."*

**Controles:**
- **Buscar Convocado** (por nombre o cédula).
- **Todos Presente** / **Todos Faltó** (marca en bloque a los pendientes).
- **Guardar Lista** (deshabilitado mientras haya pendientes sin marcar).
- Barra de progreso con conteo de Presentes, Faltas, Justificados y Pendientes.

**Tabla de convocados:** Cédula, Nombres, Sector, Estado Actual, Acciones Rápidas (Marcar Presente / Marcar Faltó / Justificar Inasistencia). Si el estado es "Faltó (Pagado)": texto "Multa Cancelada", sin acciones.

**Mensajes:**
- *"Hay X persona(s) sin marcar. Defina el estado de cada una antes de guardar."*
- Éxito: *"Lista registrada correctamente. Las multas han sido generadas."* (regresa automáticamente al menú de Mingas).

**Reglas de negocio:**
- No se puede guardar la lista con personas en estado "Pendiente".
- Al guardar, se generan automáticamente las multas para quienes "Faltaron". Los "Justificados" no generan multa.

#### Pasos para tomar asistencia el día de la minga
1. Ir a Mingas Activas y pulsar "Tomar Lista" en la minga del día.
2. Marcar a cada persona: Presente, Faltó o Justificar (o usar "Todos Presente"/"Todos Faltó" y corregir casos puntuales).
3. Verificar que no queden "Pendientes" en la barra de progreso.
4. Pulsar **"Guardar Lista"**.

![Espacio para captura: pantalla de asistencia con la barra de progreso y acciones rápidas por persona](capturas/mingas-asistencia-tabla.png)

---

### 6.5 Historial de Mingas

**Propósito:** Archivo histórico de todas las jornadas, sin importar su estado. Permite buscar, filtrar, ver detalle de convocados/asistencia, descargar el acta en PDF, y gestionar (posponer/reactivar/cancelar).

**Cómo se llega:** Menú "Mingas → Historial de Mingas". Ruta `/dashboard/mingas/historial`.

**Filtros:**
- **Búsqueda Rápida** (por motivo o fecha, ej. "2025-10").
- **Filtrar por Estado**: Todos, Programadas, En Ejecución, Pospuestas, Finalizadas, Suspendidas, Canceladas.

**Columnas:** Fecha, Motivo y Lugar, Asistencia (solo si "Finalizada"), Multa ($), Estado, Acciones.

**Acciones por fila:**
- **Ver Resumen** (siempre) → modal con tarjetas de Asistencias/Faltas/Justificados y tabla de convocados.
- **Descargar Acta PDF** (solo "Finalizada") → descarga `Acta_Minga_[fecha].pdf`.
- **Posponer** / **Reactivar** / **Cancelar** (según estado, igual que en Mingas Activas).

#### Pasos para consultar el historial y descargar un acta
1. Ir a Mingas → Historial de Mingas.
2. (Opcional) Usar Búsqueda Rápida o Filtrar por Estado.
3. Pulsar **"Ver Resumen"** para revisar el detalle.
4. Si está "Finalizada", pulsar **"Descargar Acta PDF"**.

![Espacio para captura: tabla de Historial de Mingas con filtros de búsqueda y estado](capturas/mingas-historial-tabla.png)

![Espacio para captura: modal de Resumen de Minga con tarjetas y tabla de convocados](capturas/mingas-historial-resumen-modal.png)

---

## 7. Módulo de Catastro y Terrenos

### 7.1 Menú de Catastros

**Propósito:** Pantalla de entrada al módulo. Permite elegir entre consultar el padrón de terrenos o registrar un nuevo predio.

**Cómo se llega:** Ruta `/dashboard/catastro`, menú lateral "Catastros".

**Tarjetas:**
- **Catastros Generales** → botón "Ver Padrón" → `/dashboard/catastro/generales`.
- **Agregar Terreno** → botón "Registrar" → `/dashboard/terrenos`.

![Espacio para captura: las dos tarjetas "Catastros Generales" y "Agregar Terreno"](capturas/catastros-menu.png)

---

### 7.2 Catastro de Predios (Padrón General)

**Propósito:** Listado completo de todos los terrenos: propietario, zona/sector, estado de construcción, área, coordenadas GPS y planimetría.

**Cómo se llega:** Menú "Catastros → Catastro de Predios". Ruta `/dashboard/catastro/generales`.

**Buscador:** "Buscar por propietario, cédula o zona..." (filtra automáticamente).

**Tarjetas resumen:** conteo de predios por estado de construcción (Construida, En Construcción, Lote Baldío, En Planificación, Demolido).

**Botón:** **"Registrar Terreno"** → Registro Múltiple de Terrenos.

**Columnas de la tabla:** Propietario (+copropietarios si aplica), Zona, Sector, Estado (editable en línea), Área (m²), Coordenadas GPS ("Ver en Mapa"), Planimetría ("Ver Planimetría"), Acción (editar estado).

Clic en cualquier fila abre la Ficha de Predio.

**Edición rápida del estado:** ícono de lápiz → selector desplegable → check verde para guardar. Éxito: *"Estado del predio actualizado correctamente."*

#### Pasos para buscar un predio
1. Ir a Catastros → Catastro de Predios.
2. Escribir propietario, cédula o zona en el buscador.
3. Clic en la fila para ver la ficha completa.

#### Pasos para cambiar el estado de un predio desde el padrón
1. Ícono de lápiz en la fila del predio.
2. Elegir el nuevo estado.
3. Confirmar con el check verde.

![Espacio para captura: tabla del padrón general con tarjetas resumen de estados y buscador](capturas/catastro-global.png)

---

### 7.3 Registro Múltiple de Terrenos

**Propósito:** Registrar uno o varios predios nuevos y asignarlos a un mismo comunero (titular), incluyendo copropietarios, coordenadas GPS y escrituras.

**Cómo se llega:** Menú "Catastros → Registrar Terreno". Ruta `/dashboard/terrenos`.

**1. Asignación de Titular:** buscador por cédula o apellido (autocompletar).

**2. Lista de Terrenos** (se habilita tras elegir el titular). Por cada terreno:
- **Clave Catastral \*** — formato automático `18-01-50-01-001-001`.
- **Área (m²) \*** — mínimo 0.01.
- **Estado \*** — Lote Baldío, En Planificación, En Construcción, Construida.
- **Escrituras (Respaldo)** — archivo PDF/JPG/PNG (opcional).
- **Coordenadas GPS** — captura en mapa (opcional).
- **3. Copropietarios (Opcional)** — buscador con selección múltiple.

**Botones:**
- **Eliminar** (por terreno, si hay más de uno).
- **"Añadir Otro Terreno al Mismo Dueño"**.
- **"Finalizar Registro Integral"** (muestra "Guardando...").

**Éxito:** *"¡Terrenos registrados con éxito!"* (regresa automáticamente).

#### Pasos para registrar uno o varios terrenos nuevos
1. Ir a Catastros → Registrar Terreno.
2. Buscar y seleccionar al titular.
3. Completar Clave Catastral, Área y Estado del primer terreno.
4. (Opcional) Adjuntar escrituras y capturar coordenadas GPS.
5. (Opcional) Agregar copropietarios.
6. Si hay más terrenos, pulsar "Añadir Otro Terreno al Mismo Dueño" y repetir.
7. Pulsar **"Finalizar Registro Integral"**.

![Espacio para captura: formulario con titular seleccionado y un bloque "Terreno #1"](capturas/terrenos-registro.png)

---

### 7.4 Corrección Técnica de Predio (Edición)

**Propósito:** Modificar datos técnicos de un predio existente (área, estado, coordenadas) y gestionar copropietarios. No permite cambiar al dueño titular ni la clave catastral (para eso existe "Traspaso de Dominio").

**Cómo se llega:** Desde la Ficha de Predio, botón "Editar Predio". Ruta `/dashboard/catastro/editar/:id`.

**Aviso:** *"El Dueño Titular y la Clave Catastral están bloqueados por seguridad legal. Los cambios quedarán registrados en el historial de auditoría."*

**Campos:**
- Propietario Titular y Clave Catastral (solo lectura).
- **Área Real (m²) \***.
- **Estado de Construcción \***.
- **Coordenadas Georreferenciadas** (mapa).

**Sección Copropietarios:** lista con botón "Quitar" por cada uno; buscador para agregar nuevos.

**Botones:** **"Cancelar"** y **"Guardar Cambios"** (muestra "Guardando...").

**Éxito:** *"Predio actualizado con éxito"*.

#### Pasos para editar los datos técnicos de un predio
1. Abrir la Ficha del Predio y pulsar "Editar Predio".
2. Ajustar Área Real y/o Estado de Construcción.
3. (Opcional) Actualizar coordenadas GPS.
4. (Opcional) Agregar o quitar copropietarios.
5. Pulsar **"Guardar Cambios"**.

![Espacio para captura: formulario de edición con campos bloqueados y sección de copropietarios](capturas/terrenos-edicion.png)

---

### 7.5 Ficha de Predio (Detalles del Terreno)

**Propósito:** Vista detallada de un predio: identificación, propietario/copropietarios, medidas, coordenadas, mapa, y cálculo de la cuota mensual de agua. Permite generar el Certificado Oficial en PDF y ejecutar Traspaso de Dominio.

**Cómo se llega:** Clic en una fila del Catastro de Predios, o desde "Mis Terrenos" (botón "Ver Ficha Completa y PDF"). Ruta `/dashboard/catastro/detalles/:id`.

**Botones de cabecera:**
- **Editar Predio** (roles de gestión) → Corrección Técnica.
- **Traspaso Dominio** (roles de gestión) → modal.
- **Vista Previa PDF** (todos) → abre el certificado en una pestaña nueva.
- **Descargar PDF** (todos) → descarga `Certificado_Catastro_<clave_catastral>.pdf`.

**Pestañas:**
1. **Ficha Catastral**: clave catastral, propietario, copropietarios, sector/zona, estado, escrituras, área (m² y hectáreas), coordenadas GPS.
2. **Vista en Google Maps**: mapa incrustado centrado en el predio.
3. **Cuota Mensual**: cálculo de la cuota de agua (área, fracciones, cuota mensual y anual).

**Fórmula de cobro de agua:**
```
fracciones = ceil(área_m2 / metros_base)     // por defecto 1000
cuota_mensual = fracciones × tarifa_base     // por defecto $5
cuota_anual = cuota_mensual × 12
```

**Certificado PDF** incluye: encabezado institucional, número de certificado `CERT-<clave sin guiones>`, fecha de emisión, datos del titular y copropietarios, información catastral, cálculo de cuota de agua, nota de validez de 90 días, y **firmas reales de Presidente y Secretario/a vigentes**.

**Traspaso de Dominio (modal en 2 pasos):**
- Paso 1: buscar y seleccionar al **nuevo propietario**.
- Paso 2: confirmación "Sale → Entra", aviso *"Las deudas pendientes quedan con el dueño saliente. Los copropietarios se borran con el traspaso."*, campo **Documento o motivo legal del traspaso \*** obligatorio. Botón **"Ejecutar Traspaso"**.

**Éxito del traspaso:** *"Traspaso de dominio ejecutado con éxito"* (la ficha se recarga con los nuevos datos).

#### Pasos para ver el detalle de un predio y generar el PDF
1. Abrir el predio desde el Catastro o "Mis Terrenos".
2. Revisar la pestaña Ficha Catastral, Mapa y Cuota Mensual.
3. Pulsar **"Vista Previa PDF"** o **"Descargar PDF"**.

#### Pasos para hacer un traspaso de dominio
1. En la Ficha del Predio, pulsar **"Traspaso Dominio"**.
2. Buscar y seleccionar al nuevo propietario, pulsar **"Continuar"**.
3. Revisar el resumen "Sale/Entra" y escribir el documento o motivo legal.
4. Pulsar **"Ejecutar Traspaso"**.

![Espacio para captura: pestaña "Ficha Catastral" con datos del propietario y copropietarios](capturas/terreno-detalles-ficha.png)

![Espacio para captura: modal de Traspaso de Dominio en el Paso 2 (Confirmar)](capturas/terreno-detalles-traspaso.png)

![Espacio para captura: vista previa del Certificado de Catastro en PDF con firmas de directiva](capturas/certificado-catastro-pdf.png)

---

### 7.6 Mis Terrenos (comunero)

**Propósito:** El comunero consulta todos los predios que le pertenecen (como titular o copropietario), con resumen de cantidad, área total y hectáreas.

**Cómo se llega:** Ruta `/dashboard/mis-terrenos`, menú lateral "Mi Cuenta → Mis Terrenos" (solo rol Comunero).

**Sin predios:** *"No tienes predios registrados — Para registrar un terreno comunícate con la directiva de la Junta."*

**Tarjetas de resumen:** Predios, Área Total, Hectáreas.

**Tarjeta por terreno:** Sector (+ "Copropietario" si aplica), Estado, Área (m² y hectáreas), Cuota mensual calculada, botón **"Ver Ficha Completa y PDF"**.

#### Pasos para consultar mis predios y obtener el certificado
1. Ir a Mi Cuenta → Mis Terrenos.
2. Revisar el resumen y localizar la tarjeta del predio.
3. Pulsar **"Ver Ficha Completa y PDF"**.
4. En la Ficha, pulsar "Vista Previa PDF" o "Descargar PDF".

![Espacio para captura: resumen de predios, área total y hectáreas con tarjetas por terreno](capturas/mis-terrenos.png)

---

## 8. Módulo de Cobros y Finanzas

### 8.1 Panel de Cobros (menú)

**Propósito:** Pantalla de entrada al módulo. Permite elegir la operación de caja a realizar.

**Cómo se llega:** Menú lateral "Multas y Cobros → Panel de Cobros". Ruta `/dashboard/cobros`.

**Tarjetas:**
| Tarjeta | Botón | Va a |
|---|---|---|
| Ventanilla de Cobro | "Cobrar Deudas" | `/dashboard/cobros/ventanilla` |
| Generar Multa Manual | "Aplicar Sanción" | `/dashboard/cobros/generar` |
| Registrar Egreso | "Declarar Gasto" | `/dashboard/cobros/egreso` |
| Arqueo e Historial | "Ver Transacciones" | `/dashboard/cobros/historial` |
| Emitir Planillas | "Generar Planilla" | `/dashboard/cobros/planilla` |

![Espacio para captura: las 5 tarjetas del módulo de Cobros](capturas/panel-cobros-menu.png)

---

### 8.2 Ventanilla de Cobro

**Propósito:** Buscar a un comunero (o terreno) y cobrarle sus deudas pendientes: multas y/o planillas de agua, en una misma transacción.

**Cómo se llega:** Menú "Multas y Cobros → Ventanilla de Cobro". Ruta `/dashboard/cobros/ventanilla`.

**Búsqueda:** campo de texto (cédula, nombre o clave catastral), mínimo 3 caracteres. Aviso: *"Ingrese al menos 3 caracteres para buscar."* Navegable con flechas ↑/↓ y Enter.

**Panel del comunero seleccionado:** nombre, cédula, sector; si tiene multas pendientes: alerta roja *"X multa(s) pendiente(s) — se agregarán automáticamente al seleccionar una planilla"*.

**Panel de Deudas Pendientes:** tarjetas seleccionables (Planilla/Multa), con motivo, fecha y monto. Sin deudas: *"¡Al Día! Este comunero no tiene deudas pendientes."*

**Campo de pago:** **N° Comprobante \*** (obligatorio). Error: *"El N° de comprobante es obligatorio."*

**Botón:** **"Procesar Pago"** (deshabilitado sin selección o si el pago está bloqueado).

**Reglas de negocio y bloqueos clave:**
- **Auto-agregado de multas:** al marcar una planilla, si hay multas pendientes se agregan automáticamente con el aviso *"Se agregaron automáticamente las multas pendientes. Para pagar planillas de agua, todas las multas deben cancelarse también."*
- **Bloqueo de pago parcial:** si no se incluye el 100% de las multas pendientes junto con la planilla, se bloquea el botón "Procesar Pago" con el mensaje: *"Tiene X multa(s) pendiente(s). Deben pagarse al 100% junto con las planillas de agua."*

**Éxito:** *"Pago registrado. Comprobante #N — Total cobrado: $X.XX"*

**Otros botones:** **"Ver Reporte de Morosos"** → Centro de Reportes. **"Volver al Menú"**.

#### Pasos para cobrar en ventanilla a un comunero
1. Ir a Multas y Cobros → Ventanilla de Cobro.
2. Buscar (mínimo 3 caracteres) y seleccionar al comunero.
3. Revisar y marcar las deudas a cobrar (las multas se agregan automáticamente si corresponde).
4. Ingresar el **N° Comprobante**.
5. Pulsar **"Procesar Pago"**.

![Espacio para captura: búsqueda de comunero, panel de deudas seleccionadas y botón Procesar Pago](capturas/ventanilla-cobro.png)

---

### 8.3 Generar Multa Manual

**Propósito:** Imponer una sanción económica a un comunero por infracciones no generadas automáticamente por el sistema (desperdicio de agua, faltas disciplinarias, daños, etc.).

**Cómo se llega:** Menú "Multas y Cobros → Generar Multa Manual". Ruta `/dashboard/cobros/generar`.

**Paso 1 — Seleccionar Infractor:** buscador (mínimo 3 caracteres) por cédula, nombre o clave.

**Paso 2 — Detalles de la Sanción** (deshabilitado hasta elegir infractor):
- **Motivo o Concepto de la Multa \*** — mínimo 5 caracteres.
- **Monto a Cobrar ($) \*** — entre $0.01 y $10,000.
- **Documento Justificativo (URL / Enlace Opcional)**.

**Botón:** **"Imponer Sanción"** (deshabilitado sin infractor; muestra "Registrando...").

**Éxito:** *"Multa registrada y asignada al comunero correctamente."* (redirige al Panel de Cobros).

#### Pasos para generar una multa manual
1. Ir a Multas y Cobros → Generar Multa Manual.
2. Buscar y seleccionar al comunero infractor.
3. Escribir el Motivo (mínimo 5 caracteres) y el Monto.
4. (Opcional) Pegar el enlace del documento justificativo.
5. Pulsar **"Imponer Sanción"**.

![Espacio para captura: formulario con infractor seleccionado, motivo y monto de la multa](capturas/generar-multa-manual.png)

---

### 8.4 Registrar Egreso

**Propósito:** Documentar los gastos de la Junta para mantener cuadrado el arqueo de caja.

**Cómo se llega:** Menú "Multas y Cobros → Registrar Egreso". Ruta `/dashboard/cobros/egreso`.

**Información mostrada:** banner de Saldo Disponible en Caja Comunitaria.

**Campos:**
- **Concepto o Detalle del Gasto \*** — mínimo 5 caracteres.
- **Monto del Gasto ($) \*** — mayor a $0.00.
- **Nro. Comprobante \*** — solo números enteros.

**Botón:** **"Declarar Egreso"** (muestra "Registrando...").

**Bloqueo por saldo insuficiente:** *"El egreso no puede ser mayor al saldo disponible en caja."*

**Éxito:** *"Gasto registrado correctamente en el Arqueo de Caja."* (redirige a Arqueo e Historial).

#### Pasos para registrar un egreso de caja
1. Ir a Multas y Cobros → Registrar Egreso.
2. Revisar el Saldo Disponible.
3. Escribir Concepto, Monto y N° Comprobante.
4. Pulsar **"Declarar Egreso"**.

![Espacio para captura: banner de saldo disponible y formulario de concepto, monto y comprobante](capturas/registrar-egreso.png)

---

### 8.5 Arqueo e Historial (Libro Diario)

**Propósito:** Control financiero completo: todos los ingresos (cobros) y egresos (gastos), con totales y saldo actual.

**Cómo se llega:** Menú "Multas y Cobros → Arqueo e Historial". Ruta `/dashboard/cobros/historial`.

**Tarjetas de resumen:** Total Ingresos (verde), Total Egresos (rojo), Saldo / Caja Fuerte.

**Filtro:** "Buscar concepto o fecha" (ej. "2026-05").

**Tabla:** Fecha, Comprobante, Concepto/Descripción, Tipo (Ingreso/Egreso), Monto ($).

#### Pasos para hacer arqueo de caja
1. Ir a Multas y Cobros → Arqueo e Historial.
2. Revisar Total Ingresos, Total Egresos y Saldo.
3. Filtrar por concepto o fecha si es necesario.
4. Verificar que el saldo coincida con el efectivo/banco real.

![Espacio para captura: tarjetas de resumen y tabla de transacciones](capturas/arqueo-historial.png)

---

### 8.6 Emitir Planillas (Pago de Agua)

**Propósito:** Consultar y cobrar las planillas de agua de un terreno por uno o varios meses, y generar masivamente las planillas de un mes específico.

**Cómo se llega:** Menú "Multas y Cobros → Emitir Planillas". Ruta `/dashboard/cobros/planilla`.

**Panel de Generación Manual** (botón "Generación Manual"): *"El sistema genera automáticamente el día 1 de cada mes. Usa esto si necesitas forzar la generación de un mes específico."* Selector de Mes y Año, botón **"Generar [Mes] [Año]"**.

**Buscador de terreno/comunero:** criterio (Cédula / Nombres / Clave Catastral) + campo de búsqueda (mínimo 3 caracteres).

**Alerta de multas pendientes (bloqueo):** *"Pago bloqueado — X multa(s) pendiente(s)"* — *"Cancélelas en Ventanilla de Cobro para poder pagar el agua."*

**Selector de Período:** 1 mes, Trimestral, Semestral, Anual, Personalizado, con Mes/Año (y rango si es personalizado). Botón **"Consultar período"**.

**Tabla de meses:** Mes, Estado (Pagado / Pendiente), Monto, Comprobante, Fecha pago. Total pendiente al pie.

**Formulario de pago:** **N° Comprobante / Factura \*** y botón **"Pagar X mes(es) — $Total"** (se bloquea con multas pendientes, mostrando "🔒 Pago Bloqueado").

**Reglas de negocio clave:**
- Fórmula de cobro: `ceil(área_m² / 1000) × $5.00` por mes, **por terreno** (no por persona).
- Copropietarios no reciben planilla propia; el cobro va siempre al titular.
- No se puede pagar el agua si hay multas pendientes.

#### Pasos para emitir/cobrar una planilla de agua
1. Ir a Multas y Cobros → Emitir Planillas.
2. Buscar y seleccionar el terreno (por cédula, nombre o clave catastral).
3. Si hay multas pendientes, ir primero a Ventanilla de Cobro a cancelarlas.
4. Elegir el período y pulsar **"Consultar período"**.
5. Ingresar el N° Comprobante y pulsar **"Pagar X mes(es) — $Total"**.

#### Pasos para generar planillas masivas de un mes (administrador)
1. En Emitir Planillas, abrir "Generación Manual".
2. Elegir mes y año.
3. Pulsar **"Generar [Mes] [Año]"**.

![Espacio para captura: buscador de terreno con criterio y tarjeta de terreno seleccionado](capturas/emitir-planillas-busqueda.png)

![Espacio para captura: tabla de meses con estado Pagado/Pendiente y formulario de pago](capturas/emitir-planillas-tabla-periodo.png)

---

### 8.7 Mis Deudas (comunero)

**Propósito:** El comunero consulta sus deudas pendientes con la Junta: multas y planillas de agua sin pagar. Pantalla de **solo lectura**; el pago se hace presencialmente en Ventanilla de Cobro.

**Cómo se llega:** Ruta `/dashboard/mis-deudas`, desde el Dashboard o menú del comunero.

**Tarjetas:** Total Pendiente (rojo si >$0 con *"Acércate a la tesorería para cancelar."*, verde si $0), Multas Pendientes, Planillas de Agua.

**Tabla "Detalle de Obligaciones":** Tipo (Multa/Planilla, + "Compartido" si aplica), Concepto/Motivo, Fecha Emisión, Monto, Estado.

**Sin deudas:** *"No tienes deudas pendientes — Tu cuenta está al día con la Junta de Agua."*

#### Pasos para que un comunero revise sus deudas
1. Ingresar al sistema.
2. Ir a "Mi Estado de Cuenta".
3. Revisar Total Pendiente y el detalle de obligaciones.
4. Acercarse a la tesorería con ese detalle para pagar.

![Espacio para captura: tarjetas de resumen y tabla de detalle de obligaciones](capturas/mis-deudas.png)

---

### 8.8 Centro de Reportes

**Propósito:** Generar documentos PDF oficiales (padrón, morosidad, balance) para asambleas y auditorías.

**Cómo se llega:** Menú lateral "Reportes". Ruta `/dashboard/reportes`.

**Tipos de reporte (tarjetas):**
1. **Padrón de Usuarios** — filtros jerárquicos Zona → Sector.
2. **Reporte de Morosidad** — filtros progresivos: Origen de la Deuda → Monto mínimo → Desde Fecha → Hasta Fecha.
3. **Balance Financiero** — Período (Este mes / Mes Anterior / Todo el año / Rango personalizado).

**Botones:** **"Cancelar"**, **"Previsualizar"** (vista previa embebida), **"Descargar [Nombre del Reporte]"** (descarga el PDF final).

#### Pasos para generar un reporte
1. Ir a Reportes.
2. Elegir el tipo de reporte.
3. Completar los filtros paso a paso.
4. (Opcional) Pulsar "Previsualizar".
5. Pulsar **"Descargar [Nombre del Reporte]"**.

![Espacio para captura: las tres tarjetas de reportes disponibles](capturas/centro-reportes-tarjetas.png)

![Espacio para captura: panel de filtros progresivo y botones de acción](capturas/centro-reportes-filtros.png)

---

## 9. Módulo de Administración

### 9.1 Panel de Administración

**Propósito:** Portada del módulo de Administración: elegir entre Configuración Global o Bitácora/Auditoría.

**Cómo se llega:** Menú lateral "Administración → Panel Admin". Ruta `/dashboard/administracion`. Requiere permiso `administrar_sistema`.

**Tarjetas:**
- **Configuración Global** → botón "Abrir Configuración" → `/dashboard/administracion/configuracion`.
- **Bitácora / Auditoría** → botón "Ver Bitácora" → `/dashboard/administracion/bitacora`.

![Espacio para captura: las dos tarjetas de Administración](capturas/panel-administracion.png)

---

### 9.2 Configuración Global del Sistema

**Propósito:** Ajustar parámetros del ERP: tarifas, multas, cuotas, zonas/sectores y títulos educativos.

**Cómo se llega:** Menú "Administración → Configuración". Ruta `/dashboard/administracion/configuracion`.

Tres pestañas: **Parámetros y Tarifas**, **Zonas y Sectores**, **Títulos Universitarios**.

#### Pestaña "Parámetros y Tarifas"

| Clave interna | Nombre visible |
|---|---|
| `TARIFA_METROS_BASE` | Área Base de Terreno para Cobro (m²) |
| `TARIFA_VALOR_BASE` | Costo Base a Cobrar por el Área ($) |
| `valor_multa_minga_base` | Valor de Multa por Inasistencia a Minga ($) |
| `valor_cuota_mensual` | Cuota Mensual de Mantenimiento de Agua ($) |
| `dias_gracia_pago` | Días de Gracia Antes de Generar Mora |
| `nombre_junta` | Nombre de la Organización |
| `tasa_interes_mora` | Tasa de Interés por Mora (Decimal) |

Panel de **"Vista previa de tarifa"**: calcula ejemplos de cuota mensual para terrenos de 500, 1000, 2500 y 5000 m² según los valores ingresados.

**Botón:** **"Guardar Cambios"**. Éxito: *"Parámetros del sistema actualizados correctamente."*

#### Pestaña "Zonas y Sectores"

**Columna Zonas:** campo "Nombre de nueva Zona..." (solo letras/espacios/acentos) + botón "+". Listado editable ("Editar" → campo + "Guardar"/"Cancelar").

**Columna Sectores:** selección de Zona + campo "Nuevo Sector..." + botón "+". Listado editable igual que Zonas.

> No existe opción de eliminar, solo agregar y editar (renombrar).

#### Pestaña "Títulos Universitarios"

Campo de texto (ej. "Ingeniero Agrónomo") + botón **"Agregar Título"**. Cuadrícula de títulos existentes (solo consulta, sin editar/eliminar).

#### Pasos para actualizar una tarifa o parámetro
1. Ir a Administración → Configuración → pestaña "Parámetros y Tarifas".
2. Editar el valor del parámetro deseado.
3. Revisar la "Vista previa de tarifa".
4. Pulsar **"Guardar Cambios"**.

#### Pasos para agregar una nueva Zona o Sector
1. Ir a la pestaña "Zonas y Sectores".
2. Zona: escribir el nombre y pulsar "+". Sector: elegir la Zona, escribir el nombre y pulsar "+".

#### Pasos para agregar un nuevo Título
1. Ir a la pestaña "Títulos Universitarios".
2. Escribir el nombre del título y pulsar **"Agregar Título"**.

![Espacio para captura: pestaña Parámetros y Tarifas con la lista de valores editables](capturas/configuracion-parametros.png)

![Espacio para captura: pestaña Zonas y Sectores con ambas columnas](capturas/configuracion-zonas-sectores.png)

![Espacio para captura: pestaña Títulos Universitarios con formulario y cuadrícula](capturas/configuracion-titulos.png)

---

### 9.3 Bitácora de Auditoría

**Propósito:** Registro histórico e inmutable de operaciones críticas (INSERT/UPDATE/DELETE) sobre la base de datos, para control y transparencia.

**Cómo se llega:** Panel de Administración → tarjeta "Bitácora / Auditoría" → botón "Ver Bitácora". Ruta `/dashboard/administracion/bitacora`.

**Columnas:** Fecha y Hora, Usuario, Tabla Afectada, Operación (INSERT verde / UPDATE amarillo / DELETE rojo), Detalle (botón "Ver Cambios").

**"Ver Cambios":** abre una ventana con los datos anteriores y nuevos del registro, en formato técnico (JSON).

No cuenta con filtros: se listan todos los registros disponibles.

#### Pasos para consultar la bitácora de auditoría
1. Ir a Administración → Panel Admin → "Ver Bitácora".
2. Revisar Fecha, Usuario, Tabla y Operación en la tabla.
3. Pulsar **"Ver Cambios"** para ver el detalle antes/después.

![Espacio para captura: tabla de Bitácora con varias operaciones y el botón "Ver Cambios"](capturas/bitacora-auditoria.png)

---

## 10. Reglas de negocio clave (resumen)

Estas reglas atraviesan varios módulos y son importantes para entender el comportamiento del sistema:

1. **Cobro de agua:** `ceil(área_m² / 1000) × $5.00` por mes, **por terreno** (no por persona). Los valores base son configurables desde Administración → Configuración.
2. **Planillas por terreno:** una persona con 3 terrenos recibe 3 planillas independientes.
3. **Copropietarios no reciben planilla propia:** el cobro siempre va al titular del terreno.
4. **Multas bloquean el pago de agua:** si un comunero tiene multas pendientes, no puede pagar solo la planilla de agua — debe cancelar el 100% de las multas junto con la planilla. En Ventanilla de Cobro, las multas se agregan automáticamente al seleccionar una planilla.
5. **Login:** solo con cédula → accede como Comunero (se crea usuario automáticamente si no existe). Cédula + contraseña → verificación normal para roles de gestión/directiva.
6. **Contraseña temporal:** tras un restablecimiento o creación de cuenta, el sistema fuerza el cambio de contraseña en el siguiente ingreso.
7. **Estado de registro de una persona:** *Pendiente* (correo no obligatorio, requiere aprobación) o *Activo* (flujo normal).
8. **Mingas:** al tomar asistencia, quienes "Faltan" generan multa automáticamente; los "Justificados" no.
9. **Directiva:** al registrar un nuevo periodo completo, la directiva anterior pasa automáticamente a estado "Finalizado".
10. **Traspaso de dominio de un terreno:** las deudas pendientes quedan con el dueño saliente; los copropietarios se eliminan y deben volver a registrarse si corresponde.

---

## 11. Guía técnica: subir Chibutech a un servidor con cPanel

> **Esta sección es para la persona técnica** encargada de instalar el sistema en el hosting, no para el usuario final. Está escrita a partir del error real "Acceso denegado" que aparece al intentar crear la base de datos en phpMyAdmin/cPanel.

### 11.0 Diagnóstico del error "Acceso denegado" que estás viendo

Se revisó el archivo que genera toda la base de datos (`database/01_chibutech_completo.sql`) y se encontraron **dos causas concretas** que provocan "Acceso denegado" al importarlo en phpMyAdmin de cPanel:

**Causa 1 — El script intenta crear la base de datos por sí mismo.**
Las primeras dos líneas del archivo son:
```sql
CREATE DATABASE IF NOT EXISTS basechi;
USE basechi;
```
En un hosting compartido con cPanel **nunca se crea la base de datos con una instrucción SQL**. cPanel obliga a crearla desde su panel visual, y además le agrega automáticamente el prefijo de tu usuario de cPanel (por ejemplo, si tu usuario es `chibutec`, la base de datos real terminará llamándose `chibutec_basechi`, nunca `basechi` a secas). El usuario de base de datos que te da tu hosting **no tiene permiso para crear bases de datos nuevas** — de ahí el "Acceso denegado" apenas arranca la importación.

**Causa 2 — Los 18 disparadores (triggers) de auditoría tienen un "dueño" que no existe en tu hosting.**
El sistema audita automáticamente quién crea, edita o borra registros mediante *triggers*. Al exportar la base de datos desde el entorno de desarrollo (Docker, con usuario `root`), cada trigger quedó marcado así:
```sql
DEFINER=`root`@`localhost`
```
Esa marca le dice a MySQL "este trigger pertenece al usuario root". Tu cuenta de hosting **no es root** y no tiene el privilegio especial `SUPER`, así que MySQL rechaza crear cualquier objeto (trigger, vista, procedimiento) que declare como dueño a un usuario distinto del que está conectado. El mensaje típico en phpMyAdmin es:
```
#1227 - Access denied; you need (at least one of) the SUPER privilege(s) for this operation
```
que en la práctica se ve como "Acceso denegado" al llegar a cualquiera de los 28 bloques `CREATE TRIGGER` del archivo.

**Causa 3 — El `sql_mode` de cada trigger incluye una opción que MySQL 8 ya no reconoce.**
Cada bloque de creación de trigger fija temporalmente el modo SQL así:
```sql
SET sql_mode = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
```
`NO_AUTO_CREATE_USER` fue **eliminado de MySQL en la versión 8.0** (el motor de MariaDB 10.6 usado en desarrollo todavía lo acepta, pero muchos hostings compartidos ya corren MySQL 8.x o una MariaDB más reciente que no lo reconoce). Al llegar a esa línea, MySQL devuelve exactamente el error que muestra tu captura:
```
#1231 - Variable 'sql_mode' no puede ser configurada para el valor de 'NO_AUTO_CREATE_USER'
```

**Solución aplicada:** ya se generó (y se regeneró tras detectar la Causa 3) una copia corregida del script, lista para hosting compartido, sin ninguna de las tres causas anteriores:

```
database/01_chibutech_hosting_compartido.sql
```

Tiene exactamente las mismas tablas, datos y triggers que el original, pero **sin** la línea `CREATE DATABASE`/`USE`, **sin** los `DEFINER=root` y **sin** `NO_AUTO_CREATE_USER` en ningún `sql_mode` (al quitar esa marca, MySQL asigna el trigger automáticamente a tu propio usuario de hosting, y el modo SQL queda con solo las opciones que sí existen en MySQL 8). **Usa este archivo, no el original, en el paso 11.3. Si ya intentaste importar antes, vuelve a descargar/usar la versión actual de este archivo — fue regenerado.**

---

### 11.1 Requisitos del hosting

Verifica en tu panel de cPanel (sección "Estadísticas" o pregúntale a tu proveedor) que el plan incluya:

| Requisito | Dónde se configura en cPanel |
|---|---|
| PHP **8.2** o superior | "MultiPHP Manager" / "Select PHP Version" |
| Extensiones PHP: `mbstring`, `pdo_mysql`, `openssl`, `bcmath`, `ctype`, `fileinfo`, `curl`, `xml`, `tokenizer`, `json` | "Select PHP Version" → pestaña "Extensions" |
| MySQL o MariaDB | "MySQL® Databases" |
| Poder crear subdominios | "Subdomains" o "Domains" |
| SSL gratis (AutoSSL / Let's Encrypt) | "SSL/TLS Status" |
| Terminal / acceso SSH (recomendado, no obligatorio) | "Terminal" (si tu plan lo incluye) |

No necesitas Node.js en el servidor: el frontend se compila en tu computador y solo se sube el resultado (archivos estáticos).

---

### 11.2 Paso 1 — Crear la base de datos y el usuario en cPanel

1. En cPanel, entra a **"MySQL® Databases"** ("Bases de datos MySQL").
2. En **"Create New Database"**, escribe `basechi` y pulsa **Create Database**. cPanel la creará como `tuusuario_basechi` (anota el nombre completo real que te muestre).
3. Baja a **"MySQL Users" → "Add New User"**: escribe un nombre de usuario y genera una contraseña segura (usa el botón "Password Generator"). Pulsa **Create User**. El usuario final quedará como `tuusuario_dbuser`.
4. En **"Add User To Database"**, selecciona el usuario y la base de datos que acabas de crear, pulsa **Add**.
5. En la pantalla de privilegios, marca **"ALL PRIVILEGES"** y pulsa **Make Changes**.
6. Anota estos 3 datos reales (los necesitarás en el paso 11.4):
   - Base de datos: `tuusuario_basechi`
   - Usuario: `tuusuario_dbuser`
   - Contraseña: la que generaste

![Espacio para captura: pantalla de cPanel "MySQL® Databases" con la base y el usuario creados](capturas/cpanel-crear-bd.png)

---

### 11.3 Paso 2 — Importar la base de datos vía phpMyAdmin (sin error)

1. En cPanel, entra a **phpMyAdmin**.
2. En el panel izquierdo, selecciona tu base de datos (`tuusuario_basechi`).
3. Ve a la pestaña **"Importar"** ("Import").
4. En **"Seleccionar archivo"**, elige el archivo **`database/01_chibutech_hosting_compartido.sql`** (el corregido — **no** el archivo `01_chibutech_completo.sql` original, ese es el que causa el "Acceso denegado").
5. Deja el formato en **SQL** y el resto de opciones por defecto.
6. Pulsa **"Continuar"** / **"Go"**.
7. Espera a que termine (el archivo pesa ~300 KB, no debería tardar ni topar límites de subida).
8. Verifica: en el panel izquierdo deben aparecer todas las tablas dentro de `tuusuario_basechi`. Entra a cualquier tabla con auditoría (por ejemplo `Persona`) → pestaña **"Disparadores"** ("Triggers") y confirma que los 3 triggers de esa tabla existan sin error.

Si aun así ves "Acceso denegado" en este paso, revisa el [checklist completo](#119-checklist-de-acceso-denegado--todas-las-causas-posibles) al final de esta sección.

![Espacio para captura: pestaña Importar de phpMyAdmin con el archivo 01_chibutech_hosting_compartido.sql seleccionado](capturas/phpmyadmin-importar.png)

---

### 11.4 Paso 3 — Subir y configurar el backend (Laravel)

1. Comprime la carpeta `backend/` de tu proyecto **sin** las carpetas `vendor/` y `node_modules` (no existen en backend, pero sí evita subir `storage/logs` con archivos viejos).
2. Sube el `.zip` con el **Administrador de Archivos de cPanel** (File Manager) a una carpeta **fuera de `public_html`**, por ejemplo `laravel_chibutech/` al mismo nivel que `public_html`. Esto evita que el código PHP quede accesible directamente desde el navegador. Descomprímelo ahí.
3. Crea un subdominio para la API, por ejemplo `api.mi-dominio.com` (cPanel → **"Subdomains"**).
4. Muy importante: en la configuración del subdominio, el **"Document Root"** debe apuntar exactamente a:
   ```
   laravel_chibutech/backend/public
   ```
   (la carpeta `public` de Laravel, **no** la raíz de `backend/`). Laravel siempre se sirve desde ahí.
5. En **"MultiPHP Manager"**, asigna PHP 8.2 al subdominio `api.mi-dominio.com`. En **"Select PHP Version"** para ese dominio, activa las extensiones listadas en 11.1.
6. Si tienes Terminal/SSH, entra a la carpeta `backend/` y ejecuta:
   ```bash
   composer install --no-dev --optimize-autoloader
   ```
   Si **no** tienes Terminal, ejecuta ese mismo comando en tu computador dentro de la carpeta `backend/` (con Composer instalado localmente) y sube la carpeta `vendor/` resultante comprimida.
7. Copia `backend/.env.example` a `backend/.env` (con el Administrador de Archivos o por Terminal: `cp .env.example .env`) y edítalo con estos valores:
   ```env
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://api.mi-dominio.com

   DB_CONNECTION=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_DATABASE=tuusuario_basechi
   DB_USERNAME=tuusuario_dbuser
   DB_PASSWORD=la_contraseña_que_creaste

   FRONTEND_URL=https://mi-dominio.com
   ```
8. Genera la clave de la aplicación:
   - Con Terminal: `php artisan key:generate --force`
   - Sin Terminal: ejecuta el mismo comando en tu entorno Docker local (`docker compose exec backend php artisan key:generate --show`) y copia manualmente el valor resultante en `APP_KEY=` dentro del `.env` del servidor.
9. Da permisos de escritura a `backend/storage` y `backend/bootstrap/cache` (clic derecho → Permissions → 755, o 775 si tu hosting lo exige) desde el File Manager.
10. **No ejecutes `php artisan migrate`** en este punto: ya creaste todas las tablas y triggers al importar el SQL en el paso 11.3. Si migras encima, Laravel intentará crear tablas que ya existen y fallará.
    - Si en cambio prefieres arrancar **sin** los datos de prueba del entorno de desarrollo (una base limpia), no importes el SQL en el paso 11.3 y en su lugar ejecuta aquí `php artisan migrate --force` seguido de `php artisan db:seed --force` (esto recrea la estructura y solo los catálogos/usuario administrador iniciales).

![Espacio para captura: configuración del subdominio api.mi-dominio.com con Document Root apuntando a backend/public](capturas/cpanel-subdominio-backend.png)

---

### 11.5 Paso 4 — Compilar y subir el frontend (React)

La URL del backend **no** está escrita dentro del código que se compila — vive en un archivo aparte, `frontend/public/config.js`, que se copia tal cual a `dist/config.js` al compilar. Esto significa que **no hace falta saber el dominio final antes de compilar**: se puede ajustar después, directamente en el servidor, con el editor de texto de cPanel, sin instalar Node.js ni volver a compilar. Ideal para cuando la persona que compila el proyecto no es la misma que lo sube al hosting.

1. En tu computador, dentro de `frontend/`, genera la versión de producción:
   ```bash
   npm install
   npm run build
   ```
   Esto crea una carpeta `frontend/dist/` con archivos estáticos (HTML, JS, CSS) y el archivo `config.js`.
2. Crea un subdominio o usa el dominio principal para el frontend, por ejemplo `mi-dominio.com` o `app.mi-dominio.com`, con Document Root apuntando a `public_html` (o `public_html/app` si usas subcarpeta).
3. Sube **el contenido** de `frontend/dist/` (no la carpeta `dist` en sí) dentro del Document Root del frontend, vía File Manager o FTP/SFTP. Al terminar, `index.html` y `config.js` deben quedar **directamente** dentro de esa carpeta (no un nivel más adentro).
4. Ya en el servidor, con el **Administrador de Archivos de cPanel**, abre `config.js` con el botón "Editar" (ícono de lápiz) y cambia la línea:
   ```js
   window.__API_BASE_URL__ = 'http://localhost:8080/api';
   ```
   por la URL real de tu API:
   ```js
   window.__API_BASE_URL__ = 'https://api.mi-dominio.com/api';
   ```
   Guarda el archivo. No hace falta recompilar ni volver a subir nada — con recargar la página (Ctrl+F5) alcanza. Si en el futuro cambia el dominio, se repite solo este paso.
5. Como el sistema usa React Router (rutas como `/dashboard/usuarios`), crea un archivo `.htaccess` en esa misma carpeta con este contenido para que recargar la página en cualquier ruta no dé error 404:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

![Espacio para captura: contenido de frontend/dist subido dentro de public_html vía File Manager](capturas/cpanel-subir-frontend.png)

---

### 11.6 Paso 5 — Dominios, CORS y HTTPS

1. **HTTPS:** en cPanel → **"SSL/TLS Status"**, activa **AutoSSL** para ambos subdominios (`mi-dominio.com` y `api.mi-dominio.com`). Es gratuito y se renueva solo.
2. **CORS (para que el frontend pueda hablar con la API):** edita `backend/config/cors.php` en el servidor y agrega tu dominio real de frontend a `allowed_origins`:
   ```php
   'allowed_origins' => [
       'https://mi-dominio.com',
       'https://app.mi-dominio.com', // si usaste subdominio para el frontend
   ],
   ```
3. Tras editar `.env` o `config/cors.php`, limpia la caché de configuración (por Terminal, dentro de `backend/`):
   ```bash
   php artisan config:clear
   php artisan cache:clear
   ```
4. Prueba el login desde `https://mi-dominio.com` — si ves un error de CORS en la consola del navegador (F12), confirma que el dominio exacto (con `https://` y sin `/` final) esté en `allowed_origins`.

---

### 11.7 Mantenimiento: actualizar el sistema tras cambios

Cada vez que se actualice el código del proyecto:

- **Backend:** sube los archivos PHP modificados, y si hubo cambios en la base de datos, aplica solo esos cambios puntuales por phpMyAdmin (pestaña SQL) en lugar de reimportar todo el archivo completo (para no perder los datos ya cargados en producción). Si hubo dependencias nuevas de Composer, vuelve a ejecutar `composer install --no-dev` y `php artisan config:clear`.
- **Frontend:** vuelve a ejecutar `npm run build` en tu computador y sube de nuevo el contenido de `dist/` reemplazando los archivos anteriores.
- **Backups:** programa una tarea periódica en cPanel → **"Backup"** o **"Backup Wizard"** para respaldar la base de datos automáticamente (semanal, como mínimo). También puedes exportar manualmente desde phpMyAdmin (pestaña "Exportar") antes de cualquier actualización importante.

---

### 11.8 Alternativa: servidor propio (VPS) con Docker

Si en el futuro migras a un servidor privado (VPS) donde sí tengas acceso root (DigitalOcean, Hetzner, AWS Lightsail, etc.), el proceso es más simple porque puedes usar exactamente el mismo `docker-compose.yml` que usas en desarrollo:

1. Instala Docker y Docker Compose en el VPS (Ubuntu: `curl -fsSL https://get.docker.com | sh`).
2. Sube el proyecto completo (`git clone` de tu repositorio, o `scp`/`rsync` de la carpeta).
3. Antes de levantar los contenedores, cambia las contraseñas por defecto en `docker-compose.yml` y en `backend/.env` (las que aparecen en este manual, como `Chibutech2026` o `root_super_secreto`, son solo para desarrollo local y **no deben usarse en un servidor expuesto a internet**).
4. En `backend/.env` ajusta `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL` y `FRONTEND_URL` con tu dominio real.
5. **No publiques el puerto de la base de datos (3308) hacia internet** — en `docker-compose.yml`, quita o restringe la línea `ports: - "3308:3306"` del servicio `db` si el servidor tiene IP pública; solo el backend necesita hablarle a la base de datos, y lo hace dentro de la red interna de Docker sin necesidad de exponer el puerto.
6. Coloca un proxy inverso delante de los contenedores (Nginx o Traefik) para servir con HTTPS real (Let's Encrypt/Certbot), redirigiendo `mi-dominio.com` al contenedor `frontend` (o mejor, a una build estática servida por Nginx) y `api.mi-dominio.com` al contenedor `backend`.
7. Ejecuta `docker compose up -d --build`. La base de datos se crea automáticamente la primera vez importando lo que haya en `./database/` (en este caso sí puedes usar el archivo `01_chibutech_completo.sql` original, porque el contenedor de MariaDB corre como root y no tiene las restricciones de cPanel).
8. Programa backups con `docker compose exec db mysqldump -u root -p basechi > backup.sql` en una tarea `cron` periódica.

---

### 11.9 Checklist de "Acceso denegado" — todas las causas posibles

Si sigues viendo "Acceso denegado" en algún punto del proceso, revisa en orden:

| Dónde aparece | Causa más probable | Solución |
|---|---|---|
| Al importar el SQL en phpMyAdmin | Usaste el archivo original (`01_chibutech_completo.sql`) en vez del corregido | Usa `database/01_chibutech_hosting_compartido.sql` (ver 11.0 y 11.3) |
| Al importar, mensaje menciona "SUPER privilege" | Quedó algún `DEFINER=` root sin limpiar | Vuelve a generar el archivo corregido o edítalo manualmente buscando y borrando cualquier `DEFINER=\`root\`@\`localhost\`` |
| Al importar, mensaje `#1231 - Variable 'sql_mode' no puede ser configurada para el valor de 'NO_AUTO_CREATE_USER'` | Tu MySQL es versión 8+ y ya no reconoce ese modo SQL (ver Causa 3 en 11.0) | Usa la versión más reciente de `01_chibutech_hosting_compartido.sql` (ya no contiene `NO_AUTO_CREATE_USER`); si lo editaste a mano, busca y borra `NO_AUTO_CREATE_USER,` en todas las líneas `SET sql_mode = '...'` |
| Al importar, mensaje menciona "CREATE command denied" o el nombre `basechi` sin prefijo | El script intenta crear la base de datos o usa el nombre sin el prefijo de tu cPanel | Confirma que seleccionaste primero tu base de datos real (`tuusuario_basechi`) en el panel izquierdo de phpMyAdmin antes de importar |
| Al conectar Laravel a la base de datos ("SQLSTATE[HY000] [1045] Access denied for user") | `DB_USERNAME`/`DB_PASSWORD`/`DB_DATABASE` en `backend/.env` no coinciden con los datos reales de cPanel | Verifica los 3 valores contra lo anotado en el paso 11.2 (deben incluir el prefijo de tu usuario cPanel) |
| Al conectar Laravel a la base de datos | El usuario no fue agregado a la base de datos, o no tiene "ALL PRIVILEGES" | Repite el paso "Add User To Database" en cPanel → MySQL® Databases |
| Al hacer `git push` / `git pull` | Credenciales de Git vencidas o sin permisos en el repositorio remoto | Verifica el token/llave SSH configurado con tu proveedor de Git (GitHub/GitLab) |
| Al conectar por SSH/Terminal al hosting | El plan de hosting no incluye SSH, o la IP no está en la lista blanca | Consulta con tu proveedor si el plan permite Terminal/SSH; si no, sigue el flujo de 11.4 sin Terminal (subiendo `vendor/` ya compilado) |
| Al subir archivos por FTP | Permisos de la carpeta destino, o límite de cuota de disco superado | Revisa permisos de carpeta (755) y el espacio disponible en cPanel → "Estadísticas" |

---

## Anexo — Lista de capturas pendientes

Usa esta lista como checklist para completar el manual con imágenes. Guarda cada archivo en `docs/manual/capturas/` con el nombre indicado.

| # | Archivo | Pantalla |
|---|---|---|
| 1 | `sidebar-menu-completo.png` | Menú lateral completo |
| 2 | `landing-inicio.png` | Página de inicio |
| 3 | `login-formulario.png` | Login |
| 4 | `recuperar-password.png` | Recuperar contraseña |
| 5 | `cambiar-password-temporal.png` | Cambio de contraseña obligatorio |
| 6 | `dashboard-admin.png` | Dashboard rol de gestión |
| 7 | `dashboard-comunero.png` | Dashboard comunero |
| 8 | `dashboard-estadisticas.png` | Estadísticas del dashboard |
| 9 | `perfil-usuario.png` | Mi Expediente |
| 10 | `usuarios-menu.png` | Menú de Usuarios |
| 11 | `usuarios-buscar.png` | Buscar Usuario |
| 12 | `usuarios-padron-tabla.png` | Padrón General |
| 13 | `usuarios-padron-modal-rol.png` | Modal cambiar rol |
| 14 | `usuarios-agregar-paso1.png` | Agregar Usuario paso 1 |
| 15 | `usuarios-agregar-paso2.png` | Agregar Usuario paso 2 |
| 16 | `usuarios-agregar-paso3.png` | Agregar Usuario paso 3 |
| 17 | `directiva-organigrama.png` | Organigrama Directiva |
| 18 | `directiva-gestion-nuevo.png` | Registrar nuevo periodo |
| 19 | `directiva-gestion-historial.png` | Historial de directivas |
| 20 | `directiva-gestion-cambiar.png` | Cambiar miembro directiva |
| 21 | `mingas-menu-principal.png` | Menú de Mingas |
| 22 | `mingas-programar-formulario.png` | Programar Minga |
| 23 | `mingas-activas-lista.png` | Mingas Activas |
| 24 | `mingas-activas-modal-posponer.png` | Modal posponer minga |
| 25 | `mingas-asistencia-tabla.png` | Registro de Asistencia |
| 26 | `mingas-historial-tabla.png` | Historial de Mingas |
| 27 | `mingas-historial-resumen-modal.png` | Resumen de minga |
| 28 | `catastros-menu.png` | Menú de Catastros |
| 29 | `catastro-global.png` | Catastro de Predios |
| 30 | `terrenos-registro.png` | Registro múltiple de terrenos |
| 31 | `terrenos-edicion.png` | Edición de terreno |
| 32 | `terreno-detalles-ficha.png` | Ficha de Predio |
| 33 | `terreno-detalles-traspaso.png` | Traspaso de dominio |
| 34 | `certificado-catastro-pdf.png` | Certificado PDF |
| 35 | `mis-terrenos.png` | Mis Terrenos |
| 36 | `panel-cobros-menu.png` | Menú de Cobros |
| 37 | `ventanilla-cobro.png` | Ventanilla de Cobro |
| 38 | `generar-multa-manual.png` | Generar Multa Manual |
| 39 | `registrar-egreso.png` | Registrar Egreso |
| 40 | `arqueo-historial.png` | Arqueo e Historial |
| 41 | `emitir-planillas-busqueda.png` | Emitir Planillas — búsqueda |
| 42 | `emitir-planillas-tabla-periodo.png` | Emitir Planillas — tabla |
| 43 | `mis-deudas.png` | Mis Deudas |
| 44 | `centro-reportes-tarjetas.png` | Centro de Reportes — tipos |
| 45 | `centro-reportes-filtros.png` | Centro de Reportes — filtros |
| 46 | `panel-administracion.png` | Panel de Administración |
| 47 | `configuracion-parametros.png` | Configuración — Parámetros |
| 48 | `configuracion-zonas-sectores.png` | Configuración — Zonas y Sectores |
| 49 | `configuracion-titulos.png` | Configuración — Títulos |
| 50 | `bitacora-auditoria.png` | Bitácora de Auditoría |
| 51 | `cpanel-crear-bd.png` | cPanel — creación de base de datos y usuario |
| 52 | `phpmyadmin-importar.png` | phpMyAdmin — pestaña Importar |
| 53 | `cpanel-subdominio-backend.png` | cPanel — subdominio del backend |
| 54 | `cpanel-subir-frontend.png` | cPanel — archivos del frontend subidos |

---

*Manual generado a partir del código fuente del sistema Chibutech (frontend React). Última actualización: julio 2026.*
