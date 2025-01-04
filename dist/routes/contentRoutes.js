"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contentController_1 = require("../controllers/contentController");
const router = express_1.default.Router();
router.post("/generate", contentController_1.generateContent);
router.post("/tune/seed", contentController_1.tuneBySeedContent);
router.post("/tune/persona", contentController_1.tuneByPersonaContent);
router.post("/tune/output-type", contentController_1.tuneByOutputTypeContent);
router.post("/tune/all", contentController_1.tuneByAllThreeContent);
exports.default = router;
