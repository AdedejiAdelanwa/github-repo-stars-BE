// @ts-nocheck
import { OctokitClient } from "../../../src/clients/octokit.client";
import {
  AuthorizationError,
  OwnerNotFound,
  RepoNotFound,
} from "../../../src/exceptions";

describe("OctokitClient", () => {
  let octokitClient: OctokitClient;
  const mockOctokit = {
    rest: {
      repos: {
        list: jest.fn(),
        listForOrg: jest.fn(),
        listForUser: jest.fn(),
        get: jest.fn(),
      },
      orgs: {
        get: jest.fn(),
      },
    },
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("OctokitClient.fetchGithubRepos", () => {
    it("should fetch Github repos for an organization", async () => {
      mockOctokit.rest.orgs.get.mockResolvedValueOnce({});
      mockOctokit.rest.repos.listForOrg.mockResolvedValueOnce({
        data: [
          {
            description: "description",
            full_name: "octokit/repoOne.git",
            watchers_count: 10,
          },
        ],
      });

      octokitClient = new OctokitClient(mockOctokit);

      const result = await octokitClient.fetchGithubRepos("octokit");

      expect(mockOctokit.rest.repos.listForOrg).toHaveBeenCalledWith({
        org: "octokit",
      });
      expect(result).toEqual([
        {
          description: "description",
          fullName: "octokit/repoOne.git",
          starsCount: 10,
        },
      ]);
    });

    it("should fetch Github repos for a user", async () => {
      mockOctokit.rest.orgs.get.mockRejectedValueOnce(new Error());
      mockOctokit.rest.repos.listForUser.mockResolvedValueOnce({
        data: [
          {
            description: "description",
            full_name: "deji/repoOne.git",
            watchers_count: 15,
          },
        ],
      });

      octokitClient = new OctokitClient(mockOctokit);

      const result = await octokitClient.fetchGithubRepos("deji");

      expect(mockOctokit.rest.repos.listForUser).toHaveBeenCalledWith({
        username: "deji",
      });
      expect(result).toEqual([
        {
          description: "description",
          fullName: "deji/repoOne.git",
          starsCount: 15,
        },
      ]);
    });

    it("should throw a not found error", async () => {
      mockOctokit.rest.orgs.get.mockResolvedValueOnce({});
      const error = new Error();
      error.status = 404;
      mockOctokit.rest.repos.listForOrg.mockRejectedValueOnce(error);

      octokitClient = new OctokitClient(mockOctokit);

      try {
        await octokitClient.fetchGithubRepos("octokit");
      } catch (error) {
        expect(error).toBeInstanceOf(OwnerNotFound);
      }

      expect(mockOctokit.rest.repos.listForOrg).toHaveBeenCalledWith({
        org: "octokit",
      });
    });

    it("should throw authorization error", async () => {
      mockOctokit.rest.orgs.get.mockResolvedValueOnce({});
      const error = new Error();
      error.status = 401;
      mockOctokit.rest.repos.listForOrg.mockRejectedValueOnce(error);

      octokitClient = new OctokitClient(mockOctokit);

      try {
        await octokitClient.fetchGithubRepos("octokit");
      } catch (error) {
        expect(error).toBeInstanceOf(AuthorizationError);
      }

      expect(mockOctokit.rest.repos.listForOrg).toHaveBeenCalledWith({
        org: "octokit",
      });
    });
  });

  describe("OctokitClient.fetchGithubRepoDetails", () => {
    it("should fetch Github repo", async () => {
      mockOctokit.rest.repos.get.mockResolvedValueOnce({
        data: {
          description: "description",
          full_name: "octokit/repoOne.git",
          watchers_count: 10,
        },
      });

      octokitClient = new OctokitClient(mockOctokit);

      const result = await octokitClient.fetchGithubRepoDetails(
        "octokit",
        "repoOne"
      );

      expect(mockOctokit.rest.repos.get).toHaveBeenCalledWith({
        owner: "octokit",
        repo: "repoOne",
      });
      expect(result).toEqual({
        description: "description",
        fullName: "octokit/repoOne.git",
        starsCount: 10,
      });
    });

    it("should throw a not found error", async () => {
      const error = new Error();
      error.status = 404;
      mockOctokit.rest.repos.get.mockRejectedValueOnce(error);

      octokitClient = new OctokitClient(mockOctokit);

      try {
        await octokitClient.fetchGithubRepoDetails("octokit", "repoOne");
      } catch (error) {
        expect(error).toBeInstanceOf(RepoNotFound);
      }

      expect(mockOctokit.rest.repos.get).toHaveBeenCalledWith({
        owner: "octokit",
        repo: "repoOne",
      });
    });

    it("should throw authorization error", async () => {
      const error = new Error();
      error.status = 401;
      mockOctokit.rest.repos.get.mockRejectedValueOnce(error);

      octokitClient = new OctokitClient(mockOctokit);

      try {
        await octokitClient.fetchGithubRepoDetails("octokit", "repoOne");
      } catch (error) {
        expect(error).toBeInstanceOf(AuthorizationError);
      }

      expect(mockOctokit.rest.repos.get).toHaveBeenCalledWith({
        owner: "octokit",
        repo: "repoOne",
      });
    });
  });
});
