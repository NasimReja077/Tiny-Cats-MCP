import dotenv from "dotenv";

dotenv.config();

const requiredEnv = (name: string): string => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`${name} is not defined in environment variables`);
    }
    return value;
};

export const config = {
    MONGODB_URI: requiredEnv("MONGODB_URI"),
    CLERK_SECRET_KEY: requiredEnv("CLERK_SECRET_KEY"),
    IMAGEKIT_PRIVATE_KEY: requiredEnv("IMAGEKIT_PRIVATE_KEY"),
};