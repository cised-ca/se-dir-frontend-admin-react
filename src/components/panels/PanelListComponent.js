'use strict';

import React from 'react';
import { browserHistory } from 'react-router';

import StatusPanel from './StatusPanelComponent';
import EnterpriseListPanel from './EnterpriseListPanelComponent';
import EnterpriseDetailsPanel from './EnterpriseDetailsPanelComponent';

require('styles/panels/PanelList.scss');

class PanelListComponent extends React.Component {
  constructor(props) {
    super(props);

    let state = {
      status: null,
      enterpriseDetails: null,
      enterpriseStatuses: null,
      enterprises: null
    };

    if (props.status) {
      state.status = props.status;
      state.enterpriseStatuses = props.enterpriseStatuses;
      state.enterprises = props.enterpriseStatuses[props.status];

      if (props.enterpriseId) {
        state.enterpriseId = props.enterpriseId;
      }
    }

    this.state = state;

    this.handleStatusClick = this.handleStatusClick.bind(this);
    this.handleEnterpriseClick = this.handleEnterpriseClick.bind(this);
    this.refreshData = this.refreshData.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const state = this.state,
      currentStatus = state.status,
      nextStatus = nextProps.status,
      currentEnterpriseId = state.enterpriseId,
      nextEnterpriseId = nextProps.enterpriseId,

      nextStatuses = nextProps.enterpriseStatuses,
      nextEnterprises = nextStatuses[nextStatus];

    if (currentStatus !== nextStatus
        || currentEnterpriseId !== nextEnterpriseId) {

      this.setState({
        status: nextStatus,
        enterpriseId: nextEnterpriseId,
        enterpriseStatuses: nextStatuses,
        enterprises: nextEnterprises
      });
    }
  }

  refreshData() {
    this.props.refreshData();
  }

  handleStatusClick(enterprises, status) {
    browserHistory.push('/admin/dashboard/' + status);
  }

  handleEnterpriseClick(enterpriseId) {
    this.setState({
      enterpriseId: enterpriseId
    });

    browserHistory.push('/admin/dashboard/' + this.state.status + '/' + enterpriseId);
  }

  buildPanels() {
    let jsx = [];
    const state = this.state;

    // The StatusPanel is always visible
    jsx.push(
      <StatusPanel
        key="status"
        enterpriseStatuses={this.props.enterpriseStatuses}
        handleStatusClick={this.handleStatusClick} />
    );

    // The EnterpriseListPanel is only visible if we know which
    // status to display
    if (state.status) {
      jsx.push(
        <EnterpriseListPanel
          key="enterprise-list"
          status={state.status}
          enterprises={state.enterprises}
          handleEnterpriseClick={this.handleEnterpriseClick} />
      );
    }

    // The EntepriseDetailsPanel is only visible if we know which
    // enterprise to display
    if (state.enterpriseId) {
      jsx.push(
        <EnterpriseDetailsPanel key="enterprise-details"
          enterpriseStatus={state.status}
          enterpriseId={state.enterpriseId}
          enterprise={state.enterpriseDetails}
          refreshData={this.refreshData} />
      );
    }

    return jsx;
  }

  render() {
    let jsx = this.buildPanels();

    return (
      <div className="panellist-component">
        {jsx}
      </div>
    );
  }
}

PanelListComponent.displayName = 'PanelsPanelListComponent';

export default PanelListComponent;

