import apiCommunicator from './apiCommunicator';

export default class pullRequester {
  constructor(formData, token) {
    const { milestone, issues, docText, owner, name, currentRepo } = formData;
    this.baseUrl = '/repos/:owner/:repo';
    this.issues = issues;
    this.milestone = milestone.title;
    this.formattedMilestone = this.milestone.replace(/\s+/g, '-').toLowerCase();
    this.token = token;
    this.docText = docText;
    this.owner = owner;
    this.repoName = name;
    this.baseBranch = currentRepo.baseBranch;
  }

  openPullRequest() {
    const params = {
      owner: this.owner,
      repo: this.repoName
    }

    apiCommunicator.get(this.baseUrl + '/git/refs/:ref', this.token, params)
      .then(response => this.createReference(response))
  }

  createReference(response) {
    const masterSha = response.data.object.sha;
    const params = {
      owner: this.owner,
      repo: this.repoName,
      data: {
        sha: masterSha,
        ref: `refs/heads/${this.formattedMilestone}`,
      }
    }

    apiCommunicator.post(
      this.baseUrl + '/git/refs',
      this.token,
      params,
    ).then(response => this.getReferenceTree(response));
  }

  getReferenceTree(response) {
    const params = {
      owner: this.owner,
      repo: this.repoName
    }

    const url = response.data.object.url;

    apiCommunicator.get(url, this.token, params)
      .then(response => this.postDocument(response));
  }
      
  postDocument(response) {
    const params = {
      owner: this.owner,
      repo: this.repoName,
      data: { content: this.docText }
    }

    const documentResponse = response.data;

    apiCommunicator.post(
      this.baseUrl + '/git/blobs',
      this.token,
      params,
    ).then(
      response => this.getNewTree(response, documentResponse)
    )
  }
      
  getNewTree(response, { sha, tree }) {
    const params = {
      owner: this.owner,
      repo: this.repoName
    }
    const newSha = response.data.sha;

    apiCommunicator.get(tree.url, this.token, params)
      .then(() => this.postNewSha(sha, newSha))
  }

  postNewSha(parentSha, newSha) {
    const params = {
      owner: this.owner,
      repo: this.repoName,
      data: {
        "base_tree": parentSha,
        "tree": [
          {
            "path": `docs/goals/${this.formattedMilestone}.md`,
            "mode": "100644",
            "type": "blob",
            "sha": newSha,
          }
        ]
      }
    }

    apiCommunicator.post(
      this.baseUrl + '/git/trees',
      this.token,
      params,
    ).then(
      response => this.postCommit(response, parentSha)
    )
  }
      
  postCommit(response, parentSha) {
    const treeSha = response.data.sha
    const params = {
      owner: this.owner,
      repo: this.repoName,
      data: {
        message: this.formattedMilestone,
        tree: treeSha,
        parents: [parentSha],
      }
    }

    apiCommunicator.post(
      this.baseUrl + '/git/commits',
      this.token,
      params,
    ).then(response => this.reassignHead(response))
  }

  reassignHead(response) {
    const newSha = response.data.sha;
    const params = {
      owner: this.owner,
      repo: this.repoName,
      data: { sha: newSha }
    }

    apiCommunicator.patch(
      this.baseUrl + '/git/refs/heads/' + this.formattedMilestone,
      this.token,
      params,
    ).then(response => this.actuallyOpenPullRequest(response))
  }

  actuallyOpenPullRequest(response) {
    const params = {
      owner: this.owner,
      repo: this.repoName,
      data: {
        title: this.milestone,
        head: this.formattedMilestone,
        base: this.baseBranch,
      }
    }

    apiCommunicator.post(
      this.baseUrl + '/pulls',
      this.token,
      params,
    );
  }
}
