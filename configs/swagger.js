const { application } = require('express');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi : '3.0.0',
    info :{
        title :"MockMYKU API",
        version :'1.0.0',
        description : "This is a document API for Mock MYKU ptoject"
    },
};

const options = {
    swaggerDefinition,
    apis:['./router/*.js'],
    servers : [{
      url : "http://localhost:3000"
    }],
    application
};
const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;