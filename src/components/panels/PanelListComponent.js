'use strict';

import React from 'react';

import StatusPanel from './StatusPanelComponent';
import EnterpriseListPanel from './EnterpriseListPanelComponent';
import EnterpriseDetailsPanel from './EnterpriseDetailsPanelComponent';

require('styles/panels/PanelList.scss');

class PanelListComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activePanel: 1,
      enterpriseDetails: null
    };

    this.handleStatusClick = this.handleStatusClick.bind(this);
    this.handleEnterpriseClick = this.handleEnterpriseClick.bind(this);
    this.setActivePanel = this.setActivePanel.bind(this);
    this.refreshData = this.refreshData.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.status) {
      return;
    }
    const nextStatuses = nextProps.enterpriseStatuses;
    const currStatus = this.state.status.toLowerCase();
    const nextEnterprises = nextStatuses[currStatus];

    if (nextEnterprises.length !== this.state.enterprises.length) {
      this.setState({
        enterprises: nextEnterprises
      });
    }
  }

  refreshData() {
    this.props.refreshData();
  }

  setActivePanel(activePanel) {
    this.setState({
      activePanel: activePanel
    });
  }

  handleStatusClick(enterprises, status) {
    this.setState({
      activePanel: 2,
      enterprises: enterprises,
      status: status
    });
  }

  handleEnterpriseClick(enterprise) {
    this.setState({
      activePanel: 3,
      enterpriseDetails: enterprise
    });
  }

  buildPanels(activePanel) {
    let jsx = [];

    jsx.push(
      <StatusPanel key="status" enterpriseStatuses={this.props.enterpriseStatuses}
        handleStatusClick={this.handleStatusClick} />
    );

    if (activePanel >= 2) {
      jsx.push(<EnterpriseListPanel key="enterprise-list" enterprises={this.state.enterprises}
        status={this.state.status} handleEnterpriseClick={this.handleEnterpriseClick} />);
    }

    if (activePanel >= 3) {
      jsx.push(<EnterpriseDetailsPanel key="enterprise-details"
        setActivePanel={this.setActivePanel}
        enterprise={this.state.enterpriseDetails}
        refreshData={this.refreshData} />);
    }

    return jsx;
  }

  render() {
    let jsx = this.buildPanels(this.state.activePanel);

    return (
      <div className="panellist-component">
        {jsx}
      </div>
    );
  }
}

PanelListComponent.displayName = 'PanelsPanelListComponent';

export default PanelListComponent;
