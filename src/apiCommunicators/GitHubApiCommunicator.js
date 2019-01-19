import apiCommunicator from './apiCommunicator';

export default class GitHubApiCommunicator {
  static async submitForm(milestone, issue, token) {
    this.createMilestone(milestone, token, (response) => {
      const milestoneNumber = response.data.number;

      this.createIssue(issue, milestoneNumber, token, () => {});
    });
  }

  static async createMilestone(milestone, token, success) {
    apiCommunicator.post(
      '/repos/:owner/:repo/milestones',
      token,
      milestone,
      success,
    );
  }

  static async createIssue(issue, milestoneNumber, token, success) {
    const data = { ...issue, milestone: milestoneNumber };

    apiCommunicator.post(
      '/repos/:owner/:repo/issues',
      token,
      data,
      success
    );
  }

  static async fetchMilestones(token) {
    const url = '/repos/:owner/:repo/milestones';

    return apiCommunicator.get(url, token);
  }
}
