import "dotenv/config";
import express from "express";
import cors from "cors";
import indexRoutes from "./routes/indexroutes.js";
import itemsRoutes from "./routes/itemsroutes.js";
import authRoutes from "./routes/authroutes.js"; 
import morgan from "morgan";

const app = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Rutas
app.use(indexRoutes);
app.use(itemsRoutes);
app.use(authRoutes); 

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});