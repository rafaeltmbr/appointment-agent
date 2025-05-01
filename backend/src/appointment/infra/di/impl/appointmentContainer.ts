import { CancelAppointmentUseCase } from "../../../core/use_cases/CancelAppointmentUseCase";
import { FindAppointmentUseCase } from "../../../core/use_cases/FindAppointmentUseCase";
import { ListAvailableAppointmentHoursUseCase } from "../../../core/use_cases/ListAvailableAppointmentHoursUseCase";
import { MakeAppointmentUseCase } from "../../../core/use_cases/MakeAppointmentUseCase";
import { AppointmentRepositoryInMemory } from "../../data/repositories/AppointmentRepositoryInMemory";
import { AppointmentHoursServiceImpl } from "../../services/AppointmentHoursServiceImpl";
import {
  AppointmentContainer,
  AppointmentContainerData,
  AppointmentContainerServices,
  AppointmentContainerUseCases,
} from "../AppointmentContainer";

const data: AppointmentContainerData = {
  repositories: {
    appointment: new AppointmentRepositoryInMemory(),
  },
};

const services: AppointmentContainerServices = {
  appointmentHours: new AppointmentHoursServiceImpl(),
};

const useCases: AppointmentContainerUseCases = {
  find: new FindAppointmentUseCase(data.repositories.appointment),
  make: new MakeAppointmentUseCase(
    data.repositories.appointment,
    services.appointmentHours
  ),
  cancel: new CancelAppointmentUseCase(data.repositories.appointment),
  listAvailableHours: new ListAvailableAppointmentHoursUseCase(
    data.repositories.appointment,
    services.appointmentHours
  ),
};

export const appointmentContainer: AppointmentContainer = {
  data,
  services,
  useCases,
};
