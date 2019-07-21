import apiCommunicator from './apiCommunicator';
import pullRequester from './pullRequester';

export default class gitHubApiCommunicator {
  static getRepos(token, url) {
    if (url) {
      return apiCommunicator.get(url, token)
    } else {
      return apiCommunicator.get('/user/repos', token, {});
    }
  }

  static submitForm(formData, token) {
    const { owner, name } = formData.currentRepo;

    return this.createMilestone(
      formData,
      token
    ).then(
      response => this.createIssues(formData, token, response)
    ).then(
      new pullRequester({ ...formData, owner, name }, token).openPullRequest()
    ).catch(
      err => [err]
    );
  }

  static async createMilestone(formData, token) {
    const params = {
      data: {
        title: formData.milestone.title
      },
      owner: formData.currentRepo.owner,
      repo: formData.currentRepo.name
    }

    return apiCommunicator.post(
      '/repos/:owner/:repo/milestones',
      token,
      params,
    );
  }

  static async createIssues(formData, token, response) {
    const issues = formData.issues;
    const milestoneNumber = response.data.number;
    const { owner, name } = formData.currentRepo;

    const promises = issues.map((issue) => {
      const params = {
        data: {
          ...issue,
          milestone: milestoneNumber
        },
        owner,
        repo: name
      }

      return this.createIssue(params, token);
    });

    return Promise.all(promises).then(
      values => values
    ).catch(err => [err])
  }

  static async createIssue(params, token) {
    return apiCommunicator.post(
      '/repos/:owner/:repo/issues',
      token,
      params,
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
