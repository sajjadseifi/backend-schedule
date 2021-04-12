import { Document } from "mongoose";

export interface IConfrirmCode extends Document {
    _id: string;
    user_id: string;
    token: string;
    code: string;
}
