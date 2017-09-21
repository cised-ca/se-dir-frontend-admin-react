'use strict';

import React from 'react';

import StatusList from '../StatusListComponent';
import Status from '../StatusComponent';

require('styles/panels/StatusPanel.scss');

class StatusPanelComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = props.enterpriseStatuses;

    this.handleStatusClick = this.handleStatusClick.bind(this);
  }

  handleStatusClick(enterprises, status) {
    // Pass this up to the PanelList component
    this.props.handleStatusClick(enterprises, status);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.enterpriseStatuses);
  }

  render() {
    return (
      <div className="panel statuspanel-component">
        <StatusList handleStatusClick={this.handleStatusClick}>
          <Status name="published" enterprises={this.state.published} />
          <Status name="pending" enterprises={this.state.pending} />
          <Status name="unpublished" enterprises={this.state.unpublished} />
        </StatusList>
      </div>
    );
  }
}

StatusPanelComponent.displayName = 'PanelsStatusPanelComponent';

export default StatusPanelComponent;
