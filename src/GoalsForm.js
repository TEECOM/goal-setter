import React, { Component } from 'react';
import MilestoneField from './MilestoneField';
import IssueField from './IssueField';

import GitHubApiCommunicator from './apiCommunicators/GitHubApiCommunicator';

class GoalsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      milestone: {
        title: ''
      },
      issues: [
        { title: '', body: '' },
      ],
    };
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

  handleChangeMilestoneTitle = (event) => {
    const milestone = {...this.state.milestone};
    milestone.title = event.target.value;
    this.setState({milestone});
  }

  handleChangeIssueTitle = (index, event) => {
    const issues = this.state.issues;
    const issue = this.state.issues[index];
    issue.title = event.target.value;
    issues[index] = issue
    this.setState({issues});
  }

  handleChangeIssueBody = (index, event) => {
    const issues = this.state.issues;
    const issue = this.state.issues[index];
    issue.body = event.target.value;
    issues[index] = issue
    this.setState({issues});
  }

  addIssue = () => {
    const issues = this.state.issues;
    issues.push({title: '', body: ''});
    this.setState(issues);
  }

  handleSubmit = (event) => {
    GitHubApiCommunicator.submitForm(this.state.milestone, this.state.issues, this.props.token);
    this.setState({
      milestone: {
        title: '',
      },
      issues: [
        { title: '', body: '' },
      ],
    });
    event.preventDefault();
  }

  render() {
    const owner = process.env.REACT_APP_REPO_OWNER;
    const repo = process.env.REACT_APP_REPO_NAME;
    const text = `Submit a title to open a milestone in ${owner}'s repo, ${repo}.`;

    return (
      <div>
        <p>{text}</p>
        <form onSubmit={this.handleSubmit}>
          <MilestoneField
            value={this.state.milestone.title}
            handleChange={this.handleChangeMilestoneTitle} />
          { this.renderIssueFields() }
          <section className="row">
            <button className="plus button" type="button" onClick={this.addIssue}>+</button>
            <input className="button" type="submit" value="Submit" />
          </section>
        </form>
      </div>
    );
  }
}

export default GoalsForm;
