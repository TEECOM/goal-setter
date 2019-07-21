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
      docFilename: '2112-q1',
      docText: '',
      milestoneNumber: 1,
      issueNumber: 1,
      errors: [],
      success: false,
      prevRepoSelectorPageLink: null,
      nextRepoSelectorPageLink: null
    };
  }

  componentDidMount() {
    this.getRepos();
  }

  getRepos(url = null) {
    gitHubApiCommunicator.getRepos(this.props.token, url)
      .then(repoData => this.setRepos(repoData))
      .then(repo => this.getMilestonesAndIssues(repo))
      .then(response => this.setMilestoneAndIssueNumbers(response))
  }

  setRepos(repoData) {
    this.setPagination(repoData);

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

  setPagination(repoData) {
    const links = repoData.headers.link.split(",")
    const result = {prev: null, next: null}

    links.map((link) => {
      const key = JSON.parse(link.match(/".*"/g)[0])
      const value = link.match(/[^\s<>]+/)[0]
      result[key] = value
    });

    this.setState({
      prevRepoSelectorPageLink: result.prev,
      nextRepoSelectorPageLink: result.next
    });
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

  renderResult = () => {
    if (this.state.success) {
      return (<p className="success">Success!</p>)
    } else if (this.state.errors.length > 0) {
      return this.state.errors.map((error, index) => {
        return (<p key={index} className="error">{error}</p>)
      });
    }

    return null;
  }

  handleChangeRepo = (event) => {
    this.setState({
      currentRepo: this.state.repos[event.target.getAttribute("value")]
    }, this.updateMilestoneAndIssue)
  }

  atBeginningOfRepoSelector = () => {
    return this.state.prevRepoSelectorPageLink == null
  }

  atEndOfRepoSelector = () => {
    return this.state.nextRepoSelectorPageLink == null
  }

  pageRepoSelectorNext = () => {
    if (this.state.nextRepoSelectorPageLink) {
      this.getRepos(this.state.nextRepoSelectorPageLink);
    }
  }

  pageRepoSelectorPrev = () => {
    if (this.state.prevRepoSelectorPageLink) {
      this.getRepos(this.state.prevRepoSelectorPageLink);
    }
  }

  updateMilestoneAndIssue = () => {
    this.getMilestonesAndIssues(this.state.currentRepo)
      .then(response => this.setMilestoneAndIssueNumbers(response))
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
    gitHubApiCommunicator.submitForm(
      this.state,
      this.props.token,
    ).then(response => this.setResult(response))

    this.setState({
      milestone: {
        title: '',
      },
      issues: [
        { title: '', body: '' },
      ],
      docFilename: '2112-q1',
      docText: '',
    });
    event.preventDefault();
  }

  setResult = (responses) => {
    responses.map((response) => {
      if (response.errors) {
        const errors = response.errors.map((error) => {
          if (error.code === "missing_field") {
            return (`${error.resource} is missing ${error.field}`)
          } else {
            return "There was a problem!"
          }
        });

        this.setState({ errors });
      } else {
        this.setState({ success: true });
      }

      return null;
    });
  }

  updateDoc = (event) => {
    const result = docUpdater.update(this.state, event, this.props.token)

    this.setState({docText: result});
  }

  updateDocFilename = (event) => {
    this.setState({docFilename: event.target.value});
  }

  updateDocDirectly = (event) => {
    this.setState({docText: event.target.value});
  }

  render() {
    return (
      <div>
        <RepoSelector
          repoNames={this.buildRepoNames()}
          handleChange={this.handleChangeRepo}
          currentRepo={this.state.currentRepo}
          atBeginning={this.atBeginningOfRepoSelector()}
          atEnd={this.atEndOfRepoSelector()}
          prev={this.pageRepoSelectorPrev}
          next={this.pageRepoSelectorNext} />
        <form onSubmit={this.handleSubmit}>
          <MilestoneField
            value={this.state.milestone.title}
            handleChange={this.handleChangeMilestoneTitle} />
          { this.renderIssueFields() }
          <section className="row">
            <button className="plus button" type="button" onClick={this.addIssue}>+</button>
          </section>
          <DocField
            filename={this.state.docFilename}
            text={this.state.docText}
            repoName={this.state.currentRepo.name}
            updateFilename={this.updateDocFilename}
            updateTextDirectly={this.updateDocDirectly} />
          <section>
            { this.renderResult() }
            <input className="button" type="submit" value="Submit" />
          </section>
        </form>
      </div>
    );
  }
}

export default GoalsForm;
