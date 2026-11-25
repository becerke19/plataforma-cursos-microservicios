import Joi = require('joi');

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3004),

  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5436),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().default('certificates_db'),
});
