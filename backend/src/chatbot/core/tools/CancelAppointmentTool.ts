import { CancelAppointmentUseCase } from "../../../appointment/core/use_cases/CancelAppointmentUseCase";
import { Tool } from "../../core/entities/Tool";

export class CancelAppointmentTool extends Tool {
  constructor(private cancelAppointmentUseCase: CancelAppointmentUseCase) {
    super(
      "cancel_appointment",
      "Cancela o agendamento da consulta do cliente.",
      [
        {
          name: "id",
          description: "Id do agendamento da consulta a ser cancelada.",
          isRequired: true,
        },
      ]
    );
  }

  async execute(parameters: Record<string, string>): Promise<string> {
    await this.cancelAppointmentUseCase.execute({
      id: parameters.id,
    });
    return "ok";
  }
}
