export type Repo = {
  fullName: string;
  description: string | null;
  starsCount: number | undefined;
};

export abstract class RepoClientInterface {
  abstract fetchGithubRepoDetails(
    owner: string,
    repoName: string
  ): Promise<Repo>;

  abstract fetchGithubRepos(owner: string): Promise<Repo[]>;
}
