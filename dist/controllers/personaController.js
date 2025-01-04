"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPersona = exports.getAllPersonas = void 0;
const db_1 = require("../config/db");
// Get all personas
const getAllPersonas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const personasRef = db_1.db.collection("personas");
        const snapshot = yield personasRef.get();
        if (snapshot.empty) {
            return res.status(404).json({ message: "No personas found" });
        }
        const personas = snapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
        return res.status(200).json(personas);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: "An unknown error occurred" });
    }
});
exports.getAllPersonas = getAllPersonas;
// Create a new persona
const createPersona = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPersonaData = req.body;
        const personaRef = db_1.db.collection("personas").doc();
        yield personaRef.set(Object.assign(Object.assign({}, newPersonaData), { created_at: new Date(), updated_at: new Date() }));
        return res.status(201).json({ message: "Persona created successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: "An unknown error occurred" });
    }
});
exports.createPersona = createPersona;
