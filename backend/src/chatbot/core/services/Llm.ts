import { Conversation, Message } from "../entities/Conversation";

export interface Llm {
  generate(system: string, conversation: Conversation): Promise<Message>;
}
