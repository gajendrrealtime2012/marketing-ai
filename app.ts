import express, { Express } from "express";
import bodyParser from "body-parser";

import personaRoutes from "./routes/personaRoutes";
import outputTypeRoutes from "./routes/outputTypeRoutes";
import seedRoutes from "./routes/seedRoutes";
import contentRoutes from "./routes/contentRoutes";

const app: Express = express();
app.use(bodyParser.json());

app.use("/api/personas", personaRoutes);
app.use("/api/output-types", outputTypeRoutes);
app.use("/api/seeds", seedRoutes);
app.use("/api/content", contentRoutes);

export default app;
