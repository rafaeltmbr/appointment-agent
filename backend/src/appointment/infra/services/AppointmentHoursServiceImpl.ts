import { AppointmentHoursService } from "../../core/services/AppointmentHoursService";

const defaultOpeningHours: string[] = [
  "08:00:00",
  "09:00:00",
  "10:00:00",
  "11:00:00",
  "13:00:00",
  "14:00:00",
  "15:00:00",
  "16:00:00",
];

const millisecondsInADay = 24 * 60 * 60 * 1_000;

export class AppointmentHoursServiceImpl implements AppointmentHoursService {
  constructor(
    private listDaysInAdvance: number = 3,
    private openingHours: string[] = defaultOpeningHours
  ) {}

  async listNextHours(): Promise<Date[]> {
    const allHours: Date[] = [];

    for (let i = 0; i < this.listDaysInAdvance; i += 1) {
      const timeOffset = millisecondsInADay * i;
      const day = AppointmentHoursServiceImpl.getDayString(
        new Date(Date.now() + timeOffset)
      );

      for (const hour of this.openingHours) {
        allHours.push(new Date(`${day}T${hour}-03:00`));
      }
    }

    const futureHours = allHours.filter((h) => h.getTime() > Date.now());

    return futureHours;
  }

  private static getDayString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
}
