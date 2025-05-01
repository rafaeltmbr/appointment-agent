export interface AppointmentHoursService {
  listNextHours(): Promise<Date[]>;
}
