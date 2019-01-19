import React, { Component } from 'react';

class MilestoneField extends Component {
  render() {
    return(
      <label>
        Milestone Title
        <input className="input" type="text" value={this.props.value} onChange={this.props.handleChange} />
      </label>
    );
  }
}

export default MilestoneField;
