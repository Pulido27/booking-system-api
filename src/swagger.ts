import swaggerJsdoc from "swagger-jsdoc";

const isProduction = process.env.NODE_ENV === "production";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Booking API",
      version: "1.0.0",
      description: "Sistema de reservas con roles (ADMIN, PROVIDER, CLIENT)",
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:3000",
      },
    ],

    tags: [
      { name: "Auth", description: "Autenticación" },
      { name: "Services", description: "Servicios" },
      { name: "TimeSlots", description: "Disponibilidad" },
      { name: "Appointments", description: "Citas" },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },


  apis: isProduction
    ? ["./dist/modules/**/*.js"]
    : ["./src/modules/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;