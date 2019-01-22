import apiCommunicator from './apiCommunicator';
import pullRequester from './pullRequester';

export default class gitHubApiCommunicator {
  static submitForm(formData, token) {
    const milestone = formData.milestone;

    this.createMilestone(
      milestone,
      token,
      (response) => this.createIssues(formData, token, response)
    );
  }

  static async createMilestone({ title }, token, success) {
    apiCommunicator.post(
      '/repos/:owner/:repo/milestones',
      token,
      { title: title },
      success,
    );
  }

  static async createIssues(formData, token, response) {
    const issues = formData.issues;
    const milestoneNumber = response.data.number;

    issues.forEach((issue) => {
      this.createIssue(issue, milestoneNumber, token);
    });

    new pullRequester(formData, token).openPullRequest();
  }

  static async createIssue(issue, milestoneNumber, token) {
    apiCommunicator.post(
      '/repos/:owner/:repo/issues',
      token,
      { ...issue, milestone: milestoneNumber },
      () => {},
    );
  }
}
