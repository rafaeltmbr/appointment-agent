export class Message {}

export class UserMessage extends Message {
  private _text: string;

  constructor(text: string) {
    super();
    this._text = text.trim();
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
    this._text = text.trim();
  }

  get text(): string {
    return this._text;
  }

  toString(): string {
    return `ModelMessage(text='${this._text}')`;
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
      .map((key) => `${key}: '${this._parameters[key]}'`)
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
    return `ToolResponseMessage(name='${this._name}', text='${this._text}')`;
  }
}
