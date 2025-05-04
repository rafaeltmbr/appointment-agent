import { FindAppointmentUseCase } from "../../../appointment/core/use_cases/FindAppointmentUseCase";
import { Tool } from "../../core/entities/Tool";

export class FindAppointmentTool extends Tool {
  constructor(private findAppointmentUseCase: FindAppointmentUseCase) {
    super(
      "find_appointments",
      "Encontra a consulta do cliente através do seu nome (name) ou número de documento (government_id). Somente um dos parâmetros é necessário.",
      [
        {
          name: "name",
          description: "Nome para procurar o usuário.",
          isRequired: false,
        },
        {
          name: "government_id",
          description: "Número de documento para procurar o usuário.",
          isRequired: false,
        },
      ]
    );
  }

  async execute(parameters: Record<string, string>): Promise<string> {
    const response = await this.findAppointmentUseCase.execute({
      clientName: parameters.name,
      clientGovernmentId: parameters.government_id,
    });

    return response.toString();
  }
}
