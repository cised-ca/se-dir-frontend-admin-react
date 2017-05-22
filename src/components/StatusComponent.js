'use strict';

import React from 'react';

require('styles/Status.scss');

class StatusComponent extends React.Component {
  render() {
    return (
      <div className="status-component status">
        <span className="name">{this.props.name}</span>
      </div>
    );
  }
}

StatusComponent.displayName = 'StatusComponent';

export default StatusComponent;

