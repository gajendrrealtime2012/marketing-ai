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
exports.addPersona = void 0;
const db_1 = require("../config/db");
const firestore_1 = require("@google-cloud/firestore");
const addPersona = (persona) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const personaRef = db_1.db.collection("personas").doc();
        const now = firestore_1.Timestamp.now();
        yield personaRef.set(Object.assign(Object.assign({}, persona), { created_at: persona.created_at || now, updated_at: persona.updated_at || now }));
        console.log("Persona added successfully");
    }
    catch (error) {
        console.error("Error adding persona:", error);
    }
});
exports.addPersona = addPersona;
