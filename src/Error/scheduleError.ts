import { Response } from "express";
import * as messaeActiona from "../actions/messaeActiona";
import * as statusActions from "../actions/statusActions";

export const BadRequest = (res: Response) => {
    return res.status(statusActions.BAD_REQUEST.Code).json({
        ok: false,
        error: messaeActiona.BAD_REQUEST,
        message: "This Schedule Is Note Found!!!",
    });
};

