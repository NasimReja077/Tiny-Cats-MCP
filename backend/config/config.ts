import dotenv from "dotenv";

dotenv.config();

const env = process.env;

if (!process.env.MONGODB_URI) {
     throw new Error("MONGODB_URI is not defined in environment variables");
}

// if (!process.env.IMAGEKIT_PRIVATE_KEY){
//      throw new Error("IMAGEKIT_PRIVATE_KEY is not defined in environment variables")
// }


export const config = {
     MONGODB_URI: process.env.MONGODB_URI,
    //  JWT_SECRET: process.env.JWT_SECRET,
    //  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    //  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    //  NODE_ENV: process.env.NODE_ENV || "development",
    
};