import React, { Component } from 'react';

class IssueField extends Component {
  render() {
    return(
      <section className="issue">
        Issue Title
        <input className="input" type="text" value={this.props.title} onChange={this.props.handleChangeTitle} />
        Issue Body
        <textarea className="input" rows="3" value={this.props.body} onChange={this.props.handleChangeBody} />
      </section>
    );
  }
}

export default IssueField;
