import React, { Component } from 'react';

class IssueField extends Component {
  render() {
    return(
      <label>
        Issue Title
        <input className="input" type="text" value={this.props.title} onChange={this.props.handleChangeTitle} />
        Issue Body
        <textarea className="input" rows="5" value={this.props.body} onChange={this.props.handleChangeBody} />
      </label>
    );
  }
}

export default IssueField;
