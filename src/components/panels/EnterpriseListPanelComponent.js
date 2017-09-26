'use strict';

import React from 'react';
import { browserHistory } from 'react-router';

require('styles/panels/EnterpriseListPanel.scss');

class EnterpriseListPanelComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      enterprises: props.enterprises,
      status: props.status
    };
  }

  getEnterpriseDetails(enterpriseId) {
    const apiRoot = this.context.config.api_root;
    const status = this.state.status;

    let statusEndpoint;

    switch(status) {
      case 'pending':
        statusEndpoint = '/pending';
        break;
      case 'published':
        statusEndpoint = '/complete';
        break;
      case 'unpublished':
        statusEndpoint = '/unpublished';
        break;
      default:
        this.context.logger.notify('Unknown enterprise status: ' + status);
        statusEndpoint = '/complete';
    }

    fetch(apiRoot + '/enterprise/' + enterpriseId + statusEndpoint, {credentials: 'include'})
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        if (response.status == 403) {
          browserHistory.push('/login');
          return;
        }

        return Promise.reject(new Error('Response status: ' + response.status));
      })
      .then((enterprise) => {
        this.props.handleEnterpriseClick(enterprise);
      })
      .catch((error) => {
        this.context.logger.notify(error);
      });
  }

  componentWillReceiveProps(nextProps) {
    let newEnterprises = (nextProps.enterprises !== this.state.enterprises),
      newStatus = (nextProps.status !== this.state.status);

    if (newEnterprises || newStatus) {
      this.setState({
        enterprises: nextProps.enterprises,
        status: nextProps.status
      });
    }
  }

  render() {
    let jsx = [];
    const enterprises = this.state.enterprises;

    enterprises.map((enterprise) => {
      jsx.push(
        <li key={enterprise.id} onClick={this.getEnterpriseDetails.bind(this, enterprise.id)}>
          {enterprise.name}
        </li>
      );
    });

    return (
      <div className="panel enterpriselistpanel-component">
        <ul>
          {jsx}
        </ul>
      </div>
    );
  }
}

EnterpriseListPanelComponent.displayName = 'PanelsEnterpriseListPanelComponent';

EnterpriseListPanelComponent.contextTypes = {
  'config': React.PropTypes.object,
  'logger': React.PropTypes.object
};

export default EnterpriseListPanelComponent;
