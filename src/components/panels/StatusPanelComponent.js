'use strict';

import React from 'react';

import Panel from '../PanelComponent';
import StatusList from '../StatusListComponent';
import Status from '../StatusComponent';

require('styles/panels/StatusPanel.scss');

class StatusPanelComponent extends React.Component {
  handleStatusClick(enterprises) {
    // Pass this up to the PanelList component
    this.props.handleStatusClick(enterprises);
  }

  render() {
    const enterprises = this.props.enterpriseStatuses;
    const published = enterprises.published;
    const pending = enterprises.pending;
    const unpublished = enterprises.unpublished;

    return (
      <div className="statuspanel-component">
        <Panel>
          <StatusList handleStatusClick={this.handleStatusClick.bind(this)}>
            <Status name="Published" enterprises={published} />
            <Status name="Pending" enterprises={pending} />
            <Status name="Unpublished" enterprises={unpublished} />
          </StatusList>
        </Panel>
      </div>
    );
  }
}

StatusPanelComponent.displayName = 'PanelsStatusPanelComponent';

export default StatusPanelComponent;

