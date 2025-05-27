const { v4: uuidv4 } = require('uuid');

class SchemaFieldBuilder {
  constructor(type) {
    this.field = {};
    if (type) this.type(type);
  }

  type(type) {
    this.field.type = type;
    return this;
  }

  required(isRequired = true) {
    this.field.required = isRequired;
    return this;
  }

  ref(model) {
    this.field.ref = model;
    return this;
  }

  min(value) {
    this.field.min = value;
    return this;
  }

  max(value) {
    this.field.max = value;
    return this;
  }

  match(pattern) {
    this.field.match = pattern;
    return this;
  }

  enum(values) {
    this.field.enum = values;
    return this;
  }

  default(value) {
    this.field.default = value;
    return this;
  }

  index(value = true) {
    this.field.index = value;
    return this;
  }

  unique(value = true) {
    this.field.unique = value;
    return this;
  }

  sparse(value = true) {
    this.field.sparse = value;
    return this;
  }

  immutable(value = true) {
    this.field.immutable = value;
    return this;
  }

  lowercase(value = true) {
    if (this.field.type === String) {
      this.field.lowercase = value;
    }
    return this;
  }

  uppercase(value = true) {
    if (this.field.type === String) {
      this.field.uppercase = value;
    }
    return this;
  }

  trim(value = true) {
    if (this.field.type === String) {
      this.field.trim = value;
    }
    return this;
  }

  validate(validator) {
    this.field.validate = validator;
    return this;
  }

  alias(name) {
    this.field.alias = name;
    return this;
  }

  select(value = true) {
    this.field.select = value;
    return this;
  }

  get(fn) {
    this.field.get = fn;
    return this;
  }

  set(fn) {
    this.field.set = fn;
    return this;
  }

  // For array fields
  items(schema) {
    if (Array.isArray(this.field.type)) {
      this.field.type = [schema];
    }
    return this;
  }

  // For subdocuments
  subSchema(schema) {
    this.field.type = schema;
    return this;
  }


  uuid() {
    this.field.match =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return this;
  }

  build() {
    return { ...this.field };
  }


  static string() {
    return new SchemaFieldBuilder(String);
  }

  static number() {
    return new SchemaFieldBuilder(Number);
  }

  static boolean() {
    return new SchemaFieldBuilder(Boolean);
  }

  static date() {
    return new SchemaFieldBuilder(Date);
  }

  static objectId() {
    return new SchemaFieldBuilder(require("mongoose").Schema.Types.ObjectId);
  }

  static uuid({ auto = true } = {}) {
  return new SchemaFieldBuilder(String)
  .uuid()
  .default(auto ? uuidv4 : undefined);
 }

  static array() {
    return new SchemaFieldBuilder([]);
  }

  static mixed() {
    return new SchemaFieldBuilder(require("mongoose").Schema.Types.Mixed);
  }

  static buffer() {
    return new SchemaFieldBuilder(Buffer);
  }
}

module.exports = { SchemaFieldBuilder };
