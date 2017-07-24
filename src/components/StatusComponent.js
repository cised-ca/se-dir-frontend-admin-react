'use strict';

import React from 'react';

require('styles/Status.scss');

class StatusComponent extends React.Component {
  handleClick() {
    this.props.onStatusClick(this.props.enterprises);
  }

  render() {
    const count = this.props.enterprises.length;

    return (
      <div className="status-component status" onClick={this.handleClick.bind(this)}>
        <span className="name">{this.props.name}</span>&nbsp;
        (<span className="count">{this.props.enterprises.length}</span>)
      </div>
    );
  }
}

StatusComponent.contextTypes = {
  'config': React.PropTypes.object,
  'logger': React.PropTypes.object
};

StatusComponent.displayName = 'StatusComponent';

export default StatusComponent;

