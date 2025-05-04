import { appointmentContainer } from "../../../../appointment/infra/di/impl/appointmentContainer";
import { Tool } from "../../../core/entities/Tool";
import { AiAgentImpl } from "../../../core/services/impl/AiAgentImpl";
import { CancelAppointmentTool } from "../../../core/tools/CancelAppointmentTool";
import { FindAppointmentTool } from "../../../core/tools/FindAppointmentTool";
import { ListAvailableAppointmentHoursTool } from "../../../core/tools/ListAvailableAppointmentHoursTool";
import { MakeAppointmentTool } from "../../../core/tools/MakeAppointmenTool";
import { AnswerUserUseCase } from "../../../core/use_cases/AnswerUserUseCase";
import { ConversationRepositoryInMemory } from "../../data/repositories/ConversationRepositoriesInMemory";
import { LlmGemini } from "../../services/LlmGemini";
import {
  ChatbotContainer,
  ChatbotContainerData,
  ChatbotContainerServices,
  ChatbotContainerUseCases,
} from "../ChatbotContainer";

const data: ChatbotContainerData = {
  repositories: {
    conversation: new ConversationRepositoryInMemory(),
  },
};

const systemPrompt: string = `
## Função do Agente  
Você é o assistente virtual da **Clínica de Dentistas John Dói**. Seu objetivo é realizar atendimentos eficientes e diretos aos clientes via chat de texto.

## Comportamento Esperado  
- Responda de forma **objetiva, amigável e clara**.  
- Utilize **ferramentas disponíveis** sempre que necessário para concluir tarefas.  
- **Aja com autonomia**: não solicite confirmações desnecessárias ao cliente.  
- Apresente informações em **linguagem acessível**, sem formatação Markdown.  
- Converta **todos os horários em formato ISO** para o **fuso horário de Brasília (GMT-3)**.  
- **Evite perguntas repetidas**: consulte o histórico da conversa antes de solicitar dados.  
- **Siga rigorosamente os passos indicados** para cada tarefa.

## Restrições  
- Não utilize Markdown nas mensagens enviadas ao cliente.  
- Não repita perguntas que já tenham sido respondidas.  
- Não solicite autorizações para executar ações automatizadas.

## Conversão de Horário  
- Sempre que receber um horário no formato ISO (ex: '2025-05-03T14:00:00Z'), converta automaticamente para o horário de Brasília.
- Sempre que passar um horário para uma ferramenta, converta-o para o formato ISO levando em conta o fuso horário (ex: 9:00 de Brasília é equivalente à 12:00 no format ISO).

## Informações Adicionais
- Data e horário atual: ${new Date().toISOString()}
- Local de atendimento: Brasil
`.trim();

const llm = new LlmGemini(process.env.GEMINI_URL ?? "");

const tools: Tool[] = [
  new ListAvailableAppointmentHoursTool(
    appointmentContainer.useCases.listAvailableHours
  ),
  new FindAppointmentTool(appointmentContainer.useCases.find),
  new MakeAppointmentTool(appointmentContainer.useCases.make),
  new CancelAppointmentTool(appointmentContainer.useCases.cancel),
];

const agent = new AiAgentImpl(systemPrompt, llm, tools);

const services: ChatbotContainerServices = {
  aiAgent: new AiAgentImpl(systemPrompt, llm, tools),
  llm: new LlmGemini(process.env.GEMINI_URL ?? ""),
};

const useCases: ChatbotContainerUseCases = {
  answerUser: new AnswerUserUseCase(
    data.repositories.conversation,
    services.aiAgent
  ),
};

export const chatbotContainer: ChatbotContainer = {
  data,
  services,
  useCases,
};
