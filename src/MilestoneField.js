import React, { Component } from 'react';

class MilestoneField extends Component {
  render() {
    return(
      <section className="milestone">
        <input className="input" type="text" placeholder="Milestone Title" value={this.props.value} onChange={this.props.handleChange} />
      </section>
    );
  }
}

export default MilestoneField;
