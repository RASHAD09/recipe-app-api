import "dotenv/config";


export const ENV={
    PORT: process.env.PORT || 3000,
    DATABASE_URL: process.env.DATABASE_URL || "mongodb://localhost:27017/mydatabase",
    NODE_ENV: process.env.NODE_ENV || "development",
}