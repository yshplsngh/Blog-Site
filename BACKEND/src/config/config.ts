import path from 'path';
import { config as cfg } from 'dotenv';
import {z} from 'zod';


interface EnvConfig {
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    GEMINI_AI:string;
    MONGO_URI:string;
}

cfg({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = z.object({
    ACCESS_TOKEN_SECRET: z.string().min(1).refine((data: string):boolean => data.trim() !== '', { message: 'Provide access token secret'}),
    REFRESH_TOKEN_SECRET: z.string().min(1).refine((data: string):boolean => data.trim() !== '', { message: 'Provide refresh token secret'}),
    GEMINI_AI:z.string().min(1).refine((data:string):boolean => data.trim()!=='',{message:'Provide gemini ai key'}),
    MONGO_URI:z.string().min(1).refine((data:string):boolean=>data.trim()!=='',{message:'Provide mongo uri'})
});

export const validateEnv = (): EnvConfig => {
    try {
        const envVars: EnvConfig = envVarsSchema.parse(process.env);
        return {
            ACCESS_TOKEN_SECRET: envVars.ACCESS_TOKEN_SECRET,
            REFRESH_TOKEN_SECRET: envVars.REFRESH_TOKEN_SECRET,
            GEMINI_AI:envVars.GEMINI_AI,
            MONGO_URI:envVars.MONGO_URI
        };
    } catch (error:any) {
        throw new Error(error.message);
    }
};
export const config: EnvConfig = validateEnv();