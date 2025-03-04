export const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Github Repo Details API",
      description: "github Repo Details",
      contact: {
        name: "Adedeji Adelanwa",
      },
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/router.ts"],
};
