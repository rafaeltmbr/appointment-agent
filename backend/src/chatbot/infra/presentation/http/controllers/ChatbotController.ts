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

    const answer = await this.answerUserUseCase.execute(params);

    const response = {
      conversation_id: answer.conversationId.value,
      answer: answer.answer,
    };

    res.json(response);
  }
}
