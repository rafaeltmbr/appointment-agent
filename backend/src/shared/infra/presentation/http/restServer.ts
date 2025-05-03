import "dotenv/config";
import express from "express";
require("express-async-errors");
import cors from "cors";

import { errorMiddleware } from "./middlewares/errorMiddleware";
import { appointmentRouter } from "../../../../appointment/infra/presentation/http/routes/appointmentRouter";
import { config } from "../../config";
import { chatbotRouter } from "../../../../chatbot/infra/presentation/http/routes/chatbotRouter";

const restServer = express();

restServer.use(cors());
restServer.use(express.json());
restServer.use("/appointment", appointmentRouter);
restServer.use("/chatbot", chatbotRouter);
restServer.use(errorMiddleware);

restServer.listen(config.restPort, () => {
  console.log(`Rest server listening at http://localhost:${config.restPort}`);
});
