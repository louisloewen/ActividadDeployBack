export const login = async (req, res) => {
    console.log("=== LOGIN REQUEST START ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    
    const { username, password } = req.body;
    
    console.log("Extracted values:");
    console.log("- username:", username);
    console.log("- password:", password ? "[PROVIDED]" : "[MISSING]");
    
    try {
        console.log("Searching for user in Firestore...");
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('username', '==', username).get();
        
        console.log("Query completed. Empty:", snapshot.empty);
        console.log("Documents found:", snapshot.size);
        
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
        const isLogin = verifyPassword(password, user.password);
        console.log("Password verification result:", isLogin);

        if (isLogin) {
            console.log("Creating JWT token...");
            const token = jwt.sign({ sub: user.id }, process.env.JWT, {
                expiresIn: "1h",
            });
            console.log("✅ Login successful");
            res.status(200).json({ isLogin, user, token });
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