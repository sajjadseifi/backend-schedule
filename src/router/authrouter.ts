import { RequestHandler, Router } from "express";
import { getFormSignUp } from "../async/file.async";
import {
    canUseEmail,
    canUseUsername,
    confirmCode,
    forgetPassword,
    login, resetPassword, signUp,
    validaitonAuthDataLogin,
    validaitonAuthDataSignUp,
    existUser,
    validResetPasswordData,
    validationAuthDataForgetPassword,
    confirmCodeValidation,
    // AuthController
} from "../controller/authController";
import { send } from "../controller/senderController";
import { setTokenIdToHeader, user_idNext, verifyToken } from "../controller/verifyController";
const router = Router();

router.post("/can-use-username", canUseUsername);

router.post("/can-use-email", canUseEmail);

router.post("/sign-up", validaitonAuthDataSignUp, canUseUsername, canUseEmail, signUp);

router.post("/login", validaitonAuthDataLogin, existUser, login);

router.post("/forget-paswword", validationAuthDataForgetPassword, user_idNext, forgetPassword);

router.post("/confirm-code", confirmCodeValidation, verifyToken, confirmCode);

router.post("/reset-password", validResetPasswordData, verifyToken, resetPassword);

router.post("/reset-password/:tokenId", validResetPasswordData, setTokenIdToHeader, verifyToken, resetPassword);

router.get("/reset-password/:tokenId", (req, res) => {
    //send form for reset password...
    console.log("sdfdsfsd");
    res.status(200).json({
        ok: true,
        message: "this sectio implimentation later..."
    });
});


const mailSenderr: RequestHandler = async (req, res) => {
    try {
        // const describtion = req.body.describtion as string;
        // if(describtion ==null || describtion ==undefined || describtion ==""){
        //     return res.status(200).json({
        //         ok: false,
        //         message: "describtion is rquired!!!"
        //     });
        // }
        let form = getFormSignUp("http://localhost:8080/XXXX");
        if (form == null) {
            return res.status(200).json({
                ok: false,
                message: "ERROR_SERVER"
            });
        }
        const response = await send({
            to: "gamemakeriranian______________________@gmail.com",
            subject: "teset",
            html: form
        });
        if (response) {
            res.status(200).json({
                ok: true,
                message: "mesage sended to gamil"
            });
        } else {
            res.status(200).json({
                ok: false,
                message: "message not sended try agane"
            });
        }
    } catch (err) {
        console.log(err);
        res.status(200).json({
            ok: false,
            message: "message not sended try agane"
        });
    }
};

router.post("/send-mail", mailSenderr);

export default router;
