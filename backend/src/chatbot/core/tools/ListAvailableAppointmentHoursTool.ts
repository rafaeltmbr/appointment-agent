import { ListAvailableAppointmentHoursUseCase } from "../../../appointment/core/use_cases/ListAvailableAppointmentHoursUseCase";
import { Tool } from "../../core/entities/Tool";

export class ListAvailableAppointmentHoursTool extends Tool {
  constructor(
    private listAvailableAppointmentHoursUseCase: ListAvailableAppointmentHoursUseCase
  ) {
    super(
      "list_available_hours",
      "Lista os horários de agendamento disponíveis. Lembre-se do fuso horário do cliente."
    );
  }

  async execute(parameters: Record<string, string>): Promise<string> {
    const availableHours =
      await this.listAvailableAppointmentHoursUseCase.execute();
    return JSON.stringify(availableHours.map((h) => h.toISOString()));
  }
}
