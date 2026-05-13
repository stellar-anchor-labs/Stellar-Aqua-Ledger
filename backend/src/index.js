import "dotenv/config";
import express from "express";
import creditsRouter from "./routes/credits.js";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/credits", creditsRouter);

const port = process.env.PORT ?? 3001;
app.listen(port, () => console.log(`aqua-ledger backend on :${port}`));
