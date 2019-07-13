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

  back = () => {

  }

  forward = () => {

  }

  renderOptions = () => {
    let result;

    if (this.state.visible) {
      result = this.props.repoNames.map((name, i) => {
        return (
          <div className="dropdown-item" value={i} key={i} onClick={this.selectRepo}>
            {name}
          </div>
        )
      });

      return (
        <nav>
          {result}
          <div className="list-navigation">
            <span className="arrow" onClick={this.back}>
              &lt;
            </span>
            <span className="arrow" onClick={this.forward}>
              &gt;
            </span>
          </div>
        </nav>
      )
    }

    return;
  }

  render() {
    return (
      <div className="repo-selector">
        <div className="current-repo" onClick={this.toggleDropdown}>{this.props.currentRepo.name}</div>
        {this.renderOptions()}
      </div>
    );
  }
}

export default RepoSelector;
