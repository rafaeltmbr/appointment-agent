import { Conversation } from "../entities/Conversation";
import { Message } from "../entities/Message";
import { Tool } from "../entities/Tool";

export interface LlmUsage {
  inputTokens: number;
  outputTokens: number;
}

export interface LlmOutput {
  message: Message;
  usage: LlmUsage;
}

export interface Llm {
  generate(
    system: string,
    conversation: Conversation,
    tools: Tool[]
  ): Promise<LlmOutput>;
}
