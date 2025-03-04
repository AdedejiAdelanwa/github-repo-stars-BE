import dotenv from "dotenv";
dotenv.config();
export const appConfig = {
    port: process.env.PORT || 3100,
    githubToken: process.env.GITHUB_TOKEN,
    timezone: process.env.TIMEZONE,
    githubApiUrl: process.env.GITHUB_API_URL,
};
