import './async/file.async';
import express, { NextFunction, Request, Response } from 'express';
// import cors from 'cors';
import { json } from 'body-parser';
import apiRouter from "./router/apiRouter";
import { verifyAppKey } from './controller/verifyController';
import { connect, disconnect } from "./database/database";
import swaggerUi from "swagger-ui-express"; 

const swaggerDocument = require('../swagger.json');


const app = express();

connect();

// app.use(cors());
app.use(json());

// app.use("/api/schedules",schedulsRouter);

app.use("/api", verifyAppKey, apiRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({ message: err.message });
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = 8080 || process.env.PORT;

app.listen(port, () => {
    console.log("Server Run As Port 8080");
    console.log("You Can Listen http://localhost:8080");
});
