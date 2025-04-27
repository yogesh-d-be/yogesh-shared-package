const mongoose = require('mongoose');
const { v4 } = require("uuid")

exports.createModel = (
    modelName = "",
    otherFields = {},
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
        toJSONOptions = { virtuals: true, versionKey: false, transform: (_, ret) => {delete ret._id; return ret;}},
        toObjectOptions = {virtuals: true}
    } = options;

    const schema = new mongoose.Schema(
        {
            _id: {
                type: String,
                default: v4
            },
            ...otherFields,
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

    for(const middle of middleware || []){
        if(middle?.type && middle?.event && typeof middle.handler === 'function'){
            schema[middle.type](middle.event, middle.handler);
        }
    }

    for(const v of virtuals || []){
        if(v?.key && typeof v.handler === 'function'){
            schema.virtual(v.key).get(v.handler);
        }
    }

    const model = mongoose.models[modelName] || mongoose.model(modelName, schema);
    return [schema, model];

};