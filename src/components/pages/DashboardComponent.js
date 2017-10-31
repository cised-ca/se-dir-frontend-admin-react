'use strict';

import React from 'react';

import { browserHistory } from 'react-router';
import PanelList from '../panels/PanelListComponent';
import Loading from '../LoadingComponent';

import api from '../api/api.js';

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
    const apiRoot = this.context.config.api_root;
    let component = this;

    if (!apiRoot) {
      return Promise.resolve(null);
    }

    return api.getEnterpriseSummary(apiRoot)
      .then(json => {
        component.props.setLoggedIn(true);
        return json;
      })
      .catch(error => {
        if (error.status === 403) {
          component.props.setLoggedIn(false);
          browserHistory.push('/admin');

          return Promise.resolve(null);
        }

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
