import fs from "fs";
let signUpForm: string | null = null;
let confirmCodeForm: string | null = null;
let resetPasswordForm: string | null = null;
let resetSuccesForm: string | null = null;
const TOKNE_URL_SIGNUP_VERIFY = "TOKNE_URL_SIGNUP_VERIFY";
const CODE_VERIFI_CATION_RESET_PASSWORD = "CODE_VERIFI_CATION_RESET_PASSWORD";
const RESET_PASSWORD_URL_TOKEN = "RESET_PASSWORD_URL_TOKEN";
const USER_NAME="USER_NAME";
const formAysnc = async (path: string) => {
    try {
        let data = await fs.readFileSync(path, 'utf8');
        data = data.replace(" ", "");
        return data;
    } catch (error) {
        return "";
    }
};
const start = async () => {
    try {
        signUpForm = await formAysnc("src/static/password-reset-success.html");
        confirmCodeForm = await formAysnc("src/static/confirm-code-reset-password.html");
        resetPasswordForm = await formAysnc("src/static/reset-password-mail.static.html");
        resetSuccesForm = await formAysnc("src/static/password-reset-success.html");
    } catch (err) {
        console.error(err);
    }
};
start();

export const getFormSignUp = (url: string) => {
    let form = signUpForm;
    return form?.replace(TOKNE_URL_SIGNUP_VERIFY, url);
};

export const getFormCofirmCode = (code: string) => {
    let form = confirmCodeForm;
    return form?.replace(CODE_VERIFI_CATION_RESET_PASSWORD, code);
};

export const getFormResetPassword = (url: string) => {
    let form = resetPasswordForm;
    return form?.replace(RESET_PASSWORD_URL_TOKEN, url);
};

export const getFormResetSuccess = (username:string) =>{
    let form = resetSuccesForm;
    return form?.replace(USER_NAME, username);
} 