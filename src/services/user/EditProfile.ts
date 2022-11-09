/**
 * @fileOverview manages changes to the user's profile.
 * @author Brian Omondi
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { UserDto } from "@Auth/src/DTOs/user.dtos";
import { ResultPayload } from "@Auth/src/lib/utilities/result";
import { IUserRepository } from "@Repositories/userRepository";

export class EditProfile {
  constructor(
    private readonly repo: IUserRepository,
    private readonly bcrypt: any,
    private readonly config: any
  ) {}
  public async update(
    userId: string,
    user: UserDto
  ): Promise<ResultPayload<UserDto> | ResultPayload<Error> | undefined> {
    try {
      let encrptedPass = "";
      let userToUpdate: UserDto;
      let updates: UserDto;

      
      if (user.password) {
        // encrpte the password
        encrptedPass = await this.bcrypt.hash(user.password, 10);
        userToUpdate = { ...user, password: encrptedPass };
        updates = await this.repo.update(
          { field: "id", value: userId },
          userToUpdate
        );
      } else {
        const authUser = await this.repo.findById(userId);
        if (authUser === undefined) throw new Error("User not found");

        updates = await this.repo.update(
          { field: "id", value: userId },
          { ...authUser, ...user }
        );
      }
      const result = new UserDto(
        updates.name,
        updates.email,
        updates.profilePic,
        updates.id
      );
      return new ResultPayload<UserDto>(result, 200);
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to update Profile";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
