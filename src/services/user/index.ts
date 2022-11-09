/**
 * @fileOverview user service fascade.
 * @author Brian Omondi
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import AuthServiceUtilities, {
  IAuthserviceUtilities,
} from "@Auth/src/lib/utilities/auth_service_utilities";
import { IUserRepository } from "@Auth/src/Repositories/userRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { config } from "../../config";
import NotificationService, { IMailer } from "../email";
import { UserRepository } from "@Repositories/userRepository";
import { EditProfile } from "./EditProfile";
import { LogIn } from "./Login";
import { PasswordReset } from "./PasswordReset";
import { Registration } from "./registration";
import { VerifyToken } from "./VerifyToken";
import { ViewProfile } from "./ViewProfile";

export class UserServiceProvider {
  private readonly utilities: IAuthserviceUtilities;
  private readonly repo: IUserRepository;
  private readonly mailer: IMailer;
  constructor() {
    this.repo = new UserRepository();
    this.mailer = new NotificationService({
      user: process.env.SMTP_USER as string,
      hostSMTP: process.env.SMTP_HOST as string,
      password: process.env.SMTP_PASSWORD as string,
    });
    this.utilities = new AuthServiceUtilities();
  }

  /**
   * @description registration service
   */
  public get registration() {
    return new Registration(
      this.repo,
      this.utilities,
      jwt,
      bcrypt,
      this.mailer,
      config
    );
  }
  /**
   * @description login service
   */
  public get login() {
    return new LogIn(this.repo, this.utilities, jwt, bcrypt, config);
  }
  /**
   * @description password reset service
   */
  public get resetPass() {
    return new PasswordReset(
      this.repo,
      this.mailer,
      this.utilities,
      bcrypt,
      config
    );
  }

  /**
   * @description verify otp tokens
   */
  public get verifyToken() {
    return new VerifyToken(this.repo, jwt, config);
  }
  /**
   * @description fetchprofile service
   */
  public get fetchProfile() {
    return new ViewProfile(this.repo, config);
  }
  /**
   * @description edit profile service
   */
  public get editProfile() {
    return new EditProfile(this.repo, bcrypt, config);
  }
}
