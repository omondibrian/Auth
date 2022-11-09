/**
 * @fileOverview user service  base data layer interface .
 * @author Brian Omondi
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { DBClient } from "@Auth/src/lib/utilities/prismaClient";
import { UserDto } from "../DTOs/user.dtos";
export abstract class Repository {
  protected client = DBClient.getInstance().prisma;

  protected returnUserPayload(results: {
    name: string;
    email: string;
    password: string | null;
    token: string | null;
    id: string;
    profilePic: string;
  }): UserDto | PromiseLike<UserDto> {
    return new UserDto(
      results.name,
      results.email,
      results.profilePic,
      results.password!,
      results.id,
      results.token!
    );
  }

  protected _userProjections = {
    id: true,
    email: true,
    name: true,
    password: true,
    profilePic: true,
    token: true,
  };
}
