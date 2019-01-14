import React, { Component } from 'react';

const CLIENT_ID = process.env.REACT_APP_OAUTH_CLIENT_ID;
const REDIRECT_URI = "http://localhost:3000/";

class Authenticate extends Component {
  render() {
    return (
      <a href={`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user&redirect_uri=${REDIRECT_URI}`}>
        Login
      </a>
    )
  }
}

export default Authenticate;
