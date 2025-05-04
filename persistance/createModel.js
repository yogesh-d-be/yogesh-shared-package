const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const handleMongooseError = require('./handleMongooseError');

exports.createModel = (
  modelName = "",
  schemaFields = {},
  middleware = [],
  virtuals = [],
  options = {}
) => {
  const {
    strict = true,
    timestamps = true,
    isActive = true,
    isArchive = false,
    schemaVersion = 1,
    toJSONOptions = {
      virtuals: true,
      versionKey: false,
      transform: (_, ret) => {
        delete ret._id;
        return ret;
      }
    },
    toObjectOptions = { virtuals: true }
  } = options;

  const schema = new mongoose.Schema(
    {
      _id: { type: String, default: uuidv4 },
      ...schemaFields,
      isArchive: { type: Boolean, default: isArchive },
      isActive: { type: Boolean, default: isActive },
      schemaVersion: { type: Number, default: schemaVersion },
    },
    {
      strict,
      timestamps,
      collection: modelName,
      toJSON: toJSONOptions,
      toObject: toObjectOptions,
    }
  );

  // Attach hooks
  const events = [
    'save', 'insertMany', 'update', 'updateOne', 'updateMany',
    'findOneAndUpdate', 'findByIdAndUpdate'
  ];
  events.forEach(event => schema.post(event, handleMongooseError));

  // Attach middleware
  middleware.forEach(({ type, event, handler }) => {
    if (type && event && typeof handler === 'function') {
      schema[type](event, handler);
    }
  });

  // Attach virtuals
  virtuals.forEach(({ key, handler }) => {
    if (key && typeof handler === 'function') {
      schema.virtual(key).get(handler);
    }
  });

  const model = mongoose.models[modelName] || mongoose.model(modelName, schema);
  return [schema, model];
};
