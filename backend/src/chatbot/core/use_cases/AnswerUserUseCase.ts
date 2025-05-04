import { Id } from "../../../shared/core/entities/Id";
import { ConversationRepository } from "../data/repositories/ConversationRepository";
import { Conversation } from "../entities/Conversation";
import { ModelMessage, UserMessage } from "../entities/Message";
import { AiAgent } from "../services/AiAgent";
import { LlmUsage } from "../services/Llm";

export interface AnswerUserParams {
  conversationId: string | null;
  question: string;
}

export interface AnswerUserResponse {
  answer: string;
  conversation: Conversation;
  totalLlmUsage: LlmUsage;
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

    const totalLlmUsage = await this.aiAgent.ask(conversation);
    await this.conversationRepository.upsert(conversation);

    const response = conversation.messages.at(-1);
    if (!(response instanceof ModelMessage)) {
      throw new Error("Unexpected agent response.");
    }

    return {
      answer: response.text,
      conversation,
      totalLlmUsage,
    };
  }
}
