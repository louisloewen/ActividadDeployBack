import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let db;

try {
    console.log("Initializing Firebase with environment variables...");
    
    // Verificar que tenemos las variables críticas
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
        throw new Error("Missing critical Firebase environment variables");
    }
    
    const serviceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
        client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
    };

    console.log("Service account configured with project:", process.env.FIREBASE_PROJECT_ID);

    initializeApp({
        credential: cert(serviceAccount)
    });
    
    db = getFirestore();
    console.log("✅ Firebase initialized successfully");
    
} catch (error) {
    console.error("❌ Firebase initialization error:", error.message);
    throw error;
}

export default db;