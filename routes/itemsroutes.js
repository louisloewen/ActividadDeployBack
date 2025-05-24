import { Router } from "express";
import { validateJWT } from "../utils/jwt.js";
import { getItems, getItem, postItem, putItem, deleteItem } from "../controllers/itemscontrollers.js"

const router = Router();

router.get("/items/", validateJWT, getItems);
router.get("/items/:id", getItem);
router.post("/items/", validateJWT, postItem);
router.put("/items/:id", validateJWT, putItem);
router.delete("/items/:id", validateJWT, deleteItem);

export default router;
