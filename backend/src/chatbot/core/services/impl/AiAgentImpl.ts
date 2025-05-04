import { Conversation } from "../../entities/Conversation";
import { ToolCallMessage, ToolResponseMessage } from "../../entities/Message";
import { Tool } from "../../entities/Tool";
import { AiAgent } from "../AiAgent";
import { Llm } from "../Llm";

export class AiAgentImpl implements AiAgent {
  constructor(
    private systemPrompt: string,
    private llm: Llm,
    private tools: Tool[]
  ) {}

  async ask(conversation: Conversation): Promise<void> {
    const modelResponses = await this.llm.generate(
      this.systemPrompt,
      conversation,
      this.tools
    );

    modelResponses.forEach((response) => conversation.addMessage(response));

    while (AiAgentImpl.extractPendingToolCalls(conversation).length > 0) {
      const pendingToolCalls =
        AiAgentImpl.extractPendingToolCalls(conversation);

      const toolResponses = await Promise.all(
        pendingToolCalls.map(async (toolCall) => {
          try {
            const tool = this.tools.find((tool) => tool.name === toolCall.name);
            if (!tool) throw new Error(`Tool '${toolCall.name}' not found.`);

            const response = await tool.execute(toolCall.parameters);
            return new ToolResponseMessage(toolCall.name, response);
          } catch (e: unknown) {
            return new ToolResponseMessage(
              toolCall.name,
              e instanceof Error ? e.message : String(e)
            );
          }
        })
      );

      toolResponses.forEach((response) => conversation.addMessage(response));

      const modelResponses = await this.llm.generate(
        this.systemPrompt,
        conversation,
        this.tools
      );
      modelResponses.forEach((response) => conversation.addMessage(response));
    }
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
