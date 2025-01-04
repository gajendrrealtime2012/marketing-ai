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
exports.createOutputType = exports.getAllOutputTypes = void 0;
const db_1 = require("../config/db");
const getAllOutputTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const outputTypesRef = db_1.db.collection("outputTypes");
        const snapshot = yield outputTypesRef.get();
        if (snapshot.empty) {
            return res.status(404).json({ message: "No output types found" });
        }
        const outputTypes = snapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
        return res.status(200).json(outputTypes);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: "An unknown error occurred" });
    }
});
exports.getAllOutputTypes = getAllOutputTypes;
const createOutputType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newOutputTypeData = req.body;
        const outputTypeRef = db_1.db.collection("outputTypes").doc();
        yield outputTypeRef.set(Object.assign(Object.assign({}, newOutputTypeData), { created_at: new Date(), updated_at: new Date() }));
        return res
            .status(201)
            .json({ message: "Output Type created successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: "An unknown error occurred" });
    }
});
exports.createOutputType = createOutputType;
