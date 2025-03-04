import { Controller } from "../../src/controller";
import { RepoClientInterface } from "../../src/clients";
import {
  AuthorizationError,
  OwnerNotFound,
  RepoNotFound,
} from "../../src/exceptions";

describe("Controller", () => {
  let controller: Controller;

  const mockRepoClient = {
    repoData: {
      fullName: "facebook/react",
      description: "description",
      starsCount: 25
    }
  }

  describe("Controller.fetchGithubRepoDetails", () => {

    
    it("it should fetch repo details for a owner", async () => {
        
        
    })
    it("it should throw a not found error", async () => {
        
    })
    it("it should throw an authorization error", async () => {
        
    })
    it("it should throw an internal server error", async () => {
        
    })
});
