import request from '@octokit/request';

export default class apiCommunicator {
  static async get(url, token) {
    return request(
      'GET ' + url,
      {
        headers: { authorization: `token ${token}` },
        owner: process.env.REACT_APP_REPO_OWNER,
        repo: process.env.REACT_APP_REPO_NAME,
      },
    );
  }

  static async post(url, token, data, success) {
    const request = require('@octokit/request');
    const owner = process.env.REACT_APP_REPO_OWNER;
    const repo = process.env.REACT_APP_REPO_NAME;
    const headers = { authorization: `token ${token}` };

    success(await request(
      'POST ' + url,
      { headers, owner, repo, data },
    ));
  }
}
