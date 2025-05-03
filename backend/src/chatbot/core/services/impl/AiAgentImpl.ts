import { Conversation } from "../../entities/Conversation";
import {
  Message,
  ToolCallMessage,
  ToolResponseMessage,
} from "../../entities/Message";
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
    const modelResponse = await this.llm.generate(
      this.systemPrompt,
      conversation,
      this.tools
    );

    conversation.addMessage(modelResponse);

    while (conversation.messages.at(-1) instanceof ToolCallMessage) {
      const toolCallMessage = conversation.messages.at(-1) as ToolCallMessage;
      const tool = this.tools.find((t) => t.name === toolCallMessage.name);
      if (!tool) throw new Error(`Tool '${toolCallMessage.name}' not found.`);

      let response: string;
      try {
        response = await tool.execute(toolCallMessage.parameters);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        response = message;
      }

      const toolCallResponse = new ToolResponseMessage(
        toolCallMessage.name,
        response
      );
      conversation.addMessage(toolCallResponse);

      const modelResponse = await this.llm.generate(
        this.systemPrompt,
        conversation,
        this.tools
      );
      conversation.addMessage(modelResponse);
    }
  }
}
