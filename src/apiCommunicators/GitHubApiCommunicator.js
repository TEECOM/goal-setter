class GitHubApiCommunicator {
  static async createMilestone(title, token) {
    const request = require('@octokit/request')
    await request('POST /repos/:owner/:repo/milestones', {
      data: {
        title: title
      },
      headers: {
        authorization: `token ${token}`
      },
      owner: process.env.REACT_APP_REPO_OWNER,
      repo: process.env.REACT_APP_REPO_NAME
    });
  }

  static async fetchMilestones(token) {
    const request = require('@octokit/request')
    return request('GET /repos/:owner/:repo/milestones', {
      headers: {
        authorization: `token ${token}`
      },
      owner: process.env.REACT_APP_REPO_OWNER,
      repo: process.env.REACT_APP_REPO_NAME
    });
  }
}

export default GitHubApiCommunicator;
