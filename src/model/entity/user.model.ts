import { model, Schema } from "mongoose";
import { IUser, UserType } from "../../types/user.type";

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "username is required filed"]
    },
    normalizeUsername: {
        type: String,
        required: [true, "normalizeUsername is required filed"]
    },
    email: {
        type: String,
        required: [true, "email is required filed"]
    },
    normalizeEmail: {
        type: String,
        required: [true, "normalizeEmail is required filed"]
    },
    password: {
        type: String,
        required: [true, "password is required filed"]
    },
    userType: {
        type: String,
        required: [true, "password is required filed"],
        default: UserType.USER,
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    age: {
        type: String
    },
    question: {
        type: String
    },
    awnser: {
        type: String
    },
    isLock: {
        type: Boolean,
        default: true,
    },
    blocked: {
        type: Boolean,
        default: false,
    },
    countTryLogin: {
        type: Number,
        default: 5,
    },
    triedFaild: {
        type: Number,
        default: 0
    },
    releaseTime: {
        type: Date,
    },
    userToken: {
        type: String,
        default: null,
    },
});

export default model<IUser>("user", userSchema);
