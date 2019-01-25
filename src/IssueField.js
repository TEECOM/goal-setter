import React, { Component } from 'react';

class IssueField extends Component {
  render() {
    return(
      <section className="issue">
        <input className="input" type="text" placeholder="Issue Title" value={this.props.title} onChange={this.props.handleChangeTitle} />
        <textarea className="input" rows="3" placeholder="Issue Body" value={this.props.body} onChange={this.props.handleChangeBody} />
      </section>
    );
  }
}

export default IssueField;
