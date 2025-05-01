export const domainErrorCodes = ["unknown", "invalid_value"] as const;

export type DomainErrorCode = (typeof domainErrorCodes)[number];

export class DomainError extends Error {
  private _code: DomainErrorCode;

  constructor(code: DomainErrorCode, message: string) {
    super(message);
    this._code = code;
  }

  get code(): DomainErrorCode {
    return this._code;
  }

  toString(): string {
    return `DomainError(code=${this._code}, message='${this.message}')`;
  }
}
