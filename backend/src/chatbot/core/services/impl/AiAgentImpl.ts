import { Conversation } from "../../entities/Conversation";
import { ToolCallMessage, ToolResponseMessage } from "../../entities/Message";
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
    const totalLlmUsage: LlmUsage = {
      inputTokens: 0,
      outputTokens: 0,
    };

    const modelResponse = await this.llm.generate(
      this.systemPrompt,
      conversation,
      this.tools
    );

    modelResponse.messages.forEach((response) =>
      conversation.addMessage(response)
    );
    totalLlmUsage.inputTokens += modelResponse.usage.inputTokens;
    totalLlmUsage.outputTokens += modelResponse.usage.outputTokens;

    while (AiAgentImpl.extractPendingToolCalls(conversation).length > 0) {
      const pendingToolCalls =
        AiAgentImpl.extractPendingToolCalls(conversation);

      const toolResponses = await Promise.all(
        pendingToolCalls.map(async (toolCall) => {
          try {
            const tool = this.tools.find((tool) => tool.name === toolCall.name);
            if (!tool) throw new Error(`Tool '${toolCall.name}' not found.`);

            const response = await tool.execute(toolCall.parameters);
            return new ToolResponseMessage(
              toolCall.callId,
              toolCall.name,
              response
            );
          } catch (e: unknown) {
            return new ToolResponseMessage(
              toolCall.callId,
              toolCall.name,
              e instanceof Error ? e.message : String(e)
            );
          }
        })
      );

      toolResponses.forEach((response) => conversation.addMessage(response));

      const modelResponse = await this.llm.generate(
        this.systemPrompt,
        conversation,
        this.tools
      );
      modelResponse.messages.forEach((response) =>
        conversation.addMessage(response)
      );
      totalLlmUsage.inputTokens += modelResponse.usage.inputTokens;
      totalLlmUsage.outputTokens += modelResponse.usage.outputTokens;
    }

    return totalLlmUsage;
  }

  private static extractPendingToolCalls(
    conversation: Conversation
  ): ToolCallMessage[] {
    const toolCalls: ToolCallMessage[] = [];
    for (let i = conversation.messages.length - 1; i >= 0; i -= 1) {
      const message = conversation.messages[i];
      if (!(message instanceof ToolCallMessage)) break;

      toolCalls.push(message);
    }
    return toolCalls.reverse();
  }
}
