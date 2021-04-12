import nodemailer from "nodemailer";
import { getFormCofirmCode, getFormResetPassword, getFormResetSuccess, getFormSignUp } from "../async/file.async";
import { IMailHTML, IMailTXT } from "../types/mail.type";
import * as actionSender from "../actions/sender.action";

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 's.09334497255@gmail.com',
        pass: 'ejmvpsspfarbyfhh'
    }
});

// var mailOptions = {
//     from: 's.09334497255@gmail.com',
//     to: 'myfriend@yahoo.com',
//     subject: 'Sending Email using Node.js',
//     text: 'That was easy!'
// };


export const send = async (mailOptions: IMailHTML | IMailTXT) => {
    try {
        const mailOpt = {
            from: "s.09334497255@gmail.com",
            ...mailOptions
        };
        const response = await transporter.sendMail(mailOpt);
        console.log(response);
    } catch (error) {
        return false;
    }
    return true;

}
export const sendForm = async (to: string, form: string | undefined) => {
    try {

        if (form == null || form == undefined)
            return actionSender.EMAIL_SENDED;

        const response = await send({
            to: to,
            subject: "Schedule Nit",
            html: form
        });
        if (response) {
            return actionSender.EMAIL_SENDED;
        }
        return actionSender.EMAIL_NOT_SEND;

    } catch (err) {
        return actionSender.EMAIL_ERROR;
    }
};

export const sendSignUpVerification = async (to: string, url: string) => {
    let form = getFormSignUp(url);

    return await sendForm(to, form);

};

export const sendConfirmCode = async (to: string, code: string) => {
    let form = getFormCofirmCode(code);

    return await sendForm(to, form);
};
export const sendResetPassword = async (to: string, url: string) => {
    let form = getFormResetPassword(url);

    return await sendForm(to, form);
};
export const sendPasswordSuccess = async (to: string,username: string) => {
    let form = getFormResetSuccess(username) || "";

    return await sendForm(to, form);
};