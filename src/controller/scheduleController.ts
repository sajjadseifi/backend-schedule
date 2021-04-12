import { Request, RequestHandler, Response } from "express";
import Schedule from "../model/entity/schedule.model";
import { ISchedule, IScheduleDto } from "../types/schedules.type";
import { isValidObjectId } from "mongoose";

export const validationBody: RequestHandler = (req, res, next) => {
    const { title, outDate } = req.body;
    let error = {};
    let isValid = true;
    if (!title && title.length == 0) {
        isValid = false;
        error = {
            ...error,
            title: "title is  reqired",
        };
    }
    if (!outDate) {
        isValid = false;
        error = {
            ...error,
            outDate: "outDate is  reqired",
        };
    }
    else if (new Date().getTime() <= new Date(outDate).getTime()) {
        isValid = false;
        error = {
            ...error,
            outDateTime: "pleas select time grater current time",
        };
    }

    if (!isValid)
        return res.status(400).json({ ok: false, error });

    next();


};

const getAllSchedulesDto = async (user_id: string): Promise<IScheduleDto[]> => {
    try {
        const allSchedules: ISchedule[] | null =
            await Schedule.find({
                user_id: user_id
            });

        const treansferd: IScheduleDto[] = allSchedules.map(s => {
            return {
                _id: s._id,
                // user_id: s.user_id,
                title: s.title,
                description: s.description,
                outDate: s.outDate,
                status: s.status,
            }
        });
        return treansferd;
    } catch (error) {
        return [];
    }
}
const getDtoSchedule = async (user_id: string): Promise<IScheduleDto[]> => {
    try {
        const allSchedules: ISchedule[] | null =
            await Schedule.find({
                user_id: user_id
            });

        const treansferd: IScheduleDto[] = allSchedules.map((it) => {
            return { ...it };
        });

        return [];
    } catch (error) {
        return [];
    }
};
export const getSchedules: RequestHandler = async (req, res) => {
    console.log(req.ip);
    const user_id = req.headers.user_id as string;
    try {

        const allSchedulesDto: IScheduleDto[] = await getAllSchedulesDto(user_id);

        res.status(200).json({
            ok: true,
            schedules: allSchedulesDto,
        });
    } catch (err) {
        res
            .status(404)
            .json({ ok: false, error: "error during get all schedules" });
    }

};
export const getSingleSchedule: RequestHandler = async (req, res) => {
    const { params: { id }, headers: { user_id } } = req;
    if (user_id == undefined || user_id instanceof Array) {
        return res.status(400).json({ ok: false, error: "bad Request" });
    }
    // if (!isValidObjectId(id)) {
    //     return res.status(400).json({ ok: false, error: "id is Not Valid" });
    // };

    try {
        const schedule: IScheduleDto | null = await Schedule.findOne({
            _id: id,
            user_id: user_id,
        });
        console.log({ schedule });
        res.status(200).json({
            ok: true,
            schedule: schedule
        });
    } catch (err) {
        console.log(err);
        res
            .status(404)
            .json({ ok: false, error: "error during get all schedules" });
    }
};
export const addSchedule: RequestHandler = async (req, res) => {
    const user_id = req.headers.user_id as string;
    const body = req.body as Pick<ISchedule, "title" | "description" | "status" | "outDate">;

    if (!isValidObjectId(user_id)) {
        // return res.status(400).json({ ok: false, error: "bad rquest!!!!" });
    }
    try {
        const user = null;//await User.find({_id:user_id});

        if (user) {
            return res.status(400).json({
                ok: false,
                error: "user is not sign up please create account",
                redirect_uri: "/auth/signup"
            });
        }

        const schedule: ISchedule = new Schedule({
            user_id: user_id,
            ...body
        });

        const newSchedule: IScheduleDto | null = await schedule.save();

        const allSchedulesDto: IScheduleDto[] = await getAllSchedulesDto(user_id);

        res.json({
            ok: true,
            message: "Add Schedule",
            schedule: newSchedule,
            schedules: allSchedulesDto
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ ok: false, error: "error during add schedules" });
    }

};
export const updateSchedule: RequestHandler = async (req, res) => {
    const { params: { id } } = req;
    const user_id = req.headers.user_id as string;
    const body = req.body as Pick<ISchedule, "title" | "description" | "status" | "outDate">;

    try {
        const updatedSchedule: IScheduleDto | null = await Schedule.findOneAndUpdate(
            { _id: id, user_id: user_id },
            {
                ...body,
                lastUpdatedAt: new Date()
            },

        );
        const allSchedulesDto: IScheduleDto[] = await getAllSchedulesDto(user_id);

        res.status(200).json({
            message: "schedule updated",
            schedule: allSchedulesDto.find(it => it._id == id),
            schedules: allSchedulesDto
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({ ok: false, error: "error during update schedules" });
    }
};
export const updateIsDoneSchedule: RequestHandler = async (req, res) => {
    try {

        const user_id = req.headers.user_id as string;
        const { id } = req.params;
        const body = req.body as Pick<ISchedule, "status">;

        const updatedSchedule: IScheduleDto | null =
            await Schedule.findOneAndUpdate({ _id: id, user_id }, body);

        if (updatedSchedule == null) {
            return res.status(400).json({
                ok: false,
                message: "update item is faild item is no exist!",
            });
        }

        const allSchedulesDto: IScheduleDto[] = await getAllSchedulesDto(user_id);

        res.status(200).json({
            ok: true,
            message: `updated [${updatedSchedule?.title}] schedules status`,
            schedule: allSchedulesDto.find(s => s._id == id),
            schedules: allSchedulesDto
        });

    } catch (error) {
        res.status(400).json({ ok: false, message: "error dulring  update status" });
        throw error;
    }

};
export const removeSchedule = async (req: Request, res: Response) => {

    try {
        const { params: { id } } = req;
        const user_id: string = req.headers.user_id as string;

        const removeSchedule: IScheduleDto | null = await Schedule.findOneAndRemove({
            _id: id,
            user_id: user_id,
        });

        if (removeSchedule == null) {
            return res.status(400).json({ ok: false, message: "this item not exist!!" });
        }
        const allSchedulesDto: IScheduleDto[] = await getAllSchedulesDto(user_id);

        res.status(200).json({
            ok: true,
            message: "schedule [ " + removeSchedule?.title + " ] deleted",
            schedule: removeSchedule,
            schedules: allSchedulesDto
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false, message: "error during delete item "
        });
    }

};
