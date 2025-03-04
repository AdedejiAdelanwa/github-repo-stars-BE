import { Request, Response } from "express";
import { RepoClientInterface } from "./clients";
import { AuthorizationError, OwnerNotFound, RepoNotFound } from "./exceptions";

export class Controller {
  constructor(private repoClient: RepoClientInterface) {
    this.fetchGithubRepoDetails = this.fetchGithubRepoDetails.bind(this);
    this.fetchGithubRepos = this.fetchGithubRepos.bind(this);
  }

  async fetchGithubRepoDetails(
    req: Request<{ owner: string; repoName: string }>,
    res: Response
  ) {
    try {
      const { owner, repoName } = req.params;
      const repoData = await this.repoClient.fetchGithubRepoDetails(
        owner,
        repoName
      );
      res.status(200).json(repoData);
    } catch (error) {
      if (error instanceof RepoNotFound) {
        res.status(404).json({ message: error.message });
      } else if (error instanceof AuthorizationError) {
        res.status(401).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  async fetchGithubRepos(req: Request<{ owner: string }>, res: Response) {
    try {
      const { owner } = req.params;
      const repoData = await this.repoClient.fetchGithubRepos(owner);
      res.status(200).json(repoData);
    } catch (error) {
      if (error instanceof OwnerNotFound) {
        res.status(404).json({ message: error.message });
      } else if (error instanceof AuthorizationError) {
        res.status(401).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }
}
