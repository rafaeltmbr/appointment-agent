import { celebrate, Joi, Segments } from "celebrate";
import { Router } from "express";

import { ChatbotController } from "../controllers/ChatbotController";
import { chatbotContainer } from "../../../di/impl/chatbotContainer";

export const chatbotRouter = Router();

const chatbotController = new ChatbotController(
  chatbotContainer.useCases.answerUser
);

chatbotRouter.post(
  "/ask",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      question: Joi.string().trim().required(),
      conversation_id: Joi.string().allow(null),
    }),
  }),
  chatbotController.ask.bind(chatbotController)
);
