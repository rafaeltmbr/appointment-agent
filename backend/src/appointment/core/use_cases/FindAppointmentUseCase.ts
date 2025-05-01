import {
  Appointment,
  ClientGovernmentId,
  ClientName,
} from "../entities/Appointment";
import { AppointmentRepository } from "../data/repositories/AppointmentRepository";
import { AppointmentError } from "../entities/AppointmentError";

export interface FindAppointmentDto {
  clientName?: string;
  clientGovernmentId?: string;
}

export class FindAppointmentUseCase {
  constructor(private appointmentRepository: AppointmentRepository) {}

  async execute(dto: FindAppointmentDto): Promise<Appointment> {
    if (dto.clientGovernmentId) {
      const governmentId = new ClientGovernmentId(dto.clientGovernmentId);
      const found = await this.appointmentRepository.findByClientGovernmentId(
        governmentId
      );
      if (found) return found;
    }

    if (dto.clientName) {
      const clientName = new ClientName(dto.clientName);
      const found = await this.appointmentRepository.findByClientName(
        clientName
      );
      if (found) return found;
    }

    throw new AppointmentError(
      "appointment_not_found",
      "Appointment not found."
    );
  }
}
