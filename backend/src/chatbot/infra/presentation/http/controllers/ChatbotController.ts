import { Request, Response } from "express";

import {
  AnswerUserParams,
  AnswerUserUseCase,
} from "../../../../core/use_cases/AnswerUserUseCase";

export class ChatbotController {
  constructor(private answerUserUseCase: AnswerUserUseCase) {}

  async ask(req: Request, res: Response) {
    const params: AnswerUserParams = {
      question: req.body.question,
      conversationId: req.body.conversation_id,
    };

    const response = await this.answerUserUseCase.execute(params);

    const content = {
      answer: response.answer,
      conversation: {
        id: response.conversation.id.value,
        messages: response.conversation.messages.map((message) =>
          message.toString()
        ),
      },
      totalLlmUsage: response.totalLlmUsage,
    };

    res.json(content);
  }
}
