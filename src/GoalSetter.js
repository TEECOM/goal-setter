import React, { Component } from 'react';
import Authenticate from './Authenticate';
import GoalsForm from './GoalsForm';

class GoalSetter extends Component {
  componentDidMount() {
    const gatekeeperURI = process.env.REACT_APP_GATEKEEPER_URI
    const code =
      window.location.href.match(/\?code=(.*)/) &&
      window.location.href.match(/\?code=(.*)/)[1];

    if (code) {
      fetch(`${gatekeeperURI}/authenticate/${code}`)
        .then(response => response.json())
        .then(({ token }) => {
          localStorage.setItem('token', token);
        });
    }
  }

  displayContent() {
    const token = localStorage.getItem('token');

    return(token ? <GoalsForm token={token} /> : <Authenticate />);
  }

  render() {
    return(
      <div id='root'>
        {this.displayContent()}
      </div>
    );
  }
}

export default GoalSetter;
