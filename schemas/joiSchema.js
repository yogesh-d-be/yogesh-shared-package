const Joi = require('joi');

const schemaFieldsType = (value) => {
    if(value.type === String || typeof value === 'string') return Joi.string();
    if(value.type === Number || typeof value === 'number') return Joi.number();
    if(value.type === Boolean || typeof value === 'boolean') return Joi.boolean();
    if(value.type === Date) return Joi.date();
    if(value.type === Array) return Joi.array();
    // if(value.type && value.type.name === '_id')
    return Joi.any();
};


const generateJoiSchema = (mongooseSchemaObj, extraValidations = {}, isUpdate = false) => {
    const joiSchemaObj = {};

    for(const [key, value] of Object.entries(mongooseSchemaObj)){
        let fieldSchema = schemaFieldsType(value);

        if(isUpdate){
            fieldSchema = fieldSchema.optional();
        }else{
            if(value.required){
                fieldSchema = fieldSchema.required();
            }else{
                fieldSchema = fieldSchema.optional();
            }
        }

        //extravalidations
        if(typeof extraValidations[key] === 'function'){
            fieldSchema = extraValidations[key](fieldSchema);
        };

        joiSchemaObj[key] = fieldSchema;
    };

    return Joi.object(joiSchemaObj);

};


module.exports = {
    generateCreateJoiSchema: (mongooseSchemaObj, extraValidations = {}) => generateJoiSchema(mongooseSchemaObj, extraValidations, false),
    generateUpdateJoiSchema: (mongooseSchemaObj, extraValidations = {}) => generateJoiSchema(mongooseSchemaObj, extraValidations, true)
}