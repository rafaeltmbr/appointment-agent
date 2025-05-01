import { DomainError } from "./DomainError";

export class Id {
  private _value: string;

  constructor(value: string) {
    this._value = value;

    this.validate();
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }

  private validate() {
    if (this._value.length === 0) {
      throw new DomainError("invalid_value", "Id should not be empty.");
    }
  }

  static generate(): Id {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    const chars: string[] = [];

    for (let i = 0; i < 12; i += 1) {
      const index = Math.floor(Math.random() * alphabet.length);
      const char = alphabet[index];
      chars.push(char);
    }

    return new Id(chars.join(""));
  }
}
