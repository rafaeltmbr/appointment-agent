export const appointmentErrorCodes = [
  "appointment_already_exists",
  "appointment_past_date",
  "appointment_not_found",
  "appointment_date_already_taken",
  "appointment_date_unavailable",
] as const;

export type AppointmentErrorCode = (typeof appointmentErrorCodes)[number];

export class AppointmentError extends Error {
  private _code: AppointmentErrorCode;

  constructor(code: AppointmentErrorCode, message: string) {
    super(message);
    this._code = code;
  }

  get code(): string {
    return this._code;
  }

  toString(): string {
    return `AppointmentError(code=${this._code}, message='${this.message}')`;
  }
}
