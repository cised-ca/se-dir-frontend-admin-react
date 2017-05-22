'use strict';

import React from 'react';

import Panel from 'components/PanelComponent.js';
import StatusList from 'components/StatusListComponent.js';
import Status from 'components/StatusComponent.js';

require('styles/pages/Dashboard.scss');

class DashboardComponent extends React.Component {
  render() {
    return (
      <div className="dashboard-component">
        <Panel>
          <StatusList>
            <Status name="Published" />
            <Status name="Pending" />
            <Status name="Unpublished" />
          </StatusList>
        </Panel>
      </div>
    );
  }
}

DashboardComponent.displayName = 'DashboardComponent';

export default DashboardComponent;
