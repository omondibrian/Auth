/**
 * @fileOverview user service data transfer object.
 * @author Brian Omondi
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export class UserDto {
  public name: string;
  public email: string;
  public profilePic: string;
  public password?: string;
  public id?: string;
  public token?: string;
  public role: UserRole;
  constructor(
    name: string,
    email: string,
    profilePic: string,
    role: string,
    Password?: string,
    id?: string,
    token?: string
  ) {
    this.name = name;
    this.email = email;
    this.profilePic = profilePic;
    this.password = Password;
    this.id = id;
    this.token = token;
    this.role =
      role === "ADMIN"
        ? UserRole.ADMIN
        : role === "CUSTOMER"
        ? UserRole.CUSTOMER
        : UserRole.SELLER;
  }
}

enum UserRole {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
  SELLER = "SELLER",
}
