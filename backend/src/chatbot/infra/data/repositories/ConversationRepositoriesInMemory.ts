import { Id } from "../../../../shared/core/entities/Id";
import { ConversationRepository } from "../../../core/data/repositories/ConversationRepository";
import { Conversation } from "../../../core/entities/Conversation";

export class ConversationRepositoryInMemory implements ConversationRepository {
  private conversations: Conversation[] = [];

  async findById(id: Id): Promise<Conversation | null> {
    return this.conversations.find((c) => c.id.value === id.value) ?? null;
  }

  async upsert(conversation: Conversation): Promise<void> {
    const index = this.conversations.findIndex(
      (c) => c.id.value === conversation.id.value
    );
    if (index >= 0) {
      this.conversations.splice(index, 1, conversation);
      return;
    }

    this.conversations.push(conversation);
  }
}
