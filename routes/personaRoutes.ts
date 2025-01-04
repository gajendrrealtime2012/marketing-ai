import express from "express";
import {
  getAllPersonas,
  createPersona,
} from "../controllers/personaController";

const router = express.Router();

router.get("/", getAllPersonas);
router.post("/", createPersona);

export default router;
