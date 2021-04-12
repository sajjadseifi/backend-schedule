import IStatus from "../model/interface/IStatus";

export const BAD_REQUEST: IStatus = { Code: 400, Message: "BAD_REQUEST" };
export const NOT_FOUND: IStatus = { Code: 404, Message: "NOT_FOUND" };
export const USER_NOT_EXIST: IStatus = { Code: 404, Message: "USER_NOT_EXIST" };

export const SUCCESS: IStatus = { Code: 200, Message: "SUCCESS" };

export const CREATED: IStatus = { Code: 201, Message: "CREATED" };

export const FAILD: IStatus = { Code: 400, Message: "CREATED" };

export const INVALID_TOKEN: IStatus = { Code: 505, Message: "INVALID_TOKEN" };

export const EMAIL_EXIST: IStatus = { Code: 400, Message: "EMAIL_EXIST" };

export const USERNAME_EXIST: IStatus = { Code: 400, Message: "USERNAME_EXIST" };

export const AUTHORIZATION_FAILED: IStatus = { Code: 505, Message: "AUTHORIZATION_FAILED" };

export const LOGIN_FAILEd: IStatus = { Code: 400, Message: "LOGIN_FAILEd" };