/**
 * @fileOverview  performs user onboarding process.
 * @author Brian Omondi
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { UserDto } from "@Auth/src/DTOs/user.dtos";
import { IAuthserviceUtilities } from "@Auth/src/lib/utilities/auth_service_utilities";
import { ResultPayload } from "@Auth/src/lib/utilities/result";
import { IUserRepository } from "@Repositories/userRepository";
import { IMailer } from "@Services/email";

export class Registration {
  constructor(
    private readonly repo: IUserRepository,
    private readonly utility: IAuthserviceUtilities,
    private readonly jwt: any,
    private readonly bcrypt: any,
    private readonly mailer: IMailer,
    private readonly config: () => {
      env: string | undefined;
  }
  ) {}
  public async registeruser(
    newUser: UserDto
  ): Promise<
    ResultPayload<{ message: string }> | ResultPayload<Error> | undefined
  > {
  
    try {
      // validate the user input
      const { error } = this.utility.registrationValidation(newUser);
      if (error) { throw new Error(`${error.details[0].message}`); }

      // check if the email already exists
      const user = await this.repo.find({
        field: "email",
        value: newUser.email,
      });
      if (user) { throw new Error("email already exists"); }

      // encrpte the password
      const encrptedPass = await this.bcrypt.hash(newUser.password, 10);
      // create a new user
      const savedUser = await this.repo.insert({
        name: newUser.name,
        email: newUser.email,
        password: encrptedPass,
        profilePic: newUser.profilePic,
      });
      if (!savedUser) { throw new Error("cannot send mail to user of undefined"); }

      const payload = { email: savedUser.email };
      const secreateToken = this.jwt.sign(payload, process.env.SECREATE_TOKEN);
      // compose an email
      const html = `
          Congrats  ${savedUser.name},<br/>
          Thank You for joining our platform feel free to explore the 
          extensive catalogue of products offered at discounted prices
          Have a nice day.🙋🙋<br/>
          <small>this is an automated email</small>
          `;
      // send the email
      console.log(savedUser);
      await this.mailer.send({
        to: savedUser.email,
        from: process.env.SMTP_USER as string,
        body: html,
        subject: "Account Creation",
        text: html,
      });
      const result = {
        message: "registration sucessfull please check your email",
      };

      return new ResultPayload<{ message: string }>(result, 200);
    } catch (error: any) {
      console.log(error)
      /* istanbul ignore else */
      const msg =
        this.config().env !== "production"
          ? error.message
          : "unable to register new user at the moment please try again";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}