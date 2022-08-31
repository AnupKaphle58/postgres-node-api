import Joi from "@hapi/joi";

const registrationValidation = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().required().email(),
  pass: Joi.string().min(6).required(),
});

export default registrationValidation;
