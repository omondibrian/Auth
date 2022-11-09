/**
 * @fileOverview user service data layer.
 * @author Brian Omondi
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { UserDto } from "../DTOs/user.dtos";
import { Repository } from "./IRepository";

export interface IUserRepository {
  insert(data: UserDto): Promise<UserDto>;
  update(
    options: { field: string; value: string },
    data: UserDto
  ): Promise<UserDto>;
  find(data: { field: string; value: string }): Promise<UserDto | undefined>;
  findById(id: string): Promise<UserDto | undefined>;
  Delete(id: string): Promise<UserDto>;
}

export class UserRepository extends Repository implements IUserRepository {

  insert = async (data: UserDto): Promise<UserDto> => {
    const results = await this.client.user.create({
      data:{
        email: data.email,
        name: data.name,
        token: data?.token,
        profilePic: data.profilePic,
        password: data.password,
      },
      select: this._userProjections,
    });
    return this.returnUserPayload(results);
  };
  update = async (
    options: { field: string; value: string },
    data: UserDto
  ): Promise<UserDto> => {
    const results = await this.client.user.update({
      where: {
        // id: options.value,
        [options.field]: options.value,
      },
      data:{
        email: data.email,
        name: data.name,
        token: data?.token,
        profilePic: data.profilePic,
        password: data.password,
      },
      select: this._userProjections,
    });
    console.log(results)
    return this.returnUserPayload(results);
  };
  find = async (data: {
    field: string;
    value: string;
  }): Promise<UserDto | undefined> => {
    const results = await this.client.user.findFirst({
      where: {
        [data.field]: data.value,
      },
      select: this._userProjections,
    });
    if (results === null) return undefined;
    return this.returnUserPayload(results);
  };
  findById = async (id: string): Promise<UserDto | undefined> => {
    const results = await this.client.user.findUnique({
      where: {
        id,
      },
      select: this._userProjections,
    });
    if (results === null) return undefined;
    return this.returnUserPayload(results);
  };
  Delete = async (id: string): Promise<UserDto> => {
    const results = await this.client.user.delete({
      where: {
        id,
      },
      select: this._userProjections,
    });
    return this.returnUserPayload(results);
  };


}
