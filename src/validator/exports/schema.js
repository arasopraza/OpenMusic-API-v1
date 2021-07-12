const Joi = require('joi');
 
const ExportPalylistsPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});
 
module.exports = ExportPalylistsPayloadSchema;