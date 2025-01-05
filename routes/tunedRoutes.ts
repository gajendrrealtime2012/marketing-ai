import express from "express";
import { getAllTunedData, saveTunedData } from "../controllers/tunedController";

const router = express.Router();

// Route to get all tuned data
router.get("/", getAllTunedData);

// Route to save tuned data
router.post("/", saveTunedData);

export default router;
