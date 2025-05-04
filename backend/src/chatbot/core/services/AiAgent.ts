import { Conversation } from "../entities/Conversation";
import { LlmUsage } from "./Llm";

export interface AiAgent {
  ask(convesation: Conversation): Promise<LlmUsage>;
}
