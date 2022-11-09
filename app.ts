/**
 * @fileOverview Root Entry point for the Rest Api.
 * @author Brian Omondi
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import 'module-alias/register';

import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerDocs from 'swagger-jsdoc';
import SwaggerUIExpress from 'swagger-ui-express';
import userRoutes from './src/routes';


const App = express()

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

App.listen(process.env.PORT, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${process.env.PORT}`);
});