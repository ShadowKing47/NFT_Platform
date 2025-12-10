import app from "./index";
import dotenv from "dotenv";
import logger from "./utils/logger";

dotenv.config();

const PORT = process.env.PORT || 8000;

app.listen(PORT, ()=> {
    logger.info(`Backend running on port ${PORT}`)
});