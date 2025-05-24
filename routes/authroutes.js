import { Router } from "express";
import { login } from "../controllers/authcontrollers.js";
import { signup } from "../controllers/authcontrollers.js";

const router = Router();

router.post("/login", login);
router.post("/users", signup); // Cambiar de "/signup" a "/users"
// También puedes mantener ambas si quieres:
// router.post("/signup", signup); // Mantener esta también

export default router;