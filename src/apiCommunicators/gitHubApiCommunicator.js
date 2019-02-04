import apiCommunicator from './apiCommunicator';
import pullRequester from './pullRequester';

export default class gitHubApiCommunicator {
  static getRepos(token) {
    return apiCommunicator.get('/user/repos', token, {});
  }

  static submitForm(formData, token) {
    this.createMilestone(
      formData,
      token,
      (response) => this.createIssues(formData, token, response)
    );
  }

  static async createMilestone(formData, token, success) {
    const params = {
      data: {
        title: formData.milestone.title
      },
      owner: formData.currentRepo.owner,
      repo: formData.currentRepo.name
    }

    apiCommunicator.post(
      '/repos/:owner/:repo/milestones',
      token,
      params,
      success,
    );
  }

  static async createIssues(formData, token, response) {
    const issues = formData.issues;
    const milestoneNumber = response.data.number;
    const { owner, name } = formData.currentRepo;

    issues.forEach((issue) => {
      const params = {
        data: {
          ...issue,
          milestone: milestoneNumber
        },
        owner,
        repo: name
      }

      this.createIssue(params, token);
    });

    new pullRequester({ ...formData, owner, name }, token).openPullRequest();
  }

  static async createIssue(params, token) {
    apiCommunicator.post(
      '/repos/:owner/:repo/issues',
      token,
      params,
      () => {},
    );
  }

  static async getMilestonesAndIssues(token, params) {
    const milestones = apiCommunicator.get(
      '/repos/:owner/:repo/milestones',
      token,
      params,
    )
    const issues = apiCommunicator.get(
      '/repos/:owner/:repo/issues',
      token,
      params,
    )

    milestones.then(issues)
    return Promise.all([milestones, issues]).then(([milestones, issues]) => {
      return { milestones: milestones.data, issues: issues.data }
    })
  }
}
