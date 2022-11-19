/**
 * @fileOverview retrives user's profile info.
 * @author Brian Omondi
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { UserDto } from "@Auth/src/DTOs/user.dtos";
import { ResultPayload } from "@Auth/src/lib/utilities/result";
import { IUserRepository } from "@Repositories/userRepository";

export class ViewProfile {
  constructor(
    private readonly repo: IUserRepository,
    private readonly config: any
  ) {}

  public async profile(
    userId: string
  ): Promise<ResultPayload<UserDto> | ResultPayload<Error> | undefined> {
    try {
      const profile = (await this.repo.findById(userId)) as UserDto;
      const user = new UserDto(
        profile.name,
        profile.email,
        profile.profilePic,
        profile.role,
        profile.id
      );

      const result = new ResultPayload<UserDto>(user, 200);
      return result;
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to fetch Profile";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}