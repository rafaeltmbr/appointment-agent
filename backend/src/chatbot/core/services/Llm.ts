import { Conversation } from "../entities/Conversation";
import { Message } from "../entities/Message";
import { Tool } from "../entities/Tool";

export interface Llm {
  generate(
    system: string,
    conversation: Conversation,
    tools: Tool[]
  ): Promise<Message>;
}
