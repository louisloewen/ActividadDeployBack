import db from "../utils/firebase.js";

export const getItems = async (req, res) => {
    try {
        const itemsRef = db.collection('items');
        const snapshot = await itemsRef.get();
        const items = [];
        
        snapshot.forEach(doc => {
            items.push({ id: doc.id, ...doc.data() });
        });
        
        res.json(items);
    } catch (error) {
        console.error("Error al obtener items:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const getItem = async (req, res) => {
    try {
        const itemRef = db.collection('items').doc(req.params.id);
        const doc = await itemRef.get();
        
        if (!doc.exists) {
            return res.status(404).json({ error: "Item no encontrado" });
        }
        
        res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener item" });
    }
};

export const postItem = async (req, res) => {
    try {
        const itemRef = db.collection('items').doc();
        await itemRef.set({
            name: req.body.name,
            price: req.body.price,
            createdAt: new Date()
        });
        
        const newItem = await itemRef.get();
        res.status(201).json({ operation: true, item: { id: newItem.id, ...newItem.data() } });
    } catch (error) {
        res.status(500).json({ error: "Error al crear item" });
    }
};

export const putItem = async (req, res) => {
    try {
        const itemRef = db.collection('items').doc(req.params.id);
        await itemRef.update({
            name: req.body.name,
            price: req.body.price,
            updatedAt: new Date()
        });
        
        res.status(201).json({ message: "Item actualizado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar item" });
    }
};

export const deleteItem = async (req, res) => {
    try {
        await db.collection('items').doc(req.params.id).delete();
        res.status(200).json({ operation: true });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar item" });
    }
};