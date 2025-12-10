import express from "express";
import cors from "cors";
import ethRoutes from "./routes/ethereum";
import hederaRoutes from "./routes/hedera";

// ...


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/eth", ethRoutes);
app.use("/api/hedera", hederaRoutes);
export default app;