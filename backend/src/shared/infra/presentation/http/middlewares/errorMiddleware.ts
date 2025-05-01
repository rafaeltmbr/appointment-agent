import { Request, Response, NextFunction } from "express";

import { DomainError } from "../../../../core/entities/DomainError";
import { AppointmentError } from "../../../../../appointment/core/entities/AppointmentError";
import { CelebrateError } from "celebrate";

export function errorMiddleware(
  error: any,
  _: Request,
  res: Response,
  __: NextFunction
): void {
  if (error instanceof DomainError || error instanceof AppointmentError) {
    const content = {
      code: error.code,
      message: error.message,
    };

    res.status(400).json(content);
    return;
  }

  if (error instanceof CelebrateError) {
    let segment = "";
    for (const entry of error.details.entries()) {
      segment = entry[0];
      break;
    }
    const content = {
      code: "validation_error",
      message: error.details.get(segment)?.message,
    };

    res.status(400).json(content);
    return;
  }

  const content = {
    code: "internal_server_error",
    message: error.message,
  };
  console.error(content, error);
  res.status(500).json(content);
}
