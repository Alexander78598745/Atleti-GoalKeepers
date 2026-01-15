# AtletiKeepers Pro - Versión Online

**Plataforma de Entrenadores de Porteros del Atlético de Madrid**

## Descripción
Plataforma de Entrenadores de Porteros del Atlético de Madrid con datos compartidos en tiempo real e instalación como aplicación (PWA).

## Características
- ✅ Datos compartidos entre todos los usuarios en tiempo real
- ✅ Sin necesidad de refrescar la página
- ✅ Instalable como aplicación (PWA) - funciona offline basic
- ✅ Imágenes de perfil para cada usuario
- ✅ Gestión de usuarios (activos/inactivos)
- ✅ Carpetas de sesiones por entrenador
- ✅ Login con email y contraseña

## CONFIGURACIÓN DE FIREBASE (OBLIGATORIO)

Para que los datos se compartan entre usuarios y estén seguros, necesitas configurar Firebase:

### Paso 1: Crear proyecto en Firebase
1. Ve a https://console.firebase.google.com/
2. Crea un nuevo proyecto llamado "AtletiKeepers"
3. Espera a que se cree el proyecto

### Paso 2: Habilitar Authentication
1. En el menú lateral, ve a **Authentication**
2. Clic en **Comenzar**
3. Clic en **Email/Password**
4. Habilita **Email/Password** (habilita ambas opciones)
5. Clic en **Guardar**

### Paso 3: Habilitar Firestore Database
1. En el menú lateral, ve a **Firestore Database**
2. Clic en **Crear base de datos**
3. Elige **Modo de prueba** (esto es solo temporal, luego cambiaremos las reglas)
4. Selecciona la ubicación más cercana
5. Clic en **Habilitar**

### Paso 4: Obtener configuración
1. En el menú lateral, ve a **Configuración del proyecto** (ícono de engranaje)
2. Clic en el ícono de tu app web (</>)
3. Registra la app con nombre "web"
4. Copia el objeto `firebaseConfig`

### Paso 5: Configurar firebase-config.js
Abre el archivo `firebase-config.js` y remplaza los valores con los de tu proyecto:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123..."
};
```

### Paso 6: CONFIGURAR REGLAS DE SEGURIDAD (MUY IMPORTANTE)

**⚠️ ESTE PASO ES CRÍTICO PARA LA SEGURIDAD**

1. En Firebase Console, ve a **Firestore Database** > **Reglas**
2. Borra todo el contenido actual
3. Copia y pega las siguientes reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Función para verificar si el usuario está autenticado
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Función para verificar si es el propietario del documento
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // === COLECCIÓN: users ===
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId) || 
                    (isAuthenticated() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // === COLECCIÓN: sessions ===
    match /sessions/{sessionId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }
    
    // === COLECCIÓN: folders ===
    match /folders/{folderId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && 
                    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

4. Clic en **Publicar**

### ¿Qué hacen estas reglas?
- **Solo usuarios logueados** pueden ver o modificar datos
- **Cualquier usuario** puede ver sesiones y carpetas
- **Solo el propio usuario** puede modificar su perfil
- **Solo administradores** pueden crear/eliminar carpetas
- **Protección total** contra usuarios no autenticados

## SUBIR A GITHUB PAGES

### Opción 1: gh-pages (Rápido)
```bash
# En la carpeta del proyecto
npx gh-pages -d .
```

### Opción 2: Manual
1. Crea un repositorio en GitHub
2. Sube todos los archivos:
   - `index.html`
   - `firebase-config.js` (con tus claves)
   - `manifest.json`
   - `sw.js`
   - `icon-192.png`
   - `icon-512.png`
   - `user_input_files/ESCUDO ATM.png`
3. Ve a Settings > Pages
4. Branch: "gh-pages" > "/ (root)"
5. Clic en "Save"

Tu app estará en:
`https://tu-usuario.github.io/tu-repositorio/`

## INSTALAR COMO APP (PWA)

1. Abre la URL en Chrome (Android) o Safari (iOS)
2. Busca **"Instalar app"** o **"Añadir a pantalla de inicio"**
3. La app se instalará como nativa en tu dispositivo

## SOLUCIÓN DE PROBLEMAS

### "Tu cuenta está desactivada"
- Debes estar logueado para acceder
- Los usuarios nuevos se crean como "Entrenador" activos

### "Error de permisos" o "Missing or insufficient permissions"
- Verifica las reglas de Firestore (Paso 6)
- Asegúrate de haber publicado las reglas

### "La app no carga"
- Verifica que `firebase-config.js` tenga los datos correctos
- Revisa la consola del navegador (F12) para errores
- Asegúrate de haber habilitado Authentication y Firestore

### El escudo no aparece
- Verifica que la imagen esté en `user_input_files/ESCUDO ATM.png`
- El nombre debe ser exactamente "ESCUDO ATM.png"

## ESTRUCTURA DE ARCHIVOS

```
/AtletiKeepers-Pro/
├── index.html              (Aplicación principal)
├── firebase-config.js      (Configuración de Firebase - EDITAR)
├── manifest.json           (Configuración PWA)
├── sw.js                   (Service Worker - offline)
├── firestore-rules.txt     (Reglas de seguridad - COPIAR A FIREBASE)
├── icon-192.png            (Icono app 192x192)
├── icon-512.png            (Icono app 512x512)
├── user_input_files/
│   └── ESCUDO ATM.png      (Tu escudo del club)
└── README.md               (Este archivo)
```

## CÓMO FUNCIONA

### Primer acceso:
1. El primer usuario que se registre será **Administrador**
2. Entra en **Administración** > **Usuarios**
3. Crea los demas usuarios como **Entrenadores**

### Subir sesiones:
1. Crea carpetas desde **Administración** > **Carpetas**
2. Asigna cada carpeta a un entrenador
3. Los entrenadores pueden subir sesiones a sus carpetas

## LICENCIA
© Atlético de Madrid - Entrenadores de Porteros
