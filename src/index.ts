import express from "express";
import { createServer } from "http";
import router from "./routes/index";
import swaggerjsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { appConfig } from "./configs";
import { swaggerOptions } from "./swagger-config";

const app = express();
const server = createServer(app);

const swaggerDocs = swaggerjsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/", router);

server.listen(appConfig.port, () => {
  console.log(`Server is running on PORT ${appConfig.port}`);
});
