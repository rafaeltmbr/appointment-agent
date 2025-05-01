import { Router } from "express";

import { AppointmentController } from "../controllers/AppointmentController";
import { appointmentContainer } from "../../../di/impl/appointmentContainer";
import { celebrate, Joi, Segments } from "celebrate";

export const appointmentRouter = Router();

const appointmentController = new AppointmentController(
  appointmentContainer.useCases.find,
  appointmentContainer.useCases.make,
  appointmentContainer.useCases.cancel,
  appointmentContainer.useCases.listAvailableHours
);

appointmentRouter.get(
  "/",
  celebrate({
    [Segments.QUERY]: Joi.object()
      .keys({
        client_name: Joi.string().trim(),
        client_government_id: Joi.string().trim(),
      })
      .required(),
  }),
  appointmentController.find.bind(appointmentController)
);

appointmentRouter.get(
  "/available-hours",
  celebrate({
    [Segments.QUERY]: Joi.object().keys({}),
  }),
  appointmentController.listAvailableHours.bind(appointmentController)
);

appointmentRouter.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object()
      .keys({
        date: Joi.string().isoDate().required(),
        client_name: Joi.string().trim().required(),
        client_government_id: Joi.string().trim().required(),
      })
      .required(),
  }),
  appointmentController.make.bind(appointmentController)
);

appointmentRouter.delete(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object()
      .keys({
        id: Joi.string().trim().required(),
      })
      .required(),
  }),
  appointmentController.cancel.bind(appointmentController)
);
