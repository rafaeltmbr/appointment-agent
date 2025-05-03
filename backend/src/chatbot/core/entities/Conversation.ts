import { Id } from "../../../shared/core/entities/Id";

export class Message {}

export class UserMessage extends Message {
  private _text: string;

  constructor(text: string) {
    super();
    this._text = text;
  }

  get text(): string {
    return this._text;
  }

  toString(): string {
    return `UserMessage(text='${this._text}')`;
  }
}

export class ModelMessage extends Message {
  private _text: string;

  constructor(text: string) {
    super();
    this._text = text;
  }

  get text(): string {
    return this._text;
  }

  toString(): string {
    return `ModelMessage(text='${this._text})'`;
  }
}

export class ToolCallMessage extends Message {
  private _name: string;
  private _parameters: Record<string, any>;

  constructor(name: string, parameters: Record<string, any>) {
    super();
    this._name = name;
    this._parameters = parameters;
  }

  get name(): string {
    return this._name;
  }

  get parameters(): Record<string, any> {
    return this._parameters;
  }

  toString(): string {
    const parameters = Object.keys(this._parameters)
      .map((key) => `${key}: ${this._parameters[key]}`)
      .join(", ");
    return `ToolCallMessage(name='${this._name}', parameters={${parameters}})`;
  }
}

export class ToolResponseMessage extends Message {
  private _name: string;
  private _text: string;

  constructor(name: string, text: string) {
    super();
    this._name = name;
    this._text = text;
  }

  get name(): string {
    return this._name;
  }

  get text(): string {
    return this._text;
  }

  toString(): string {
    return `ToolResponseMessage(name='${this._name}', text={${this._text}})`;
  }
}

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
