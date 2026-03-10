import { ISession } from "../models/sessionSchema.js";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                user: any;
                role:string;
                jti: string;
                exp?: number;
                iat?: number;
            }
        }

        interface Response {
            session?: ISession;
        }
    }
}

export {}