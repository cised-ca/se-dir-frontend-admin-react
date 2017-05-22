'use strict';

import React from 'react';

require('styles/StatusList.scss');

class StatusListComponent extends React.Component {
  render() {
    let statuses = this.props.children;

    return (
      <ul className="statuslist-component status-list">
        {
          React.Children.map(
            statuses,
            status =>
              <li className="status-list-item">{status}</li>
          )
        }
      </ul>
    );
  }
}

StatusListComponent.displayName = 'StatusListComponent';

export default StatusListComponent;
