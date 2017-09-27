'use strict';

import React from 'react';

import { browserHistory } from 'react-router';
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
    const apiRoot = this.context.config.api_root;
    let component = this;

    if (!apiRoot) {
      return Promise.resolve(null);
    }

    return fetch(apiRoot + '/account/enterpriseSummary', {credentials: 'same-origin'})
      .then((response) => {

          if (response.ok) {
            component.props.setLoggedIn(true);
            return response
              .json()
              .then(function(json) {
                return json;
              });
          }

          if (response.status == 403) {
            // IF we get a 403 error, it means we're not logged in.
            // Set logged in to false and redirect to login page
            component.props.setLoggedIn(false);
            browserHistory.push('/admin');
            return Promise.resolve(null);
          }

          this.context.logger.notify('Got response while fetching account/enterpriseSummary: ' + response.status);
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
