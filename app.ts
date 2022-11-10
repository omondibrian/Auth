/**
 * @fileOverview Root Entry point for the Rest Api.
 * @author Brian Omondi
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import 'module-alias/register';

import * as grpc from '@grpc/grpc-js';
import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerDocs from 'swagger-jsdoc';
import SwaggerUIExpress from 'swagger-ui-express';

import { EmailService } from './src/proto/notification_grpc_pb';
import userRoutes from './src/routes';
import { EmailServiceServer } from './src/services/email/emailServer';

const App = express()
const grpcServer = new grpc.Server();
grpcServer.addService(EmailService, new EmailServiceServer());
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Authorization API",
      version: "1.0.0",
    },
  },
  apis: [
    "./src/routes/index.ts",
  ], // files containing swagger annotations as above
};
const openApiDocs = swaggerDocs(swaggerOptions);
App.use("/docs", SwaggerUIExpress.serve, SwaggerUIExpress.setup(openApiDocs));
App.use(express.urlencoded({ extended: true }));
App.use(express.json());
App.use(fileUpload());
App.use(cors());
App.use(helmet());
App.use('/uploads', express.static('uploads'))
App.use(morgan("tiny"));
App.use('/api/v1/auth/',userRoutes)


// note connection is insecure because the service is internal 
// and should not be exposed to the public network
grpcServer.bindAsync(
  `${process.env.GRPC_HOST?.trim()}:${process.env.GRPC_PORT?.trim()}`,
  grpc.ServerCredentials.createInsecure(),
  (_, port) => {
    grpcServer.start();
    App.listen(process.env.PORT, () =>
      console.log(
        ` Http Server listening on port ${process.env.PORT} and grpc is listening on port ${port}`
      )
    );
  }
);