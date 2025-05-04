import { MakeAppointmentUseCase } from "../../../appointment/core/use_cases/MakeAppointmentUseCase";
import { Tool } from "../../core/entities/Tool";

export class MakeAppointmentTool extends Tool {
  constructor(private makeAppointmentUseCase: MakeAppointmentUseCase) {
    super(
      "make_appointment",
      "Cria o agendamento de consulta do usuário através dos dados informados.",
      [
        {
          name: "date",
          description:
            "Data e horário do agendamento no formato ISO 8601 (YYYY-MM-DDThh:mm:ssZ). Não se esqueça do fuso horário.",
          isRequired: true,
        },
        {
          name: "name",
          description: "Nome completo do cliente.",
          isRequired: true,
        },
        {
          name: "government_id",
          description:
            "Número de documento do cliente no (dígitos numéricos no formato: XXX.XXX.XXX.-XX).",
          isRequired: true,
        },
      ]
    );
  }

  async execute(parameters: Record<string, string>): Promise<string> {
    const response = await this.makeAppointmentUseCase.execute({
      date: parameters.date,
      clientName: parameters.name,
      clientGovernmentId: parameters.government_id,
    });
    return response.toString();
  }
}
