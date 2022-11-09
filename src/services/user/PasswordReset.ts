/**
 * @fileOverview manages password reset ops.
 * @author Brian Omondi
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { UserDto } from '@Auth/src/DTOs/user.dtos';
import AuthServiceUtilities from '@Auth/src/lib/utilities/auth_service_utilities';
import { ResultPayload } from '@Auth/src/lib/utilities/result';
import { IUserRepository } from '@Repositories/userRepository';
import { IMailer } from '@Services/email';

export class PasswordReset {
  constructor(
    private readonly repo: IUserRepository,
    private readonly mailer: IMailer,
    private readonly utils:AuthServiceUtilities,
    private readonly bcrypt: any,
    private readonly config: any
  ) {}

  public async reset(credentials: {
    email: string;
    newPassword: string;
  }): Promise<
    ResultPayload<{ message: string }> | ResultPayload<Error> | undefined
  > {
    try {
      const user = (await this.repo.find({
        field: "email",
        value: credentials.email,
      })) as UserDto;
      if (!user) { throw new Error("Invalid Email please try again !"); }

      const otp = this.utils.generateOtp();
     
      const newUser = new UserDto(
        user.name,
        user.email,
        user.profilePic,
        user.password,
        user.id,
        otp
      );
      const result = await this.repo.update(
        { field: "email", value: credentials.email },
        newUser
      );
      if (result) {
        // compose an email
        const html = `
            Hello <strong>${result.name} </strong>,<br/>
            please enter the OTP code below to access your account<br/><br/>
            
            OTP : <span style="color:blue;font-size:18px">${otp}</span><br/><br/>
            
            <small style="color:grey; font-size:8px"> ignore this message if you did not send this request </small>
            Have a nice day.
            `;
        // send the email
        await this.mailer.send({
          to: user.email,
          from: process.env.Email as string,
          body: html,
          subject: "Password Reset",
          text: html,
        });

        return new ResultPayload<{ message: string }>(
          { message: "Password Reset was successfull,please check your email" },
          200
        );
      } else {
        throw new Error("Unable to Finish The Operation");
      }
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "unable to reset password at the moment please try again";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
  
}