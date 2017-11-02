'use strict';

import React from 'react';
import { browserHistory } from 'react-router';

import api from '../api/api.js';

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

    api.getEnterpriseDetails(apiRoot, enterpriseId, status)
      .then(enterprise => {
        this.props.handleEnterpriseClick(enterprise);
      })
      .catch(error => {
        if (error.status === 403) {
          browserHistory.push('/login');

          return;
        }

        this.context.logger.notify(error.message);
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
