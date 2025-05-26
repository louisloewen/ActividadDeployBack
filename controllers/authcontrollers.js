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
    console.log("=== LOGIN REQUEST START ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    
    const { username, password } = req.body;
    
    console.log("Extracted values:");
    console.log("- username:", username);
    console.log("- password:", password ? "[PROVIDED]" : "[MISSING]");
    
    if (!username || !password) {
        console.log("❌ Missing credentials");
        return res.status(400).json({ error: "Usuario y contraseña requeridos" });
    }
    
    try {
        console.log("Searching for user in Firestore...");
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('username', '==', username).get();
        
        console.log("Query completed. Empty:", snapshot.empty);
        
        if (snapshot.empty) {
            console.log("❌ User not found");
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        let user;
        snapshot.forEach(doc => {
            console.log("User found:", doc.id);
            user = { id: doc.id, ...doc.data() };
        });

        console.log("Verifying password...");
        const isValidPassword = verifyPassword(password, user.password);
        console.log("Password verification result:", isValidPassword);

        if (isValidPassword) {
            console.log("Creating JWT token...");
            const token = jwt.sign({ sub: user.id }, process.env.JWT, {
                expiresIn: "1h",
            });
            console.log("✅ Login successful");
            res.status(200).json({ 
                isLogin: true, 
                user: { id: user.id, name: user.name, username: user.username }, 
                token 
            });
        } else {
            console.log("❌ Password incorrect");
            res.status(401).json({ error: "Credenciales incorrectas" });
        }
    } catch (error) {
        console.log("❌ LOGIN ERROR:");
        console.log("Error message:", error.message);
        console.log("Error stack:", error.stack);
        res.status(500).json({ error: "Error al iniciar sesión" });
    }
    
    console.log("=== LOGIN REQUEST END ===");
};