const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Rental API",
      version: "1.0.0",
      description: "API documentation for Rental App",
    },

    servers: [
      {
        url: "http://localhost:5000",
      },
    ],

    // 🔐 ADD THIS (VERY IMPORTANT)
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    // 🔐 GLOBAL SECURITY
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./routes/*.js", "./controllers/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;