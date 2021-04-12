import { RequestHandler } from "express";
import * as schedulesError from "../Error/scheduleError";
import * as authErrorActions from "../Error/authError";
import jwt from "jsonwebtoken";
import { SEKRET_KEY, SEKRET_KEY_CONFIRM_CODE, SEKRET_KEY_RESET_PASSWORD } from "../constants/secret";
import User from "../model/entity/user.model";

export const verifyAppKey: RequestHandler = (req, res, next) => {

    if (req.headers["app-key"] === undefined) {
        // return authErrorActions.AppKeyNull(res);
    }
    const appkey: any = req.headers["app-key"];
    //validation app key
    let isValidAppKey = true;


    //chaeck validation
    if (!isValidAppKey) {
        return authErrorActions.AuthorizationFailed(res);
    }

    next();
};
export const verifyAuthrizarion: RequestHandler = (req, res, next) => {
    const { user_id } = req.headers;

    if (user_id === undefined) {
        return authErrorActions.NotFoundUser(res);
    } else {
        req.body.userId = +user_id;
        next();
    }
};
export const verifyToken: RequestHandler = async (req, res, next) => {
    console.log("SSSS");
    let tokenId;
    try {
        tokenId = req.headers.token as string;
        if (tokenId === undefined || tokenId === null || tokenId === "") {
            return authErrorActions.tokenIsRequired(res);
        }
    } catch (error) {
        console.log(error);
        return authErrorActions.tokenIsRequired(res);
    }
    const urlEndPoint = req.url.replace("/", "").split("?")[0];
        let secretKey = "";
    console.log({urlEndPoint});
    let nextAction = (decoded: object | undefined) => { };
    switch (urlEndPoint) {
        case "confirm-code":
            console.log("confirm-code");
            secretKey = SEKRET_KEY_CONFIRM_CODE;
            nextAction = confirmCodePoint;
            break;
        case "reset-password":
            console.log("reset-password");
            secretKey = SEKRET_KEY_RESET_PASSWORD;
            nextAction = resetpasswordPoint;
            break;
        default:
            console.log("default");
            secretKey = SEKRET_KEY;
            nextAction = loginPoint;
            break;
    }

    try {
        const decoded = await jwt.verify(tokenId, secretKey);
        const stringifyToken: string = JSON.stringify(decoded);
        const parsToken = JSON.parse(stringifyToken);
        console.log({ parsToken });

        req.headers.user_id = parsToken.user._id;
        nextAction(parsToken);
        next();

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            message: "NO_SEGGEST",
            urlEndPoint
        });
    }

    function loginPoint(decoded: any) { };

    function confirmCodePoint(decoded: any) { };

    function resetpasswordPoint(decoded: any) {
        req.headers.resetHash = decoded.user._hash_Code;
    }
};

export const verifyExistSchedule: RequestHandler = (req, res, next) => {
    if (req.params.id == null || req.params.id === undefined)
        return schedulesError.BadRequest(res);

    const id = +req.params.id;
    const userId = req.body.userId;

    //set data in db 
    const scheduleIndex = -1;
    // db.Schedules.findIndex(
    //     sch =>
    //         (sch.id === id)
    //         &&
    //         (sch.userId === userId)
    // );

    if (scheduleIndex == -1)
        return schedulesError.BadRequest(res);


    req.body.scheduleIndex = scheduleIndex;
    next();
}

export const user_idNext: RequestHandler = async (req, res, next) => {
    try {
        const username: string = req.body.username;
        if (username == null || username == undefined) {
            return res.status(200).json({
                ok: false,
                status: 400,
                message: "BAD_REQUEST_DATA",
                formErrors: {
                    username: "username is required!"
                }
            });
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
export const setTokenIdToHeader: RequestHandler = async (req, res, next) => {
    try {
        const { params: { tokenId } } = req;
        req.headers.token = tokenId;
    } catch (error) {
        console.log(error);
    }
    next();
}