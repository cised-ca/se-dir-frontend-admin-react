'use strict';

import React from 'react';

import PanelList from '../panels/PanelListComponent';
import Loading from '../LoadingComponent';

require('styles/pages/Dashboard.scss');

class DashboardComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activePanel: 1,
      enterpriseStatuses: null
    };

    this.refreshData = this.refreshData.bind(this);
  }

  getEnterpriseStatuses() {
    const api_root = this.context.config.api_root;

    if (!api_root) {
      return Promise.resolve(null);
    }

    return fetch(api_root + '/account/enterpriseSummary')
      .then((response) => {
        return response
          .json()
          .then(function(json) {
            return json;
          });
      })
      .catch((error) => {
        this.context.logger.notify(error);
      });
  }

  refreshData() {
    // FIXME: dupe [1]
    this.getEnterpriseStatuses()
      .then((enterpriseStatuses) => {
        this.setState({
          enterpriseStatuses: enterpriseStatuses
        });
      })
      .catch((err) => {
        // TODO: display error
        this.context.logger.notify('refresh data fail...: ' + err);
      });
  }

  componentDidMount() {
    // FIXME: dupe [1]
    this.getEnterpriseStatuses()
      .then((enterpriseStatuses) => {
        this.setState({
          enterpriseStatuses: enterpriseStatuses
        });
      });
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    if (prevContext.config.api_root !== this.context.config.api_root) {
      this.getEnterpriseStatuses()
        .then((enterpriseStatuses) => {
          this.setState({
            enterpriseStatuses: enterpriseStatuses
          });
        });
    }
  }

  render() {
    if (!this.state.enterpriseStatuses) {
      return (<Loading />);
    }

    return (
      <div className="dashboard-component">
        <PanelList activePanel={this.state.activePanel}
          enterpriseStatuses={this.state.enterpriseStatuses}
          refreshData={this.refreshData} />
      </div>
    );
  }
}

DashboardComponent.displayName = 'DashboardComponent';

DashboardComponent.contextTypes = {
  'config': React.PropTypes.object,
  'logger': React.PropTypes.object
};

export default DashboardComponent;
