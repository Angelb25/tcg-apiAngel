const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API TCG',
      version: '1.0.0',
      description: 'Documentation de l’API TCG',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./app.js'], 
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;