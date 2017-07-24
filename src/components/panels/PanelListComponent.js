'use strict';

import React from 'react';

import StatusPanel from './StatusPanelComponent';
import EnterpriseListPanel from './EnterpriseListPanelComponent';
import EnterpriseDetailsPanel from './EnterpriseDetailsPanelComponent';

require('styles/panels/PanelList.scss');

class PanelListComponent extends React.Component {
/*  handleStatusClick(enterprises) {
    // Pass this up to the Dashboard component
    this.props.handleStatusClick(enterprises);
  }*/

  constructor(props) {
    super(props);

    this.state = {
      activePanel: 1,
      enterpriseDetails: null
    };
  }

  handleStatusClick(enterprises) {
    this.setState({
      activePanel: 2,
      enterprises: enterprises
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
        handleStatusClick={this.handleStatusClick.bind(this)} />
    );

    if (activePanel >= 2) {
      jsx.push(<EnterpriseListPanel key="enterprise-list" enterprises={this.state.enterprises}
        handleEnterpriseClick={this.handleEnterpriseClick.bind(this)} />);
    }

    if (activePanel >= 3) {
      jsx.push(<EnterpriseDetailsPanel key="enterprise-details" enterprise={this.state.enterpriseDetails} />);
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
