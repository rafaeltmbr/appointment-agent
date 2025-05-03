import { Conversation } from "../entities/Conversation";

export interface AiAgent {
  ask(convesation: Conversation): Promise<void>;
}
