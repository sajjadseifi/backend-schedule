import { Document } from "mongoose";

export interface ISchedule extends Document {
    _id: string;
    user_id: string;
    title: string;
    description: string;
    status: boolean;
    createdAt?: Date;
    outDate: Date;
}


export interface IScheduleDto {
    _id: string;
    title: string;
    description: string;
    status: boolean;
    outDate: Date;
}

