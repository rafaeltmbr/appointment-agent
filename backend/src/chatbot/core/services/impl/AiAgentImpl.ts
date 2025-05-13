import { Conversation } from "../../entities/Conversation";
import {
  ModelMessage,
  ToolCallMessage,
  ToolResponseMessage,
} from "../../entities/Message";
import { Tool } from "../../entities/Tool";
import { AiAgent } from "../AiAgent";
import { Llm, LlmUsage } from "../Llm";

export class AiAgentImpl implements AiAgent {
  constructor(
    private systemPrompt: string,
    private llm: Llm,
    private tools: Tool[]
  ) {}

  async ask(conversation: Conversation): Promise<LlmUsage> {
    console.log(
      `\n----------------- Conversation ${conversation.id} -----------------`
    ); // DEBUG
    conversation.messages.forEach((message) => console.log(message.toString())); // DEBUG

    const totalLlmUsage: LlmUsage = {
      inputTokens: 0,
      outputTokens: 0,
    };

    do {
      const modelResponse = await this.llm.generate(
        this.systemPrompt,
        conversation,
        this.tools
      );

      conversation.addMessage(modelResponse.message);
      totalLlmUsage.inputTokens += modelResponse.usage.inputTokens;
      totalLlmUsage.outputTokens += modelResponse.usage.outputTokens;
      console.log(modelResponse.message.toString()); // DEBUG

      const toolCall =
        modelResponse.message instanceof ToolCallMessage
          ? modelResponse.message
          : null;

      if (!toolCall) continue;

      try {
        const tool = this.tools.find((tool) => tool.name === toolCall.name);
        if (!tool) throw new Error(`Tool '${toolCall.name}' not found.`);

        const response = await tool.execute(toolCall.parameters);
        conversation.addMessage(
          new ToolResponseMessage(toolCall.callId, toolCall.name, response)
        );
      } catch (e: unknown) {
        const error = e instanceof Error ? e.message : String(e);
        conversation.addMessage(
          new ToolResponseMessage(toolCall.callId, toolCall.name, error)
        );
      }

      console.log(conversation.messages.at(-1)!.toString()); // DEBUG
    } while (!(conversation.messages.at(-1) instanceof ModelMessage));

    return totalLlmUsage;
  }
}
