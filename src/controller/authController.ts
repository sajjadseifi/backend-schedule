import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import { IUser } from "../types/user.type";
import { IResetPassword } from "../types/reset-password.type";
import { IConfrirmCode } from "../types/confirm-code.type";
import User from "../model/entity/user.model";
import ConfirmCode from "../model/entity/confirm-code.model";
import ResetPassword from "../model/entity/reset-password.model";
import * as authErrorActions from "../Error/authError";
import { generateCodeNumeric } from "../utils/generatior";
import {
    SEKRET_KEY,
    SEKRET_KEY_CONFIRM_CODE,
    SEKRET_KEY_RESET_PASSWORD
} from "../constants/secret";
import { sendConfirmCode, sendPasswordSuccess, sendResetPassword, sendSignUpVerification } from "./senderController";
import * as validPer from "../text/validation";
export const validaitonAuthDataSignUp: RequestHandler = (req, res, next) => {
    const username: string = req.body.username;
    const email: string = req.body.email;
    const password: string = req.body.password;
    let formErrors = {};
    let isValid = true;
    if (!username || username.length < 3) {
        isValid = false;
        formErrors = { ...formErrors, username: validPer.minLength3 };
    }
    else if (username.length > 20) {
        isValid = false;
        formErrors = { ...formErrors, username: validPer.maxLength20 };
    }
    if (!email || email.length < 8 || email.split("@").length == 1) {
        isValid = false;
        formErrors = { ...formErrors, email: email.length < 8 ? validPer.minLength8 : validPer.foramtIsInValid };
    }
    if (!password || password.length < 3) {
        isValid = false;
        formErrors = { ...formErrors, password: validPer.minLength3 };
    }
    else if (password.length > 20) {
        isValid = false;
        formErrors = { ...formErrors, password: validPer.maxLength20 };
    }

    if (!isValid) {
        return res.status(200).json({
            ok: false,
            status: 400,
            message: "BAD_REQUEST_DATA",
            formErrors
        });
    }

    next();
};

export const validaitonAuthDataLogin: RequestHandler = (req, res, next) => {
    const username: string = req.body.username;
    const password: string = req.body.password;
    let formErrors = {};

    let isValid = true;
    if (!username || username.length < 3) {
        isValid = false;
        formErrors = {
            ...formErrors, username: validPer.minLength3
        };
    }
    if (!password || password.length < 3) {
        isValid = false;
        formErrors = {
            ...formErrors, password: validPer.minLength3
        };
    }
    else if (password.length > 20) {
        isValid = false;
        formErrors = { ...formErrors, password: validPer.maxLength20 };
    }

    if (!isValid) {
        return res.status(200).json({
            ok: false,
            status: 400,
            message: "BAD_REQUEST_DATA",
            formErrors
        });
    }

    next();

};

export const validationAuthDataForgetPassword: RequestHandler = (req, res, next) => {
    try {
        const username: string = req.body.username;
        console.log("username");
        let formErrors = {};
        let isValid = true;
        if (!username || username.length < 3) {
            isValid = false;
            formErrors = { ...formErrors, username: validPer.minLength3 };
        }
        if (!isValid) {
            return res.status(200).json({
                ok: false,
                status: 400,
                message: "BAD_REQUEST_DATA",
                formErrors
            });
        }

        next();
    } catch (error) {
        res.status(400).json({ ok: false, status: 400, error: error });
    }
};

export const existUser: RequestHandler = async (req, res, next) => {
    const username: string = req.body.username;
    try {
        if (username == null || username == undefined) {
            throw new Error("username or email is required");
        }
        const user = await User.findOne({
            $or: [
                { normalizeUsername: username.toUpperCase() },
                { normalizeEmail: username.toUpperCase() }
            ]
        });

        if (user == null) {
            if (req.url.includes("login"))
                return authErrorActions.LoginFailed(res);

            return authErrorActions.UserNotExist(res);
        }

        req.headers.user_id = user._id;

        next();

    } catch (error) {
        return res.status(400).json({ ok: true, error: error });
    }
}

export const canUseUsername: RequestHandler = async (req, res, next) => {

    try {
        const username: string = req.body.username as string;
        if (username == null || username == undefined) {
            throw new Error("username is required");
        }

        const user: IUser | null = await User.findOne({
            normalizeUsername: username.toUpperCase()
        });

        if (user)
            return authErrorActions.UsernameExist(res);

        if (req.url.includes("can-use-username"))
            return res.status(200).json({ ok: true });
        else
            next();

    } catch (error) {
        return res.status(200).json({ ok: false, error: error });
    }

};
export const canUseEmail: RequestHandler = async (req, res, next) => {
    const email: string = req.body.email as string;

    try {
        if (email == null || email == undefined) {
            throw new Error("email is required");
        }

        const user: IUser | null = await User.findOne({
            normalizeEmail: email.toUpperCase()
        });

        if (user)
            return authErrorActions.EmailExist(res);

        if (req.url.includes("can-use-email"))
            return res.status(200).json({ ok: true });
        else
            next();

    } catch (error) {
        return res.status(400).json({ ok: true, error: error });
    }

};

