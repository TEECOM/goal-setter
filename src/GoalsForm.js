import React, { Component } from 'react';
import GitHubApiCommunicator from './apiCommunicators/GitHubApiCommunicator';

class GoalsForm extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '', milestones: [] };
  }

  componentDidMount() {
    const rawMilestones = GitHubApiCommunicator.fetchMilestones(this.props.token);

    rawMilestones
      .then((result) => {
        const milestones = result.data.map((milestone) => milestone['title']);
        this.setState({ milestones });
      });
  }

  handleChange = (event) => {
    this.setState({value: event.target.value});
  }

  handleSubmit = (event)  => {
    const newMilestones = this.state.milestones.concat(this.state.value)
    GitHubApiCommunicator.createMilestone(this.state.value, this.props.token);
    this.setState({ value: '', milestones: newMilestones });
    event.preventDefault();
  }

  render() {
    const owner = process.env.REACT_APP_REPO_OWNER;
    const repo = process.env.REACT_APP_REPO_NAME;
    const text = `Submit a title to open a milestone in ${owner}'s repo, ${repo}.`;

    const renderMilestones = () => {
      return(
        <div>
          <h4>Open Milestones</h4>
          { this.state.milestones.map((milestone) => <div key={milestone}>{milestone}</div> )}
        </div>
      );
    }

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
        { renderMilestones() }
      </div>
    );
  }
}

export default GoalsForm;
