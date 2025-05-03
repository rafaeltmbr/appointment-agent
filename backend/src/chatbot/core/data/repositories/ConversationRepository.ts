import { Id } from "../../../../shared/core/entities/Id";
import { Conversation, Message } from "../../entities/Conversation";

export interface ConversationRepository {
  findById(id: Id): Promise<Conversation | null>;
  upsert(conversation: Conversation): Promise<void>;
}