export const signUp: RequestHandler = async (req, res) => {
    try {
        const body = req.body as Pick<IUser, "username" | "email" | "password">;

        const user: IUser | null = new User({
            ...body,
            normalizeUsername: body.username.toUpperCase(),
            normalizeEmail: body.email.toUpperCase()
        });

        if (user == null) {
            return res.status(200).json({
                ok: false,
                message: "USER_CREATE_FAILD",
            });
        }

        const newUser: IUser | null = await user.save();

        const token: string = await jwt.sign({ user: newUser }, SEKRET_KEY, {});

        const sss = await sendSignUpVerification(newUser.email, token);
        console.log({ sss });
        res.status(201).json({
            ok: true,
            status: 201,
            username: newUser.username,
            tokenId: token,
            message: validPer.signupUser
        });

    } catch (error) {
        console.log(error);
        res.status(200).json({ ok: false, message: error });
    }
};

export const login: RequestHandler = async (req, res) => {
    try {
        const user_id = req.headers.user_id as string;
        const password: string = req.body.password as string;
        const user: IUser | null = await User.findOne({
            _id: user_id,
            password
        });

        if (user == null) {
            return authErrorActions.LoginFailed(res);
        }
        const token: string = await jwt.sign({ user }, SEKRET_KEY, {});

        res.status(200).json({
            ok: true,
            username: user.username,
            tokenId: token,
            message: validPer.login,
        });
    } catch (error) {
        return res.status(304).json({ ok: false, error: error });
    }
};
export const forgetPassword: RequestHandler = async (req, res) => {
    try {
        const user_id = req.headers.user_id as string;
        const user: IUser | null = await User.findById(user_id);
        if (user === null) {
            return res.status(200).json({ ok: false, message: "USER_NOT_EXIST" });
        }
        const code = generateCodeNumeric(4);
        const token = jwt.sign({ user: { _id: user?._id } }, SEKRET_KEY_CONFIRM_CODE, { expiresIn: 130 });

        let confirmed: IConfrirmCode | null = await ConfirmCode.findOneAndUpdate({ user_id }, { code, token });

        if (confirmed == null) {
            confirmed = new ConfirmCode({ user_id, code, token: token, });

            await confirmed.save();
        }

        const resSender = await sendConfirmCode(user.email, code);
        console.log({ resSender });

        res.status(200).json({
            ok: true,
            expiresIn: 120,
            token,
            message: "code sended your emal!",
        });


    } catch (error) {
        console.log(error);
        res.status(400).json({ ok: false, message: "error to send confirm code" });
    }
};
export const confirmCodeValidation: RequestHandler = async (req, res, next) => {
    try {
        const code = req.body.code as string;
        let message = null;
        if (code === null || code === undefined || code.length != 4)
            message = "BAD_REQUEST_DATA";

        if (message) {
            return res.json({
                ok: false,
                message,
                formErrors: {
                    confirmCode: code ? validPer.codeLengthIs4 : validPer.confirmCodeIsRquired
                }
            });
        }

        next();
    } catch (error) {
        res.status(400).json({ ok: false, message: "BAD_REQUEST" });
    }

};
export const confirmCode: RequestHandler = async (req, res) => {
    try {
        const user_id = req.headers.user_id as string;
        const code = req.body.code as string;

        const confirmedUser: IConfrirmCode | null = await ConfirmCode.findOne({ user_id });
        if (confirmedUser === null) {
            return res.status(200).json({ ok: false, message: "USER_REQUEST_IS_NOT_AUTHORIZED", error: "", });
        }
        if (confirmedUser.code !== code) {
            return res.status(200).json({ ok: false, message: "CONFIRM_CODE_NOT_MATCH", error: "", });
        }

        const resetHash = "XSSDSSDFSDW_SDSFSDF_SDF_SDF_SDF_SD__FSD_F";
        const user = {
            _id: confirmedUser.user_id,
            _hash_Code: resetHash,
        };

        const resetToken = await jwt.sign({ user }, SEKRET_KEY_RESET_PASSWORD, { expiresIn: "1d" });
        const oneDay = new Date();

        let resetPassword: IResetPassword | null = await ResetPassword.findOneAndUpdate(
            { user_id },
            {
                token: resetToken,
                resetHash: resetHash,
                expireDate: oneDay,
            }
        );

        if (resetPassword == null) {
            const resetPassword: IResetPassword = new ResetPassword({
                ...user,
                user_id: user._id,
                token: resetToken,
                resetHash: resetHash,
                expireDate: oneDay,
            });
            const createdRS: IResetPassword | null = await resetPassword.save();

            if (createdRS == null)
                return res.status(200).json({ ok: false, message: "FAILURE_TRY_AGAIN" });

        }
        await confirmedUser.delete();

        //send url+token to email for reset password

        //send token for reset password
        const _user: IUser | null = await User.findOne({ _id: user_id });
        if (_user === null) {
            return res.status(200).json({ ok: false, message: "USER_NOT_EXIST" });
        }

        const resSender = await sendResetPassword(_user.email, `http://localhost:8080/api/auth/reset-password/${resetToken}`);

        if (resSender == "EMAIL_NOT_SEND") {
            return res.status(200).json({ ok: false, message: "FAILURE_TRY_AGAIN" });
        }

        res.status(200).json({
            ok: true,
            message: "reset password token sended your email",
            username: _user?.username,
            expiresIn: "1d",
            token: resetToken,
        });

    } catch (error) {
        console.log(error);
        return res.status(404).json({ ok: false, error: error });
    }
};
export const validResetPasswordData: RequestHandler = (req, res, next) => {
    const body = req.body as Pick<any, "password" | "confirmPassword">;
    let isValid = true;
    let formErrors = {

    };

    if (body.password == null || body.password == undefined) {
        isValid = false;
        formErrors = {
            password: validPer.passwordIsReqired
        };
    }
    else if (body.password.length < 3) {
        isValid = false;
        formErrors = { password: validPer.minLength3 };
    }

    if (body.confirmPassword == null || body.confirmPassword == undefined) {
        isValid = false;
        formErrors = { ...formErrors, confirmPassword: validPer.confirmPasswordIsReqired };
    }
    else if (body.password !== body.confirmPassword) {
        isValid = false;
        formErrors = { ...formErrors, confirmPassword: validPer.notMatchToPassword };
    }
    console.log({ formErrors });
    if (!isValid) {
        return res.status(200).json({
            ok: false,
            message: "BAD_REQUEST_DATA",
            formErrors,
        });
    }

    next();
};
export const resetPassword: RequestHandler = async (req, res) => {
    const rstDto = req.headers as Pick<IResetPassword, "token" | "user_id" | "resetHash">;
    const password = req.body.password as string;
    try {
        console.log({ rstDto });
        const resetPassword: IResetPassword | null = await ResetPassword.findOne({
            user_id: rstDto.user_id,
            token: rstDto.token,
        });
        if (resetPassword == null) {
            return res.status(200).json({
                ok: false,
                message: "USER_REQUEST_IS_NOT_AUTHORIZED",
            });
        }

        if (resetPassword.resetHash !== rstDto.resetHash) {
            return res.status(200).json({
                ok: false,
                message: "BAD_REQUEST_TO_RESET_PASSWORD",
            });
        }
        console.log(rstDto.user_id, { password });

        const userUpdated: IUser | null = await User.findByIdAndUpdate(rstDto.user_id, { password });

        if (userUpdated == null) {
            return res.status(200).json({
                ok: false,
                message: "FAILURE_TRY_AGAIN",
            });
        }

        await resetPassword.delete();
        const senderResp = await sendPasswordSuccess(userUpdated.email, userUpdated.username);
        console.log({ senderResp });

        res.status(200).json({ ok: true, message: "PASSWORD_RESET" });

    } catch (error) {
        console.log(error);
        res.status(400).json({ ok: false, error });
    }
};

// export class AuthController {

//     @Validate()
//     signUp(@Validator(User, 'body') req: Request, res: Response) {
//         const username: string = req.body.username;
//         const email: string = req.body.email;
//         const password: string = req.body.password;
//         increasmentId++;
//         const user: IUser = new User(increasmentId, username, email, password);

//         db.User.push(user);
//         jwt.sign({ user: user.getJWT() }, SEKRET_KEY, {}, (err, token) => {
//             if (err) {
//                 return res.status(304).json({ ok: false, error: "ddddd" });
//             }
//             res.status(201).json({
//                 ok: true,
//                 token,
//                 userId: user.id,
//                 message: "user created is successfully"
//             });
//         });
//     }
// }


// class TestClass {
//     @Validate()
//     methodName(@Validator() data: UserLoginDto) {

//     }

//     // @Validate()
//     // serverControllerEndpoint(@Validator(IUser, 'body') req: Request) {
//     //     req.headers;
//     // }
// }

// const instance = new TestClass();

// // // Will throw class-validator errors on runtime
// instance.methodName({
//     username: "sajjadseifi",
//     password: "302320"
// });
