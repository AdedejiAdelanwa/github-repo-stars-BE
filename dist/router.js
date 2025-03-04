import { Router } from "express";
import { Controller } from "./controller";
import { OctokitClient } from "./clients";
import { appConfig } from "./configs";
import { Octokit } from "@octokit/rest";
const router = Router();
const octokit = new Octokit({
    auth: appConfig.githubToken,
    timeZone: appConfig.timezone,
    baseUrl: appConfig.githubApiUrl,
    log: {
        debug: console.debug,
        info: console.info,
        warn: console.warn,
        error: console.error,
    },
    request: {
        agent: undefined,
        timeout: 0,
    },
});
const controller = new Controller(new OctokitClient(octokit));
router.get("/github/repos/:owner", controller.fetchGithubRepos);
router.get("/github/repos/:owner/:repoName", controller.fetchGithubRepoDetails);
export default router;
