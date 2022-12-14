/**
 * @fileOverview handles authorization requests.
 * @author Brian Omondi
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { UserDto } from '@Auth/src/DTOs/user.dtos';
import { IAuthserviceUtilities } from '@Auth/src/lib/utilities/auth_service_utilities';
import { ResultPayload } from '@Auth/src/lib/utilities/result';
import { IUserRepository } from '@Repositories/userRepository';


export class LogIn {
  constructor(
    private readonly repo: IUserRepository,
    private readonly utility: IAuthserviceUtilities,
    private readonly jwt: any,
    private readonly bcrypt: any,
    private readonly config: any
  ) {}

  public async login(credentials: {
    email: string;
    password: string;
  }): Promise<
    | ResultPayload<{ message: string; token: string }>
    | ResultPayload<Error>
    | undefined
  > {
    try {
      // TODO:catch execeptions in the main user's service route

      // validate the user input
      const { error } = this.utility.loginValidation(credentials);
      if (error) { throw new Error(`${error.details[0].message}`); }
      let user: UserDto | undefined;
      try {
        // check if the email passed exists doesn't exists
        user = await this.repo.find({
          field: "email",
          value: credentials.email,
        });
      } catch (error: any) {
        const msg =
          this.config().env !== "production"
            ? error.message
            : "unable to login at the moment please try again";
            throw new Error(msg);
          }
          if (!user) { throw new Error("Error authenticating please try again !"); }
      // check if password is correct
      const validPass = await this.bcrypt.compare(
        credentials.password,
        user.password
      );
      if (!validPass) {
        throw new Error("Error authenticating please try again !");
      }

      // create and assign an authentification token
      const token = this.jwt.sign(
        { _id: user.id },
        process.env.SECREATE_TOKEN
      );

      const result = { message: "login sucessfull", token };
      return new ResultPayload<{ message: string; token: string }>(result, 200);
    } catch (error: any) {
      const msg = error.message;
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}