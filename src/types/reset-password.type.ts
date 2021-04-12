import { Document } from "mongoose";

export interface IResetPassword extends Document {
    _id: string;
    user_id: string;
    resetHash: string;
    token: string;
    expireDate: Date;
}
