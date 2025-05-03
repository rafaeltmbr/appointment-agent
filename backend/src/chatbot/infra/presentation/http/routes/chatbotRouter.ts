import { celebrate, Joi, Segments } from "celebrate";
import { Router } from "express";

import { ChatbotController } from "../controllers/ChatbotController";
import { AiAgentImpl } from "../../../../core/services/impl/AiAgentImpl";
import { LlmGemini } from "../../../services/LlmGemini";
import { appointmentContainer } from "../../../../../appointment/infra/di/impl/appointmentContainer";
import { AnswerUserUseCase } from "../../../../core/use_cases/AnswerUserUseCase";
import { ConversationRepositoryInMemory } from "../../../data/repositories/ConversationRepositoriesInMemory";

export const chatbotRouter = Router();

const systemPrompt: string = `
    Você é o assistente da clínica de Dentistas John Dói. Atenda os clientes de forma simples, direta e amigável. Para o atendimento, você pode fazer o uso de ferramentas.
    \nInformações adicionais:
    - Data de hoje: ${new Date().toISOString()} 
`;

const llm = new LlmGemini(process.env.GEMINI_URL ?? "");

const agent = new AiAgentImpl(
  systemPrompt,
  llm,
  appointmentContainer.useCases.listAvailableHours
);

const answerUserUseCase = new AnswerUserUseCase(
  new ConversationRepositoryInMemory(),
  agent
);

const chatbotController = new ChatbotController(answerUserUseCase);

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
