import React, { Component } from 'react';
import MilestoneField from './MilestoneField';
import IssueField from './IssueField';
import DocField from './DocField';
import RepoSelector from './RepoSelector';

import gitHubApiCommunicator from './apiCommunicators/gitHubApiCommunicator';
import docUpdater from './models/docUpdater';

class GoalsForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      repos: [],
      currentRepo: {
        name: '',
      },
      milestone: {
        title: '',
      },
      issues: [
        { title: '', body: '' },
      ],
      docText: '',
      milestoneNumber: 1,
      issueNumber: 1,
    };
  }

  componentDidMount() {
    this.getRepos()
      .then(repoData => this.setRepos(repoData))
      .then(repo => this.getMilestonesAndIssues(repo))
      .then(response => this.setMilestoneAndIssueNumbers(response))
  }

  getRepos() {
    return gitHubApiCommunicator.getRepos(this.props.token);
  }

  setRepos(repoData) {
    const repos = repoData.data.map((repo) => {
      return {
        name: repo.name,
        owner: repo.owner.login,
        baseBranch: repo.default_branch,
      }
    })
    const currentRepo = repos[0];

    this.setState({ repos, currentRepo });

    return currentRepo;
  }

  getMilestonesAndIssues(repo) {
    return gitHubApiCommunicator.getMilestonesAndIssues(
      this.props.token,
      { owner: repo.owner, repo: repo.name },
    )
  }

  setMilestoneAndIssueNumbers({ issues, milestones }) {
    let { milestoneNumber, issueNumber } = this.state;

    this.setState({
      milestoneNumber: docUpdater.extractNumber(milestones) || milestoneNumber,
      issueNumber: docUpdater.extractNumber(issues) || issueNumber,
    });
  }

  buildRepoNames = () => {
    return this.state.repos.map((repo) => {
      return `${repo.owner}/${repo.name}`
    });
  }

  renderIssueFields = () => {
    return this.state.issues.map((issue, index) => {
      return (
        <IssueField 
          title={issue.title}
          handleChangeTitle={(e) => this.handleChangeIssueTitle(index, e)}
          body={issue.body}
          handleChangeBody={(e) => this.handleChangeIssueBody(index, e)}
          key={index} />
      );
    });
  }

  handleChangeRepo = (event) => {
    this.setState({
      currentRepo: this.state.repos[parseInt(event.target.value)]
    })
  }

  handleChangeMilestoneTitle = (event) => {
    const milestone = {...this.state.milestone};
    milestone.title = event.target.value;
    this.setState({milestone}, this.updateDoc);
  }

  handleChangeIssueTitle = (index, event) => {
    const issues = this.state.issues;
    const issue = this.state.issues[index];
    issue.title = event.target.value;
    issues[index] = issue
    this.setState({issues}, this.updateDoc);
  }

  handleChangeIssueBody = (index, event) => {
    const issues = this.state.issues;
    const issue = this.state.issues[index];
    issue.body = event.target.value;
    issues[index] = issue
    this.setState({issues}, this.updateDoc);
  }

  addIssue = () => {
    const issues = this.state.issues;
    issues.push({title: '', body: ''});
    this.setState(issues, this.updateDoc);
  }

  handleSubmit = (event) => {
    gitHubApiCommunicator.submitForm(this.state, this.props.token);

    this.setState({
      milestone: {
        title: '',
      },
      issues: [
        { title: '', body: '' },
      ],
      docText: '',
    });
    event.preventDefault();
  }

  updateDoc = (event) => {
    const result = docUpdater.update(this.state, event, this.props.token)

    this.setState({docText: result});
  }

  updateDocDirectly = (event) => {
    this.setState({docText: event.target.value});
  }

  render() {
    return (
      <div>
        <RepoSelector
          repoNames={this.buildRepoNames()}
          handleChange={this.handleChangeRepo} />
        <form onSubmit={this.handleSubmit}>
          <MilestoneField
            value={this.state.milestone.title}
            handleChange={this.handleChangeMilestoneTitle} />
          { this.renderIssueFields() }
          <section className="row">
            <button className="plus button" type="button" onClick={this.addIssue}>+</button>
          </section>
          <DocField
            docText={this.state.docText}
            repoName={this.state.currentRepo.name}
            updateDocDirectly={this.updateDocDirectly} />
          <section>
            <input className="button" type="submit" value="Submit" />
          </section>
        </form>
      </div>
    );
  }
}

export default GoalsForm;
