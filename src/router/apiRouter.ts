import express from "express";
import schedulsRouter from "./schedulsRouter";
import authrouter from "./authrouter";
import { verifyAuthrizarion, verifyToken } from "../controller/verifyController";

const app = express();

//#region 
/*

POST /api/auth/sign-up header{} body{ username , email , password } => json{userId,token}

POST /api/auth/login header{} body{ username , password } => json{userId,token} 

POST /api/auth/outo-login header{userId,token} body{} => json{userId,token} 

POST /api/auth/forget-password header{} body{username} => json{forget-password-token} expired in 1day

POST /api/auth/confirm-code header{forget-password-token} body{} => json{confirm-code-token} expired in 1day

POST /api/auth/reset-password header{app-key} body{} => json{}

GET /api/auth/can-use-username header{app-key} body{} => json{ok}

GET /api/auth/can-use-email header{app-key} body{} => json{ok}

*/
//#endregion

app.use("/auth", authrouter);


//#region 
/*

GET /api/schedules params{} header{userId,token} body{} => all of data

GET /api/schedules/{:id} params{id} header{userId,token} body{} => all of data

POST /api/schedules params{} header{userId,token} body{ title, description, outDate, isDone, userId }=> create data

PATCH /api/schedules/{:id} params{id} header{userId,token} body{ title, description, outDate, isDone } => update Data

PATCH /api/schedules/{:id} params{id} header{userId,token} body{ isDone } => update isDone Data

DELETE /api/schedules/{:id} params{id} header{userId,token} body{}  => Delete Data

*/
//#endregion
// 
// app.use("/schedules",verifyToken,verifyAuthrizarion, schedulsRouter);
app.use("/schedules", verifyToken, schedulsRouter);

export default app;
