/**
 * @fileOverview user service application layer. contains all the api routes
 * @author Brian Omondi
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Router } from 'express';
import path from 'path';

import { UserDto } from '../DTOs/user.dtos';
import { ProfileValidation, registrationValidation, TokenMiddleware } from '../lib/middlewares';
import { UserServiceProvider } from '../services/user';


const userRoutes = Router();

const serviceProvider: UserServiceProvider = new UserServiceProvider();
const registerUsecase = serviceProvider.registration;
const login = serviceProvider.login;
const resetPass = serviceProvider.resetPass;
const fetchProfile = serviceProvider.fetchProfile;
const editProfile = serviceProvider.editProfile;

/**
 * @openapi
 * components :
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * definitions:
 *  User:
 *   type: object
 *   properties:
 *      name:
 *       type: string
 *       description:  user name
 *       example: 'John Doe'
 *      email:
 *       type: string
 *       description:  user email
 *       example: 'Johndoe@test.com'
 *      profilePic:
 *       type: string
 *       description:  user's profile picture url
 *       example: '/uploads/example.jpg'
 *      role: 
 *        description: defines the user's specified roles
 *        enum:
 *          - ADMIN
 *          - CUSTOMER 
 *      password:
 *       type: string
 *       description:  user's password
 *       example: 'password'
 *
 *  UserFormData:
 *   type: object
 *   properties:
 *      name:
 *       type: string
 *       description:  user name
 *       example: 'John Doe'
 *      email:
 *       type: string
 *       description:  user email
 *       example: 'Johndoe@test.com'
 *      profilePic:
 *       type: file
 *       description:  user's profile picture url
 *       example: '/uploads/example.jpg'
 *      role: 
 *        description: defines the user's specified roles
 *        enum:
 *          - ADMIN
 *          - CUSTOMER 
 *      password:
 *       type: string
 *       description:  user's password
 *       example: 'password'
 *  UpdateProfileFormData:
 *   type: object
 *   properties:
 *      name:
 *       type: string
 *       description:  user name
 *       example: 'John Doe'
 *      profilePic:
 *       type: file
 *       description:  user's profile picture url
 *       example: '/uploads/example.jpg'
 *      password:
 *       type: string
 *       description:  user's password
 *       example: 'password'
 *  UpdatableProfileDetails:
 *   type: object
 *   properties:
 *      name:
 *       type: string
 *       description:  user name
 *       example: 'John Doe'
 *      password:
 *       type: string
 *       description:  user's password
 *       example: 'password'
 *
 * /api/v1/auth/register:
 *   post:
 *     description: initiates registration proces
 *     parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *         $ref: '#/definitions/User'
 *     requestBody:
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/definitions/User'
 *       multipart/form-data:
 *        schema:
 *         $ref: '#/definitions/UserFormData'
 *     responses:
 *      200:
 *       description: registration sucessfull please check your email
 *      403:
 *       description: Error- invalid request payload
 *      500:
 *       description: registration unsucessfull please retry
 */
userRoutes.post("/register", registrationValidation, async (req: any, res) => {
  let uploadPath;

  const { name, email, password ,role} = req.body;
  let profilePic: any = { name: "http://www.gravatar.com/avatar/?d=identicon" };
  uploadPath = path.relative(".", "uploads");

  if (req.files && Object.keys(req.files).length > 0) {
    profilePic = req.files.profilePic;
    profilePic.mv(uploadPath + "/" + Date.now() + profilePic.name);
  }

  const newUser = new UserDto(
    name,
    email,
    req.files
      ? uploadPath + "/" + Date.now() + profilePic.name
      : profilePic.name,
    role,
    password
  );

  const result = await registerUsecase.registeruser(newUser);
  res.status(result!.status).json({
    user: result!.getResult().payload,
    message: result!.getResult().message,
  });
});

