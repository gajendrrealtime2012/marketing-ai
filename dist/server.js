"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
// console.log("DB", db);
db_1.db.collection("seeds")
    .get()
    .then(() => {
    console.log("Firebase connected successfully.");
})
    .catch((error) => {
    console.error("Firebase connection error: ", error);
});
const PORT = Number(process.env.PORT) || 8080;
app_1.default.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
