const Joi = require('@hapi/joi')

module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {
      const result = schema.validate(req.body)
      if (result.error) {
        const error = new Error(result.error.details[0].message)
        error.statusCode = 400
        throw error
      }

      if (!req.value) {
        req.value = {}
      }
      req.value.body = result.value
      next()
    }
  },

  schemas: {
    authSchema: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(5).required()
    })
  }
}
