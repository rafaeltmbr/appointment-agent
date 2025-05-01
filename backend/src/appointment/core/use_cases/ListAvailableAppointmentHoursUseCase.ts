import { AppointmentRepository } from "../data/repositories/AppointmentRepository";
import { AppointmentHoursService } from "../services/AppointmentHoursService";

export class ListAvailableAppointmentHoursUseCase {
  constructor(
    private appointmentRepository: AppointmentRepository,
    private appointmentHoursService: AppointmentHoursService
  ) {}

  async execute(): Promise<Date[]> {
    const nextAppointmentHours =
      await this.appointmentHoursService.listNextHours();

    const appointments = await this.appointmentRepository.findAllByDates(
      nextAppointmentHours
    );

    const appointmentHours = new Set(appointments.map((a) => a.date));

    return nextAppointmentHours.filter(
      (h) => !appointmentHours.has(h.toISOString())
    );
  }
}
