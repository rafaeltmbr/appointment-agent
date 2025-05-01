import { AppointmentError } from "../entities/AppointmentError";
import { AppointmentRepository } from "../data/repositories/AppointmentRepository";
import { Id } from "../../../shared/core/entities/Id";

export interface CancelAppointmentDto {
  id: string;
}

export class CancelAppointmentUseCase {
  constructor(private appointmentRepository: AppointmentRepository) {}

  async execute(dto: CancelAppointmentDto): Promise<void> {
    const id = new Id(dto.id);
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new AppointmentError(
        "appointment_not_found",
        "Unable to cancel appointment, because, it was not found."
      );
    }

    await this.appointmentRepository.delete(appointment);
  }
}
