'use strict';

import React from 'react';

require('styles/StatusList.scss');

class StatusListComponent extends React.Component {
  constructor(props) {
    super(props);

    this.handleStatusClick = this.handleStatusClick.bind(this);
  }

  handleStatusClick(enterprises, status) {
    // Pass this up to the StatusPanel component
    this.props.handleStatusClick(enterprises, status);
  }

  render() {
    let statuses = this.props.children;

    return (
      <ul className="statuslist-component status-list">
        {
          React.Children.map(
            statuses,
            status => {
              return (
                <li className="status-list-item">
                  {React.cloneElement(status, {onStatusClick: this.handleStatusClick})}
                </li>
              );
            }
          )
        }
      </ul>
    );
  }
}

StatusListComponent.displayName = 'StatusListComponent';

export default StatusListComponent;
