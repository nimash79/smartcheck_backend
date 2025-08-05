const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const {PORT} = process.env;

// Swagger configuration
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SmartCheck API',
      version: '1.0.0',
      description: 'API documentation with Swagger',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };
