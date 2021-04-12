import { Response } from "express";
import * as messaeActiona from "../actions/messaeActiona";
import * as statusActions from "../actions/statusActions";
import * as valPer from "../text/validation";
export const inValidToken = (res: Response) => {
    res.status(200).json({
        ok: false,
        status: statusActions.NOT_FOUND.Code,
        message: messaeActiona.USER_TOKEN_INVALID,
        error: "Your Token Is Invalid"
    });
};
export const ConfirmCodeInValid = (res: Response) => {
    res.status(statusActions.BAD_REQUEST.Code).json({
        ok: false,
        error: messaeActiona.CONFIRM_CODE_INVALID,
        message: "confrim code is invalid"
    });
};


export const tokenIsRequired = (res: Response) => {
    res.status(200).json({
        ok: false,
        status: statusActions.BAD_REQUEST.Code,
        message: messaeActiona.TOKEN_IS_REQIRED,
        error: "Token  Is  Reqired!!!",
    })
};
export const LoginFailed = (res: Response) => {
    res.status(200).json({
        ok: false,
        status: statusActions.LOGIN_FAILEd.Code,
        message: messaeActiona.LOGIN_FAILED,
        error: "User name Or Pawword is In Correct!!!",
    })
};
export const NotFoundUser = (res: Response) => {
    res.status(statusActions.NOT_FOUND.Code).json({
        ok: false,
        error: messaeActiona.USER_NOT_FOUND,
        message: "Authenticate Iss Fails \n User Not Found",
    })
};
// return res.status(400).json({ ok: true, error: "NOT_EXIST_USER" });

export const UserNotExist = (res: Response) => {
    res.status(200).json({
        ok: false,
        status: statusActions.USER_NOT_EXIST.Code,
        message: messaeActiona.USER_NOT_EXIST,
        error: "Cant not find this user width email or username",
    })
};
export const UsernameExist = (res: Response) => {
    res.status(200).json({
        ok: false,
        status: statusActions.NOT_FOUND.Code,
        message:messaeActiona.EXIST_USERNAME,
        formErrors: {
            username: valPer.usernameUsed
        }
    })
};
export const EmailExist = (res: Response) => {
    res.status(200).json({
        ok: false,
        status: statusActions.EMAIL_EXIST.Code,
        message:messaeActiona.EXIST_EMAIL,
        formErrors: {
            email: valPer.emailUsed
        }
    })
};
export const AuthorizationFailed = (res: Response) => {
    res.status(statusActions.AUTHORIZATION_FAILED.Code).json({
        ok: false,
        error: messaeActiona.AUTHORIZATION_FAILED,
        message: "This Authorize Forbiden For You",
    });
};
export const AppKeyNull = (res: Response) => {
    res.status(statusActions.AUTHORIZATION_FAILED.Code).json({
        ok: false,
        error: messaeActiona.AUTHORIZATION_FAILED,
        message: "This Authorize Forbiden For You :[Required AppKey]",
    });
};