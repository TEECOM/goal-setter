import React, { Component } from 'react';

class Authenticate extends Component {
  render() {
    if(this.props.token) {
      return (<button onClick={this.props.logOut}>Log out</button>);
    } else {
      return (<button onClick={this.props.logIn}>Log in</button>);
    }
  }
}

export default Authenticate;
