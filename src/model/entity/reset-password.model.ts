import { model, Schema } from "mongoose";
import { IResetPassword } from "../../types/reset-password.type";

const resetPasswordSchema = new Schema({
    user_id:{
        type:String,
        required:[true,"user_id is required"]
    },
    resetHash:{
        type:String,
        required:[true,"resetHash is required"]
    },
    token:{
        type:String,
        required:[true,"token is required"]
    },
    expireDate:{
        type:Date,
        required:[true,"expireDate is required"]
    },
});

export default model<IResetPassword>("reset_password", resetPasswordSchema);