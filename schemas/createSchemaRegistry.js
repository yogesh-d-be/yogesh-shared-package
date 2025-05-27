const {Schema} = require('mongoose');

function createSchemaRegistry (globalSchema = {}) {
    const schemaCache = new Map();

    function getFields (fields) {
        const sortFields = [...fields].sort();
        const cacheKey = sortFields.join(",");

        if(schemaCache.has(cacheKey)) {
            return schemaCache.get(cacheKey);
        }

        const schema = {};

        for(const field of sortFields){
            if(!globalSchema[field]) {
                 throw new Error(`Schema field "${field}" not found in provided globalSchema.`);
            }

            schema[field] = {...globalSchema[field]};
        }

        schemaCache.set(cacheKey, schema);
        return schema;
    }

    return{
        getFields,
        getAllFields: () => ({...globalSchema})
    }
}

module.exports = {createSchemaRegistry}