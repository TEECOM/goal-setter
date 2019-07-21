import request from '@octokit/request';

export default class apiCommunicator {
  static async get(url, token, params) {
    const headers = { authorization: `token ${token}` };

    return (await request(
      'GET ' + url,
      Object.assign({},
        {
          headers,
          ref: 'heads/master',
          direction: 'desc',
          state: 'all',
          type: 'all',
          per_page: 20,
        },
        params,
      )
    ))
  }

  static async post(url, token, params) {
    const { owner, repo, data } = params;
    const headers = { authorization: `token ${token}` };

    return (await request(
      'POST ' + url,
      { headers, owner, repo, data },
    ));
  }

  static async patch(url, token, params) {
    const { owner, repo, data } = params;
    const headers = { authorization: `token ${token}` };
    const ref = 'heads/master';

    return (await request(
      'PATCH ' + url,
      { headers, owner, repo, ref, data },
    ));
  }
}
