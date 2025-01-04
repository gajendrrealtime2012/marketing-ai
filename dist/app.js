"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const personaRoutes_1 = __importDefault(require("./routes/personaRoutes"));
const outputTypeRoutes_1 = __importDefault(require("./routes/outputTypeRoutes"));
const seedRoutes_1 = __importDefault(require("./routes/seedRoutes"));
const contentRoutes_1 = __importDefault(require("./routes/contentRoutes"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use("/api/personas", personaRoutes_1.default);
app.use("/api/output-types", outputTypeRoutes_1.default);
app.use("/api/seeds", seedRoutes_1.default);
app.use("/api/content", contentRoutes_1.default);
exports.default = app;
