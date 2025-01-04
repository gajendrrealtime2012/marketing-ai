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
exports.addOutputType = void 0;
// Example of adding an OutputType document to Firestore
const firebase_admin_1 = require("firebase-admin");
const db = (0, firebase_admin_1.firestore)();
const addOutputType = (outputType) => __awaiter(void 0, void 0, void 0, function* () {
    const now = firebase_admin_1.firestore.Timestamp.now();
    const outputTypeRef = db.collection("outputTypes").doc();
    yield outputTypeRef.set(Object.assign(Object.assign({}, outputType), { created_at: now, updated_at: now }));
});
exports.addOutputType = addOutputType;
