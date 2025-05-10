import { DomainError } from "./DomainError";

export class Id {
  private _value: string;

  constructor(value: string = Id.generate().value) {
    this._value = value
      .split("")
      .filter((char) => Id.alphabet.includes(char))
      .join("");

    this.validate();
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }

  private validate() {
    if (this._value.length !== 20) {
      throw new DomainError(
        "invalid_value",
        "Id must have 20 alphanumeric characters."
      );
    }
  }

  private static alphabet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  private static generate(): Id {
    const chars: string[] = [];

    for (let i = 0; i < 20; i += 1) {
      const index = Math.floor(Math.random() * Id.alphabet.length);
      const char = Id.alphabet[index];
      chars.push(char);
    }

    return new Id(chars.join(""));
  }
}
