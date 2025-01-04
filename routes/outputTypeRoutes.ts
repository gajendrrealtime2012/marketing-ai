import express from "express";
import {
  getAllOutputTypes,
  createOutputType,
} from "../controllers/outputTypeController";

const router = express.Router();

router.get("/", getAllOutputTypes);
router.post("/", createOutputType);

export default router;
