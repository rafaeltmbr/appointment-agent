import { ConversationRepository } from "../../core/data/repositories/ConversationRepository";
import { AiAgent } from "../../core/services/AiAgent";
import { Llm } from "../../core/services/Llm";
import { AnswerUserUseCase } from "../../core/use_cases/AnswerUserUseCase";

export interface ChatbotContainerRepositories {
  conversation: ConversationRepository;
}

export interface ChatbotContainerData {
  repositories: ChatbotContainerRepositories;
}

export interface ChatbotContainerServices {
  aiAgent: AiAgent;
  llm: Llm;
}

export interface ChatbotContainerUseCases {
  answerUser: AnswerUserUseCase;
}

export interface ChatbotContainer {
  data: ChatbotContainerData;
  services: ChatbotContainerServices;
  useCases: ChatbotContainerUseCases;
}
