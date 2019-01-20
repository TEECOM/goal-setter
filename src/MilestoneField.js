import React, { Component } from 'react';

class MilestoneField extends Component {
  render() {
    return(
      <section>
        Milestone Title
        <input className="input" type="text" value={this.props.value} onChange={this.props.handleChange} />
      </section>
    );
  }
}

export default MilestoneField;
