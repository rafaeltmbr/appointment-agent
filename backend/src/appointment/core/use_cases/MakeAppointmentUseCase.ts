import {
  Appointment,
  Client,
  ClientGovernmentId,
  ClientName,
} from "../entities/Appointment";
import { AppointmentError } from "../entities/AppointmentError";
import { AppointmentRepository } from "../data/repositories/AppointmentRepository";
import { DomainError } from "../../../shared/core/entities/DomainError";
import { AppointmentHoursService } from "../services/AppointmentHoursService";

export interface MakeAppointmentDto {
  date: string;
  clientName: string;
  clientGovernmentId: string;
}

export class MakeAppointmentUseCase {
  constructor(
    private appointmentRepository: AppointmentRepository,
    private appointmentHoursService: AppointmentHoursService
  ) {}

  async execute(dto: MakeAppointmentDto): Promise<Appointment> {
    const date = new Date(dto.date);
    if (Number.isNaN(date)) {
      throw new DomainError("invalid_value", "Invalid appointment date.");
    }

    if (date.getTime() < Date.now()) {
      throw new AppointmentError(
        "appointment_past_date",
        "Unable to make appointment, because, the given date already past."
      );
    }

    const governmentId = new ClientGovernmentId(dto.clientGovernmentId);
    const clientExistentAppointment =
      await this.appointmentRepository.findByClientGovernmentId(governmentId);

    if (clientExistentAppointment) {
      throw new AppointmentError(
        "appointment_already_exists",
        "Unable to make appointment, because, an appointment for the given client already exists."
      );
    }

    const appointmentForDate = await this.appointmentRepository.findByDate(
      date
    );
    if (appointmentForDate) {
      throw new AppointmentError(
        "appointment_date_already_taken",
        "Unable to make appointment, because, the date is already taken."
      );
    }

    const nextAppointmentHours =
      await this.appointmentHoursService.listNextHours();
    const isHourAvailable = nextAppointmentHours.find(
      (h) => h.getTime() === date.getTime()
    );

    if (!isHourAvailable) {
      throw new AppointmentError(
        "appointment_date_unavailable",
        "Unable to make appointment, because, the date is not available."
      );
    }

    const name = new ClientName(dto.clientName);
    const client = new Client(name, governmentId);
    return this.appointmentRepository.create(date, client);
  }
}
