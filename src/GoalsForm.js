import React, { Component } from 'react';
import MilestoneField from './MilestoneField';
import IssueField from './IssueField';

import gitHubApiCommunicator from './apiCommunicators/gitHubApiCommunicator';

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
      docText: '',
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
    const milestoneTitle = this.state.milestone.title;
    const owner = process.env.REACT_APP_REPO_OWNER;
    const repo = process.env.REACT_APP_REPO_NAME;
    
    let result = '';

    if (milestoneTitle) {
      result = result.concat(`# [${milestoneTitle}](https://github.com/${owner}/${repo}/milestone/1)\n\n`);
    }

    this.state.issues.forEach((issue) => {
      if (issue.title !== '') {
        result = result.concat(`## [${issue.title}](https://github.com/${owner}/${repo}/issues/1)\n\n`)

        if (issue.body !== '') {
          result = result.concat(`${issue.body}\n\n`)
        }
      }
    });

    if (event) {
      result = result.concat(event.target.value);
    }

    this.setState({docText: result});
  }

  updateDocDirectly = (event) => {
    this.setState({docText: event.target.value});
  }

  render() {
    const owner = process.env.REACT_APP_REPO_OWNER;
    const repo = process.env.REACT_APP_REPO_NAME;
    const text = `Submit a title to open a milestone in ${owner}'s repo, ${repo}.`;

    const filepath = process.env.REACT_APP_REPO_NAME + " / doc / goals / 2019-q1.md"

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
          </section>
          <section className="doc">
            { filepath }
            <textarea className="doc input" rows="5" onChange={this.updateDocDirectly} value={this.state.docText} />
          </section>
          <section>
            <input className="button" type="submit" value="Submit" />
          </section>
        </form>
      </div>
    );
  }
}

export default GoalsForm;
