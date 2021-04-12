export interface IMail {
    from: string;
    to: string;
    subject: string;
    html?: string;
    text?: string;
};
export interface IMailHTML {
    to: string,
    subject: string,
    html: string
};
export interface IMailTXT {
    to: string,
    subject: string,
    text: string,
};