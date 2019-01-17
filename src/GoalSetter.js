import React, { Component } from 'react';
import Authenticate from './Authenticate';
import GoalsForm from './GoalsForm';

class GoalSetter extends Component {
  state = { token: localStorage.getItem('token') };

  componentDidMount() {
    this.authenticate();
  }

  authenticate() {
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

  logIn = () => {
    const CLIENT_ID = process.env.REACT_APP_OAUTH_CLIENT_ID;
    const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

    window.location.replace(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo,user&redirect_uri=${REDIRECT_URI}`)
    this.authenticate();
  }

  logOut = () => {
    localStorage.setItem('token', '');
    this.setState({ token: '' });
  }

  render() {
    const token = this.state.token;

    return(
      <div id='root'>
        <Authenticate
          token={token}
          logOut={this.logOut}
          logIn={this.logIn} />
        <GoalsForm token={token} />
      </div>
    );
  }
}

export default GoalSetter;
