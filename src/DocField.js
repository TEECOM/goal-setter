import React, { Component } from 'react';

class DocField extends Component {
  render() {
    const prefix = this.props.repoName + " / doc / goals /"
    const filepath =  (
      <section className="docfield">
        <div>
          <span>{ prefix }</span>
          <input
            onChange={this.props.updateFilename}
            value={this.props.filename} />
          .md
        </div>
      </section>
    )

    return (
      <section className="doc">
        { filepath }
        <textarea
          className="doc input"
          rows="10"
          onChange={this.props.updateTextDirectly}
          value={this.props.text} />
      </section>
    );
  }
}

export default DocField;
