import { whitelist } from "./allowedOrigin";

type InCallback = (error: Error | null, origin?: boolean) => void;

interface CorsOptions {
    origin: (origin: string | undefined, callback: InCallback) => void;
    optionsSuccessStatus:number
}

const corsOptions: CorsOptions = {
    origin: function (origin: string | undefined, callback: InCallback): void {
            if (!origin || whitelist.indexOf(origin) !== -1){
                callback(null, true);
            }
         else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
};

export { corsOptions };
