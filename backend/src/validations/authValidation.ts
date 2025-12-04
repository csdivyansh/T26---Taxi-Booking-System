import Joi from "joi";

export const signupValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  role: Joi.string().valid("rider", "driver").default("rider"),
});

export const signinValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateProfileValidation = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  phone: Joi.string().pattern(/^[0-9]{10}$/),
  profilePicture: Joi.string().uri(),
}).min(1);
