import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { join } from 'path';

let db;

try {
  console.log("Trying to read Firebase service account file...");
  
  // Try to read from the file
  const serviceAccountPath = join(process.cwd(), 'firebase-service-account.json');
  console.log("Service account path:", serviceAccountPath);
  
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
  console.log("Service account loaded successfully");
  
  console.log("Firebase service account check:", {
    hasType: !!serviceAccount.type,
    hasProjectId: !!serviceAccount.project_id,
    hasPrivateKey: !!serviceAccount.private_key?.includes("BEGIN PRIVATE KEY"),
    hasClientEmail: !!serviceAccount.client_email
  });
  
  // Initialize Firebase
  initializeApp({
    credential: cert(serviceAccount)
  });
  
  console.log("Firebase initialized successfully");
  db = getFirestore();
  
} catch (error) {
  console.error("Error initializing Firebase:", error);
  // Continue without Firebase
}

export default db;