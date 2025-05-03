import { celebrate, Joi, Segments } from "celebrate";
import { Router } from "express";

import { ChatbotController } from "../controllers/ChatbotController";
import { AiAgentImpl } from "../../../../core/services/impl/AiAgentImpl";
import { LlmGemini } from "../../../services/LlmGemini";
import { appointmentContainer } from "../../../../../appointment/infra/di/impl/appointmentContainer";
import { AnswerUserUseCase } from "../../../../core/use_cases/AnswerUserUseCase";
import { ConversationRepositoryInMemory } from "../../../data/repositories/ConversationRepositoriesInMemory";
import { Tool } from "../../../../core/entities/Tool";

export const chatbotRouter = Router();

const systemPrompt: string = `
    Você é o assistente da clínica de Dentistas John Dói. Atenda os clientes de forma simples, direta e amigável. Para o atendimento, você pode fazer o uso de ferramentas.
    \nInformações adicionais:
    - Data de hoje: ${new Date().toISOString()} 
`;

const llm = new LlmGemini(process.env.GEMINI_URL ?? "");

class ListAvailableHoursTool extends Tool {
  constructor() {
    super(
      "list_available_hours",
      "Lista os horários de agendamento disponíveis."
    );
  }

  async execute(parameters: Record<string, string>): Promise<string> {
    const availableHours =
      await appointmentContainer.useCases.listAvailableHours.execute();
    return JSON.stringify(availableHours.map((h) => h.toISOString()));
  }
}

class FindAppointmentTool extends Tool {
  constructor() {
    super(
      "find_appointments",
      "Encontra a consulta do cliente através do seu nome (name) ou número de documento (government_id).",
      [
        {
          name: "name",
          description: "Nome para procurar o usuário.",
          isRequired: false,
        },
        {
          name: "government_id",
          description: "Número de documento para procurar o usuário.",
          isRequired: false,
        },
      ]
    );
  }

  async execute(parameters: Record<string, string>): Promise<string> {
    const response = await appointmentContainer.useCases.find.execute({
      clientName: parameters.name,
      clientGovernmentId: parameters.government_id,
    });

    return JSON.stringify(response);
  }
}

class MakeAppointmentTool extends Tool {
  constructor() {
    super(
      "make_appointment",
      "Cria o agendamento de consulta do usuário através dos dados informados.",
      [
        {
          name: "date",
          description:
            "Data e horário do agendamento no formato ISO 8601 (YYYY-MM-DDThh:mm:ss).",
          isRequired: true,
        },
        {
          name: "name",
          description: "Nome completo do cliente.",
          isRequired: true,
        },
        {
          name: "government_id",
          description:
            "Número de documento do cliente no (dígitos numéricos no formato: XXX.XXX.XXX.-XX).",
          isRequired: true,
        },
      ]
    );
  }

  async execute(parameters: Record<string, string>): Promise<string> {
    const response = await appointmentContainer.useCases.make.execute({
      date: parameters.date,
      clientName: parameters.name,
      clientGovernmentId: parameters.government_id,
    });
    return JSON.stringify(response);
  }
}

class CancelAppointmentTool extends Tool {
  constructor() {
    super(
      "cancel_appointment",
      "Cancela o agendamento da consulta do cliente.",
      [
        {
          name: "id",
          description: "Id do agendamento da consulta a ser cancelada.",
          isRequired: true,
        },
      ]
    );
  }

  async execute(parameters: Record<string, string>): Promise<string> {
    await appointmentContainer.useCases.cancel.execute({
      id: parameters.id,
    });
    return "ok";
  }
}

const tools: Tool[] = [
  new ListAvailableHoursTool(),
  new FindAppointmentTool(),
  new MakeAppointmentTool(),
  new CancelAppointmentTool(),
];

const agent = new AiAgentImpl(systemPrompt, llm, tools);

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
