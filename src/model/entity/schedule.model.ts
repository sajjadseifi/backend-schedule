import { ISchedule } from "../../types/schedules.type";
import { model, Schema } from "mongoose";

const scheduleSchema = new Schema({
    user_id: {
         type:String,
        required: [true,"user_id is required field"]
    },
    title:{
        type: String,
        required: [true,"title is required field"]
    },
    description:{
        type: String,
        required: [true,"description is required field"]
    },
    status:{
        type: Boolean,
        required: [true,"status is required field"],
        default:false,
    },
    outDate:{
        type: Date,
        required: [true,"outDate is required field"],
    },
    createdAt:{
        type:Date,
        default:new Date(),
    },
    lastUpdatedAt:{
        type:Date,
        default:new Date(),
    },
});

export default model<ISchedule>("schedule",scheduleSchema);