import React, { Component } from 'react';

class RepoSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    }
  }

  toggleDropdown = () => {
    if (this.state.visible) {
      this.setState({visible: false});
    } else {
      this.setState({visible: true});
    }
  }

  selectRepo = (event) => {
    this.props.handleChange(event);
    this.toggleDropdown();
  }

  renderOptions = () => {
    if (this.state.visible) {
      return this.props.repoNames.map((name, i) => {
        return (
          <div value={i} key={i} onClick={this.selectRepo}>
            {name}
          </div>
        )
      });
    }
  }

  render() {
    return (
      <nav>
        <p>Select Repo</p>
        <div onClick={this.toggleDropdown}>{this.props.currentRepo.name}</div>
        {this.renderOptions()}
      </nav>
    );
  }
}

export default RepoSelector;
