import { AuthorizationError, OwnerNotFound, RepoNotFound } from "../exceptions";
export class OctokitClient {
    client;
    constructor(client) {
        this.client = client;
    }
    async fetchGithubRepos(owner) {
        try {
            const isOrganization = await this.isOrganization(owner);
            const { data } = await (isOrganization
                ? this.client.rest.repos.listForOrg({ org: owner })
                : this.client.rest.repos.listForUser({ username: owner }));
            return data.map((repo) => ({
                description: repo.description,
                fullName: repo.full_name,
                starsCount: repo.watchers_count,
            }));
        }
        catch (error) {
            if (error instanceof Error && error.status === 404) {
                throw new OwnerNotFound("Repo owner not found");
            }
            if (error instanceof Error && error.status === 401) {
                throw new AuthorizationError("Invalid authorization token");
            }
            throw error;
        }
    }
    async fetchGithubRepoDetails(owner, repoName) {
        try {
            const { data: { description, full_name: fullName, watchers_count: starsCount }, } = await this.client.rest.repos.get({ owner, repo: repoName });
            return { description, fullName, starsCount };
        }
        catch (error) {
            if (error instanceof Error && error.status === 404) {
                throw new RepoNotFound("Repository not found");
            }
            if (error instanceof Error && error.status === 401) {
                throw new AuthorizationError("Invalid authorization token");
            }
            throw error;
        }
    }
    async isOrganization(org) {
        try {
            await this.client.rest.orgs.get({ org });
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
