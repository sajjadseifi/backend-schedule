import { Document } from "mongoose";
export enum UserType {
    ORGIANT_ADMIN = "ORGIANT_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER"
}
export interface IUser extends Document {
    //required

    _id: string;
    username: string;
    normalizeUsername: string;
    email: string;
    normalizeEmail: string;
    password: string;
    userType: UserType;
    //allows null
    firstName?: string;
    lastName?: string;
    age?: string;
    question?: string;
    awnser?: string;
    userToken?: string;
    confiemCodeToken?: string;

    //verification block
    isLock: boolean;
    countTryLogin: number;
    triedFaild: number;
    blocked: boolean;
    releaseTime: Date;

} 