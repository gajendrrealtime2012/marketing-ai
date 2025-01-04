"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const outputTypeController_1 = require("../controllers/outputTypeController");
const router = express_1.default.Router();
router.get("/", outputTypeController_1.getAllOutputTypes);
router.post("/", outputTypeController_1.createOutputType);
exports.default = router;
