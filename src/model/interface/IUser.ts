export interface IUser {
    _id: number;
    username: string;
    email: string;
    password: string;
    normalizeUsername?: string;
    normalizeEmail?: string;
    coutTryLogin?: number;
    blocked?: boolean;
    getJWT(): { id: Number, username: String, email: String };
};
