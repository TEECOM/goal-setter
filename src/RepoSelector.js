import React, { Component } from 'react';

class RepoSelector extends Component {
  renderOptions = () => {
    return this.props.repoNames.map((name, i) => {
      return (<option value={i} key={i}>{name}</option>)
    });
  }

  render() {
    return (
      <select onChange={this.props.handleChange}>
        { this.renderOptions() }
      </select>
    );
  }
}

export default RepoSelector;
