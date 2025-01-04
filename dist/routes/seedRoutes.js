"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const seedController_1 = require("../controllers/seedController");
const router = express_1.default.Router();
router.get("/", seedController_1.getAllSeeds);
router.post("/", seedController_1.createSeed);
exports.default = router;