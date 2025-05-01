import { DomainError } from "../../../shared/core/entities/DomainError";
import { Id } from "../../../shared/core/entities/Id";

export const messageTypes = ["user", "agent", "tool"] as const;

export type MessageType = (typeof messageTypes)[number];

export class Message {
  private _type: MessageType;
  private _content: string;

  constructor(type: MessageType, content: string) {
    this._type = type;
    this._content = content;

    this.validate();
  }

  get type(): MessageType {
    return this._type;
  }

  get content(): string {
    return this._content;
  }

  toString(): string {
    return `Message(type=${this._type}, content='${this._content})'`;
  }

  private validate() {
    if (!messageTypes.includes(this._type)) {
      throw new DomainError("invalid_value", "Invalid MessageType.");
    }
  }
}

export class Conversation {
  private _id: Id;
  private _messages: Message[];
  private _lastMessageAt: Date;

  constructor(id: Id, messages: Message[], lastMessageAt: Date) {
    this._id = id;
    this._messages = messages;
    this._lastMessageAt = lastMessageAt;
  }

  get id(): Id {
    return this._id;
  }

  get messages(): Message[] {
    return [...this._messages];
  }

  get lastMessageAt(): Date {
    return this._lastMessageAt;
  }

  toString(): string {
    return `Conversation=(id=${this._id}, lastMessageAt=${this._lastMessageAt}, messages=${this._messages})`;
  }
}
