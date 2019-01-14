import React, { Component } from 'react';
import Authenticate from './Authenticate';
import GoalsForm from './GoalsForm';

class GoalSetter extends Component {
  state = {
    authenticated: false,
    token: null
  };

  componentDidMount() {
    const code =
      window.location.href.match(/\?code=(.*)/) &&
      window.location.href.match(/\?code=(.*)/)[1];

    if (code) {
      fetch(`https://goal-setter-gatekeeper.herokuapp.com/authenticate/${code}`)
        .then(response => response.json())
        .then(({ token }) => {
          this.setState({
            token,
            authenticated: true
          });
        });
    }
  }

  displayContent() {
    return(this.state.authenticated ? <GoalsForm /> : <Authenticate />);
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
