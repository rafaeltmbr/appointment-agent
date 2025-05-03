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
    return `Conversation=(\n\tid=${this._id},\n\tmessages=[\n${this._messages
      .map((m) => `\t\t${m}`)
      .join("\n")}\n\t]\n)`;
  }
}
