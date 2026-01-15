// Configuración de Firebase - AtletiKeepers Pro
// Proyecto: atleti-goalkeepers

const firebaseConfig = {
    apiKey: "AIzaSyAaEMIByK5rqiXnhshuy5MsmB2fntc-kHo",
    authDomain: "atleti-goalkeepers.firebaseapp.com",
    projectId: "atleti-goalkeepers",
    storageBucket: "atleti-goalkeepers.firebasestorage.app",
    messagingSenderId: "771763997507",
    appId: "1:771763997507:web:28dc480257c070c0f93df6"
};

// Inicializar Firebase (las variables se declaran en index.html)
firebase.initializeApp(firebaseConfig);

// Funciones de utilidad
function getCurrentUser() {
    return auth.currentUser;
}

function logout() {
    return auth.signOut();
}

async function loginUser(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function registerUser(email, password, fullName) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        // Guardar nombre en Firestore
        await db.collection('users').doc(userCredential.user.uid).set({
            fullName: fullName,
            email: email,
            role: 'coach',
            active: true,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
