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
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Usuario y contraseña requeridos" });
    }

    const hashedPassword = generateHash(password);
    
    try {
        const userRef = db.collection('users').doc();
        await userRef.set({
            username,
            password: hashedPassword,
            createdAt: new Date()
        });
        
        res.status(201).json({ message: "Usuario registrado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar usuario" });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('username', '==', username).get();
        
        if (snapshot.empty) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        let user;
        snapshot.forEach(doc => {
            user = { id: doc.id, ...doc.data() };
        });

        const isLogin = verifyPassword(password, user.password);

        if (isLogin) {
            const token = jwt.sign({ sub: user.id }, process.env.JWT, {
                expiresIn: "1h",
            });
            res.status(200).json({ isLogin, user, token });
        } else {
            res.status(401).json({ error: "Credenciales incorrectas" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al iniciar sesión" });
    }
};