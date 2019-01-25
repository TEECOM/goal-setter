import apiCommunicator from './apiCommunicator';

export default class pullRequester {
  constructor({ milestone, issues, docText }, token) {
    this.baseUrl = '/repos/:owner/:repo';
    this.issues = issues;
    this.milestone = milestone.title;
    this.formattedMilestone = this.milestone.replace(/\s+/g, '-').toLowerCase();
    this.token = token;
    this.docText = docText;
  }

  openPullRequest() {
    apiCommunicator.get(
      this.baseUrl + '/git/refs/:ref',
      this.token,
      (response) => this.createReference(response)
    );
  }

  createReference(response) {
    const masterSha = response.data.object.sha;
    const data = {
      sha: masterSha,
      ref: `refs/heads/${this.formattedMilestone}`,
    };

    apiCommunicator.post(
      this.baseUrl + '/git/refs',
      this.token,
      data,
      (response) =>  this.getReferenceTree(response)
    );
  }
      
  getReferenceTree(response) {
    const url = response.data.object.url;

    apiCommunicator.get(
      url,
      this.token,
      (response) => this.postDocument(response)
    );
  }
      
  postDocument(response) {
    const documentResponse = response.data;
    const data = { content: this.docText };

    apiCommunicator.post(
      this.baseUrl + '/git/blobs',
      this.token,
      data,
      (response) => this.getNewTree(response, documentResponse)
    );
  }
      
  getNewTree(response, { sha, tree }) {
    const newSha = response.data.sha;

    apiCommunicator.get(
      tree.url,
      this.token,
      () => this.postNewSha(sha, newSha),
    );
  }

  postNewSha(parentSha, newSha) {
    const data = {
      "base_tree": parentSha,
      "tree": [
        {
          "path": `docs/goals/${this.formattedMilestone}.md`,
          "mode": "100644",
          "type": "blob",
          "sha": newSha,
        }
      ]
    };

    apiCommunicator.post(
      this.baseUrl + '/git/trees',
      this.token,
      data,
      (response) => this.postCommit(response, parentSha),
    );
  }
      
  postCommit(response, parentSha) {
    const treeSha = response.data.sha
    const data = {
      message: this.formattedMilestone,
      tree: treeSha,
      parents: [parentSha],
    }

    apiCommunicator.post(
      this.baseUrl + '/git/commits',
      this.token,
      data,
      (response) => this.reassignHead(response),
    );
  }

  reassignHead(response) {
    const newSha = response.data.sha;
    const data = { sha: newSha }

    apiCommunicator.patch(
      this.baseUrl + '/git/refs/heads/' + this.formattedMilestone,
      this.token,
      data,
      (response) => this.actuallyOpenPullRequest(response),
    );
  }

  actuallyOpenPullRequest(response) {
    const data = {
      title: this.milestone,
      head: this.formattedMilestone,
      base: 'master',
    }

    apiCommunicator.post(
      this.baseUrl + '/pulls',
      this.token,
      data,
      () => {}
    );
  }
}
