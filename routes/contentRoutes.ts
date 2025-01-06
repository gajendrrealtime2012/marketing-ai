import express, { Request, Response } from "express";
import {
  generateContent,
  tuneBySeedContent,
  tuneByPersonaContent,
  tuneByOutputTypeContent,
  tuneByAllThreeContent,
  tuneAllBySingleSection,
  tuneBySingleSection,
} from "../controllers/contentController";

const router = express.Router();

router.post("/generate", generateContent);

router.post("/tune/seed", tuneBySeedContent);

router.post("/tune/persona", tuneByPersonaContent);

router.post("/tune/output-type", tuneByOutputTypeContent);

router.post("/tune/all", tuneByAllThreeContent);

router.post("/tune/all-by-section", tuneAllBySingleSection);

router.post("/tune/output-type/section", tuneBySingleSection);

export default router;
