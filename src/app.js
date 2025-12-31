//app.js
// src/app.js
import express from "express";
import cors from "cors";
import routes from "./routes/paste.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", routes);

export default app;
