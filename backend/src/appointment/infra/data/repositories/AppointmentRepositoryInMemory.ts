import { Id } from "../../../../shared/core/entities/Id";
import { AppointmentRepository } from "../../../core/data/repositories/AppointmentRepository";
import {
  Appointment,
  Client,
  ClientGovernmentId,
  ClientName,
} from "../../../core/entities/Appointment";

export class AppointmentRepositoryInMemory implements AppointmentRepository {
  private appointments: Appointment[] = [];

  async findById(id: Id): Promise<Appointment | null> {
    return this.appointments.find((a) => a.id === id.value) ?? null;
  }

  async findByClientName(name: ClientName): Promise<Appointment | null> {
    return this.appointments.find((a) => a.clientName === name.value) ?? null;
  }

  async findByClientGovernmentId(
    governementId: ClientGovernmentId
  ): Promise<Appointment | null> {
    return (
      this.appointments.find(
        (a) => a.clientGovernmentId === governementId.value
      ) ?? null
    );
  }

  async findByDate(date: Date): Promise<Appointment | null> {
    return this.appointments.find((a) => a.date === date.toISOString()) ?? null;
  }

  async findAllByDates(dates: Date[]): Promise<Appointment[]> {
    const dateStrings = new Set(dates.map((d) => d.toISOString()));
    return this.appointments.filter((a) => dateStrings.has(a.date));
  }

  async create(date: Date, client: Client): Promise<Appointment> {
    const id = new Id();
    const appointment = new Appointment(id, date, client);
    this.appointments.push(appointment);
    return appointment;
  }

  async delete(appointment: Appointment): Promise<void> {
    const index = this.appointments.findIndex((a) => a.id === appointment.id);
    if (index >= 0) {
      this.appointments.splice(index, 1);
    }
  }
}
