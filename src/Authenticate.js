import React, { Component } from 'react';

const CLIENT_ID = process.env.REACT_APP_OAUTH_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

class Authenticate extends Component {
  render() {
    return (
      <a href={`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo,user&redirect_uri=${REDIRECT_URI}`}>
        Login
      </a>
    )
  }
}

export default Authenticate;
