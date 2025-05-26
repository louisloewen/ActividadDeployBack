import db from "../utils/firebase.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const generateHash = (password) => {
    const salt = crypto.randomBytes(24).toString("base64url");
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("base64url");
    return `${salt}:${hash}`;
};

const verifyPassword = (inputPassword, storedPassword) => {
    const [salt, storedHash] = storedPassword.split(":");
    const hash = crypto.pbkdf2Sync(inputPassword, salt, 100000, 64, "sha512").toString("base64url");
    return hash === storedHash;
};

export const signup = async (req, res) => {
    console.log("=== SIGNUP REQUEST START ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    
    const { name, username, password } = req.body;
    
    console.log("Extracted values:");
    console.log("- name:", name);
    console.log("- username:", username);
    console.log("- password:", password ? "[PROVIDED]" : "[MISSING]");
    
    if (!username || !password) {
        console.log("❌ Missing required fields");
        return res.status(400).json({ error: "Usuario y contraseña requeridos" });
    }
    
    try {
        console.log("Starting password hash...");
        const hashedPassword = generateHash(password);
        console.log("Password hashed successfully");
        
        console.log("Attempting to save to Firebase...");
        const userRef = db.collection('users').doc();
        await userRef.set({
            name: name || username,
            username,
            password: hashedPassword,
            createdAt: new Date()
        });
        
        console.log("✅ User saved successfully!");
        res.status(201).json({ message: "Usuario registrado correctamente" });
        
    } catch (error) {
        console.log("❌ SIGNUP ERROR:");
        console.log("Error message:", error.message);
        console.log("Error stack:", error.stack);
        res.status(500).json({ error: "Error al registrar usuario" });
    }
    
    console.log("=== SIGNUP REQUEST END ===");
};

export const login = async (req, res) => {
    // ... tu función login que agregaste
};