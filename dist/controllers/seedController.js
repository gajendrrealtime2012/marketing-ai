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
exports.createSeed = exports.getAllSeeds = void 0;
const db_1 = require("../config/db");
// Get all seeds
const getAllSeeds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const seedsRef = db_1.db.collection("seeds");
        const snapshot = yield seedsRef.get();
        if (snapshot.empty) {
            return res.status(404).json({ message: "No seeds found" });
        }
        const seeds = snapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
        return res.status(200).json(seeds);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: "An unknown error occurred" });
    }
});
exports.getAllSeeds = getAllSeeds;
// Create a new seed
const createSeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newSeedData = req.body;
        const seedRef = db_1.db.collection("seeds").doc();
        yield seedRef.set(Object.assign(Object.assign({}, newSeedData), { created_at: new Date(), updated_at: new Date() }));
        return res.status(201).json({ message: "Seed created successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: "An unknown error occurred" });
    }
});
exports.createSeed = createSeed;
