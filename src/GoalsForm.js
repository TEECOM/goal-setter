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
      issue: {
        title: '',
        body: '',
      },
    };
  }

  handleChangeMilestoneTitle = (event) => {
    const milestone = {...this.state.milestone};
    milestone.title = event.target.value;
    this.setState({milestone});
  }

  handleChangeIssueTitle = (event) => {
    const issue = {...this.state.issue};
    issue.title = event.target.value;
    this.setState({issue});
  }

  handleChangeIssueBody = (event) => {
    const issue = {...this.state.issue};
    issue.body = event.target.value;
    this.setState({issue});
  }

  handleSubmit = (event)  => {
    GitHubApiCommunicator.submitForm(this.state.milestone, this.state.issue, this.props.token);
    this.setState({
      milestone: {
        title: '',
      },
      issue: {
        title: '',
        body: '',
      },
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
          <IssueField 
            title={this.state.issue.title}
            handleChangeTitle={this.handleChangeIssueTitle}
            body={this.state.issue.body}
            handleChangeBody={this.handleChangeIssueBody} />
          <input className="button" type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default GoalsForm;
