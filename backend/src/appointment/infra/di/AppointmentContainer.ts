import { AppointmentRepository } from "../../core/data/repositories/AppointmentRepository";
import { AppointmentHoursService } from "../../core/services/AppointmentHoursService";
import { CancelAppointmentUseCase } from "../../core/use_cases/CancelAppointmentUseCase";
import { FindAppointmentUseCase } from "../../core/use_cases/FindAppointmentUseCase";
import { ListAvailableAppointmentHoursUseCase } from "../../core/use_cases/ListAvailableAppointmentHoursUseCase";
import { MakeAppointmentUseCase } from "../../core/use_cases/MakeAppointmentUseCase";

export interface AppointmentContainerRepositories {
  appointment: AppointmentRepository;
}

export interface AppointmentContainerData {
  repositories: AppointmentContainerRepositories;
}

export interface AppointmentContainerServices {
  appointmentHours: AppointmentHoursService;
}

export interface AppointmentContainerUseCases {
  find: FindAppointmentUseCase;
  make: MakeAppointmentUseCase;
  cancel: CancelAppointmentUseCase;
  listAvailableHours: ListAvailableAppointmentHoursUseCase;
}

export interface AppointmentContainer {
  data: AppointmentContainerData;
  services: AppointmentContainerServices;
  useCases: AppointmentContainerUseCases;
}