/**
 * @openapi
 * definitions:
 *  loginParams:
 *   type: object
 *   properties:
 *      email:
 *       type: string
 *       description:  user's email
 *       required: true
 *       example: 'Johndoe@test.com'
 *      password:
 *       type: string
 *       description:  user's password
 *       required: true
 *       example: 'secreate password'
 * /api/v1/auth/login:
 *   post:
 *     description: initiates local login process
 *     parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *         $ref: '#/definitions/loginParams'
 *     requestBody:
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/definitions/loginParams'
 *     responses:
 *      200:
 *       description:  sucessfully logged in
 *      401:
 *       description: access denied
 *      500:
 *       description: internal server error
 *
 */
userRoutes.post("/login", async (req, res) => {
  const result = await login.login(req.body);
  res.status(result!.status).json({
    user: result!.getResult().payload,
    message: result!.getResult().message,
  });
});

/**
 * @openapi
 *
 * /api/v1/auth/edit:
 *   put:
 *     description: edit user profile
 *     security:
 *       - BearerAuth : []
 *     consumes:
 *      - application/json
 *     parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *         $ref: '#/definitions/UpdatableProfileDetails'
 *
 *     requestBody:
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/definitions/UpdatableProfileDetails'
 *       multipart/form-data:
 *        schema:
 *         $ref: '#/definitions/UpdateProfileFormData'
 *     responses:
 *      200:
 *       description: sucessfully updated your profile
 *      500:
 *       description: profile update unsucessfull please retry
 */
userRoutes.put(
  "/edit",
  TokenMiddleware,
  ProfileValidation,
  async (req: any, res) => {
    const result = await editProfile.update(req.UserId, {
      ...req.body,
      ...req.files,
    });
    const data = result!.getResult().payload as UserDto;
    res.status(result!.status).json({
      user: {
        name: data.name,
        email: data.email,
        profilePic: data.profilePic,
        role: data.role,
      },
      message: result!.getResult().message,
    });
  }
);

/**
 * @openapi
 * definitions:
 *  forgotpass:
 *   type: object
 *   properties:
 *      email:
 *       type: string
 *       description:  user's email
 *       required: true
 *       example: 'Johndoe@test.com'
 * /api/v1/auth/password-reset:
 *   post:
 *    description: reset's user password
 *    parameters:
 *     - in: body
 *       name: body
 *       required: true
 *       schema:
 *        $ref: '#/definitions/forgotpass'
 *    requestBody:
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/definitions/forgotpass'
 *    responses:
 *      200:
 *       description:  sucessfull reset password please check your email
 *      500:
 *       description: password reset unsucessfull please retry
 *
 */
userRoutes.post("/password-reset", async (req, res) => {
  const result = await resetPass.reset(req.body);
  res.status(result!.status).json({
    user: result!.getResult().payload,
    message: result!.getResult().message,
  });
});

/**
 * @openapi
 * /api/v1/auth/profile:
 *   get:
 *     description: fetch user profile data
 *     security:
 *       - BearerAuth : []
 *     responses:
 *      200:
 *       description: profile retrival successfull
 *      500:
 *       description: error retriving user profile
 */
userRoutes.get("/profile", TokenMiddleware, async (req: any, res) => {
  const result = await fetchProfile.profile(req.UserId);
  const data = result!.getResult().payload as UserDto;
  res.status(result!.status).json({
    user: {
      name: data.name,
      email: data.email,
      profilePic: data.profilePic,
      role: data.role,
    },
    message: result!.getResult().message,
  });
});

/**
 * @openapi
 * /api/v1/auth/otp/{token}:
 *   get:
 *     description: used to verify one time password (otp)
 *     parameters:
 *      - in: path
 *        name: token
 *        required: true
 *        type: interger
 *        example: 1234
 *        description: otp provided to the user
 *     responses:
 *      200:
 *       description: otp verification was successfull
 *      500:
 *       description: error verifying token
 */
userRoutes.get("/otp/:token", async (req: any, res) => {
  const result = await serviceProvider.verifyToken.verify(req.params.token);
  res.status(result!.status).json({
    payload: result!.getResult().payload!,
    message: result!.getResult().message,
  });
});

export default userRoutes;
