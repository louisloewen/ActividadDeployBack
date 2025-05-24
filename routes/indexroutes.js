import { Router } from "express";
import { getIndex, getPing } from "../controllers/indexcontrollers.js"

const router = Router();

router.get("/", getIndex);
router.get("/ping", getPing);

export default router;
