import express from "express";
import { getAllSeeds, createSeed } from "../controllers/seedController";

const router = express.Router();

router.get("/", getAllSeeds);
router.post("/", createSeed);

export default router;
