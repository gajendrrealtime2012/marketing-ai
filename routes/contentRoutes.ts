import express, { Request, Response } from "express";
import {
  generateContent,
  tuneBySeedContent,
  tuneByPersonaContent,
  tuneByOutputTypeContent,
  tuneByAllThreeContent,
} from "../controllers/contentController";

const router = express.Router();

router.post("/generate", generateContent);

router.post("/tune/seed", tuneBySeedContent);

router.post("/tune/persona", tuneByPersonaContent);

router.post("/tune/output-type", tuneByOutputTypeContent);

router.post("/tune/all", tuneByAllThreeContent);

export default router;
