/**
 * @fileOverview performs otp verfication.
 * @author Brian Omondi
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { UserDto } from "@Auth/src/DTOs/user.dtos";
import { ResultPayload } from "@Auth/src/lib/utilities/result";
import { IUserRepository } from "@Repositories/userRepository";

export class VerifyToken {
  constructor(
    private readonly repo: IUserRepository,
    private readonly jwt: any,
    private readonly config: any
  ) {}

  public async verify(
    token: string
  ): Promise<
    | ResultPayload<{ message: string; token: string }>
    | ResultPayload<Error>
    | undefined
  > {
    let user: UserDto | undefined;

    try {
      // check if the token passed exists  or doesn't exists
      user = await this.repo.find({
        field: "token",
        value: token,
      });
      if (!user) throw new Error("Invalid Token Passed");
      //reset token to prevent multiple use
      await this.repo.update(
        {
          field: "id",
          value: user.id!,
        },
        { ...user, token: "" }
      );
    } catch (error: any) {
      const message =
        this.config().env !== "production"
          ? error.message
          : "unable to verify token at the moment please try again";
      return new ResultPayload<Error>(new Error(message), 500);
    }
    // create and assign an authentification token
    const authToken = this.jwt.sign(
      { _id: user.id },
      process.env.SECREATE_TOKEN,
      {
        expiresIn: 10 * 60,
      }
    );

    return new ResultPayload<{ message: string; token: string }>(
      {
        message: "otp verification was successfull",
        token: authToken,
      },
      200
    );
  }
}
