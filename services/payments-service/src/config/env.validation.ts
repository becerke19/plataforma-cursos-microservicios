import Joi = require('joi');

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3005),

  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5437),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().default('payments_db'),
});
