import { Router } from "express";
import { Controller } from "../controller";
import { OctokitClient } from "../clients";
import { appConfig } from "../configs";
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

/**
 * @swagger
 * /github/repos/{owner}:
 *   get:
 *     summary: Get github repos for a user.
 *     description: Get github repos details for a user.
 *     parameters:
 *       - in: path
 *         name: owner
 *         schema:
 *           type: string
 *         required: true
 *         description: repo owner
 *     responses:
 *       '200':
 *         description: A successful response
 *       '404':
 *         description: Employee not found
 *       '500':
 *         description: Internal server error
 */

router.get("/github/repos/:owner", controller.fetchGithubRepos);

/**
 * @swagger
 * /github/repos/{owner}/{repoName}:
 *  get:
 *    summary: Get github repo details.
 *    description: Get github repo details.
 *    parameters:
 *      - in: path
 *        name: owner
 *        description: owner name
 *
 *        schema:
 *          type: string
 *        required: true
 *      - in: path
 *        name: repoName
 *        description: Name of repo
 *
 *        schema:
 *          type: string
 *        required: true
 *    responses:
 *      '200':
 *        description: A successful response
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  description:
 *                    type: string
 *                    description: description of the repo
 *                    example: this is a test repo
 *                  fullName:
 *                    type: string
 *                    description: name of the repo
 *                    example: react
 *                  starsCount:
 *                    type: integer
 *                    description: the number of stars on the repo
 *                    example: 20
 *      '404':
 *        description: Employee not found
 *      '500':
 *        description: Internal server error
 *
 */
router.get("/github/repos/:owner/:repoName", controller.fetchGithubRepoDetails);

export default router;
