import { Id } from "../../../shared/core/entities/Id";
import { Message } from "./Message";

export class Conversation {
  private _id: Id;
  private _messages: Message[];

  constructor(id: Id = Id.generate(), messages: Message[] = []) {
    this._id = id;
    this._messages = messages;
  }

  get id(): Id {
    return this._id;
  }

  get messages(): Message[] {
    return [...this._messages];
  }

  addMessage(message: Message) {
    this._messages.push(message);
  }

  toString(): string {
    return `
Conversation=(
  id='${this._id}',
  messages=[
${this._messages.map((m) => `    ${m}`).join(",\n")}
  ]
)`.trim();
  }
}
