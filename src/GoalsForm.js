import React, { Component } from 'react';
import GitHubApiCommunicator from './apiCommunicators/GitHubApiCommunicator';

class GoalsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    GitHubApiCommunicator.createMilestone(this.state.value, this.props.token);
    event.preventDefault();
  }

  render() {
    if(this.props.token) {
      const owner = process.env.REACT_APP_REPO_OWNER;
      const repo = process.env.REACT_APP_REPO_NAME;
      const text = `Submit a title to open a milestone in ${owner}'s repo, ${repo}.`;

      return (
        <div>
          <p>{text}</p>
          <form onSubmit={this.handleSubmit}>
            <label>
              Title
              <input className="input" type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
            <input className="button" type="submit" value="Submit" />
          </form>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default GoalsForm;
