const Joi = require("joi")

/**
 * Builds a single Joi field based on the provided schema definition.
 */
function buildJoiField(properties, isUpdate = false) {
  let joiField;

  switch (properties.type) {
    case String:
      joiField = Joi.string();
      if (properties.lowercase) joiField = joiField.lowercase();
      if (properties.uppercase) joiField = joiField.uppercase();
      if (properties.trim) joiField = joiField.trim();
      if (properties.min) joiField = joiField.min(properties.min);
      if (properties.max) joiField = joiField.max(properties.max);
      if (properties.match) joiField = joiField.pattern(new RegExp(properties.match));
      if (properties.enum) joiField = joiField.valid(...properties.enum);
      if (properties.format === "email") joiField = joiField.email();
      if (properties.format === "uri") joiField = joiField.uri();
      break;

    case Number:
      joiField = Joi.number();
      if (properties.min) joiField = joiField.min(properties.min);
      if (properties.max) joiField = joiField.max(properties.max);
      if (properties.enum) joiField = joiField.valid(...properties.enum);
      break;

    case Boolean:
      joiField = Joi.boolean();
      break;

    case Date:
      joiField = Joi.date();
      break;

    case Array:
      joiField = Joi.array();
      if (properties.items) {
        joiField = joiField.items(buildJoiField(properties.items, isUpdate));
      }
      break;

    case Object:
      joiField = Joi.object(buildJoiSchema(properties.schema, isUpdate));
      break;

    default:
      joiField = Joi.any(); // Fallback
  }

  if (properties.default !== undefined) {
    joiField = joiField.default(properties.default);
  }

  if (properties.required && !isUpdate) {
    joiField = joiField.required();
  } else {
    joiField = joiField.optional();
  }

  return joiField;
}

/**
 * Builds a complete Joi object schema.
 */
function buildJoiSchema(schemaDefinition, isUpdate = false) {
  const schema = {};
  for (const [key, props] of Object.entries(schemaDefinition)) {
    schema[key] = buildJoiField(props, isUpdate);
  }
  return Joi.object(schema).options({ abortEarly: false, allowUnknown: false });
}



module.exports = buildJoiSchema;
