import { Id } from "../../../shared/core/entities/Id";
import { ConversationRepository } from "../data/repositories/ConversationRepository";
import { Conversation } from "../entities/Conversation";
import { UserMessage } from "../entities/Message";
import { AiAgent } from "../services/AiAgent";

export interface AnswerUserParams {
  conversationId: string | null;
  question: string;
}

export interface AnswerUserResponse {
  conversationId: Id;
  answer: string;
}

export class AnswerUserUseCase {
  constructor(
    private conversationRepository: ConversationRepository,
    private aiAgent: AiAgent
  ) {}

  async execute(params: AnswerUserParams): Promise<AnswerUserResponse> {
    let conversation = new Conversation();
    if (params.conversationId) {
      const id = new Id(params.conversationId);
      const foundConversation = await this.conversationRepository.findById(id);
      conversation = foundConversation ?? conversation;
    }

    conversation.addMessage(new UserMessage(params.question));

    await this.aiAgent.ask(conversation);
    await this.conversationRepository.upsert(conversation);

    console.log(conversation.toString());

    const response = conversation.messages.at(-1)!!;

    return {
      conversationId: conversation.id,
      answer: response.toString(),
    };
  }
}
