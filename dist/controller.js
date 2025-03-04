import { AuthorizationError, OwnerNotFound, RepoNotFound } from "./exceptions";
export class Controller {
    repoClient;
    constructor(repoClient) {
        this.repoClient = repoClient;
        this.fetchGithubRepoDetails = this.fetchGithubRepoDetails.bind(this);
        this.fetchGithubRepos = this.fetchGithubRepos.bind(this);
    }
    async fetchGithubRepoDetails(req, res) {
        try {
            const { owner, repoName } = req.params;
            const repoData = await this.repoClient.fetchGithubRepoDetails(owner, repoName);
            res.status(200).json(repoData);
        }
        catch (error) {
            if (error instanceof RepoNotFound) {
                res.status(404).json({ message: error.message });
            }
            else if (error instanceof AuthorizationError) {
                res.status(401).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }
    async fetchGithubRepos(req, res) {
        try {
            const { owner } = req.params;
            const repoData = await this.repoClient.fetchGithubRepos(owner);
            res.status(200).json(repoData);
        }
        catch (error) {
            if (error instanceof OwnerNotFound) {
                res.status(404).json({ message: error.message });
            }
            else if (error instanceof AuthorizationError) {
                res.status(401).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }
}
