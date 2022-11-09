/**
 * @fileOverview prisma singleton database connnector .
 * @author Brian Omondi
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { PrismaClient } from "@prisma/client";

export class DBClient {
  private static instance: DBClient;

  private constructor() {}
  private _prisma = new PrismaClient();
  public get prisma() {
    return this._prisma;
  }

  public static getInstance() {
    if (!DBClient.instance) {
      DBClient.instance = new DBClient();
    }
    return DBClient.instance;
  }
}

