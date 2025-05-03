import { ListAvailableAppointmentHoursUseCase } from "../../../../appointment/core/use_cases/ListAvailableAppointmentHoursUseCase";
import {
  Conversation,
  ToolCallMessage,
  ToolResponseMessage,
} from "../../entities/Conversation";
import { AiAgent } from "../AiAgent";
import { Llm } from "../Llm";

export class AiAgentImpl implements AiAgent {
  constructor(
    private systemPrompt: string,
    private llm: Llm,
    private listAvailableHours: ListAvailableAppointmentHoursUseCase
  ) {}

  async ask(conversation: Conversation): Promise<void> {
    const modelResponse = await this.llm.generate(
      this.systemPrompt,
      conversation
    );

    conversation.addMessage(modelResponse);

    if (modelResponse instanceof ToolCallMessage) {
      switch (modelResponse.name) {
        case "list_available_hours":
          const availableHours = await this.listAvailableHours.execute();

          const toolCallResponse = new ToolResponseMessage(
            modelResponse.name,
            JSON.stringify(availableHours.map((e) => e.toISOString()))
          );

          conversation.addMessage(toolCallResponse);

          const finalResponse = await this.llm.generate(
            this.systemPrompt,
            conversation
          );

          conversation.addMessage(finalResponse);
      }
    }
  }
}
