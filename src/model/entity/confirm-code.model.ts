import { model, Schema } from "mongoose";
import { IConfrirmCode } from "../../types/confirm-code.type";

const confirmCodeSchema = new Schema({
    user_id: {
        type: String,
        required: [true, "user_id is required"]
    },
    token: {
        type: String,
        required: [true, "user_id is required"]
    },
    code: {
        type: String,
        required: [true, "user_id is required"]
    },

});


export default model<IConfrirmCode>("confirm_code", confirmCodeSchema);
