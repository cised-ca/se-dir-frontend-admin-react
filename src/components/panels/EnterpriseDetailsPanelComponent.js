'use strict';

import React from 'react';
import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';

import EditEnterpriseForm from '../EditEnterpriseFormComponent';
import Loading from '../LoadingComponent';
import Back from '../BackComponent';

import api from '../../api/api.js';

require('styles/panels/EnterpriseDetailsPanel.scss');

class EnterpriseDetailsPanelComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      enterprise: props.enterprise,
      enterpriseId: props.enterpriseId,
      enterpriseStatus: props.enterpriseStatus
    };
  }

  getEnterpriseDetails(enterpriseId) {
    const apiRoot = this.context.config.api_root;
    const status = this.state.enterpriseStatus;

    api.getEnterpriseDetails(apiRoot, enterpriseId, status)
      .then(enterprise => {
        this.setState({
          enterprise: enterprise
        });
      })
      .catch(error => {
        if (error.status === 403) {
          browserHistory.push('/login');

          return;
        }

        this.context.logger.notify(error.message);
      });
  }

  componentWillMount() {
    const enterpriseId = this.props.enterpriseId;

    if (enterpriseId) {
      this.getEnterpriseDetails(this.props.enterpriseId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.enterpriseId !== this.state.enterpriseId) {
      this.getEnterpriseDetails(nextProps.enterpriseId);
    }
  }

  render() {
    const enterprise = this.state.enterprise;
    const status = this.state.enterpriseStatus;

    let jsx = [];

    if (!this.state.enterprise) {
      jsx.push(<Loading key="loading" />);
    } else {
      jsx.push(
        <EditEnterpriseForm key="enterprise-details" enterprise={enterprise} enterpriseStatus={status}
          refreshData={this.props.refreshData} />
      );
    }

    return (
      <div className="panel panel--wide enterprisedetailspanel-component">
        <Back />

        {jsx}
      </div>
    );
  }
}

EnterpriseDetailsPanelComponent.displayName = 'EnterpriseDetailsPanelComponent';

EnterpriseDetailsPanelComponent.contextTypes = {
  'config': React.PropTypes.object,
  'logger': React.PropTypes.object
};

export default translate('enterpriseDetailsPanel')(EnterpriseDetailsPanelComponent);
