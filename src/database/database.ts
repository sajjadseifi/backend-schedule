import mongoose from "mongoose";

let connection : mongoose.Connection;

const uri = 'mongodb://localhost:27017/SchedulesDb';
const options = { useNewUrlParser: true, useUnifiedTopology: true };

export const connect = async () => {

    if (connection) {
        console.log("database connected.");

        return;
    }
    
    try {
        mongoose.set("useFindAndModify", false);
        
        await mongoose.connect(uri, options);

        console.log("database connected");

    } catch (error) {
        console.log("database connected failed",error);
    }
};
export const disconnect = async () => {

    if (!connection) {
        console.log("database disconnect");

        return;
    }

    try {
        await mongoose.disconnect();

        console.log("database disconnected");

    } catch (error) {
        console.log("database disconnect failed", error);
    }

};
