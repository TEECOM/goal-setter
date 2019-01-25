import React, { Component } from 'react';

class DocField extends Component {
  render() {
    const filepath = process.env.REACT_APP_REPO_NAME + 
      " / doc / goals / 2019-q1.md"

    return (
      <section className="doc">
        <div>{ filepath }</div>
        <textarea
          className="doc input"
          rows="10"
          onChange={this.props.updateDocDirectly}
          value={this.props.docText} />
      </section>
    );
  }
}

export default DocField;
