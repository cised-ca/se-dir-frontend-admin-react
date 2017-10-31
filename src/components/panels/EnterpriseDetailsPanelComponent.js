'use strict';

import React from 'react';
import { translate } from 'react-i18next';

import EditEnterpriseForm from '../EditEnterpriseFormComponent';

require('styles/panels/EnterpriseDetailsPanel.scss');

class EnterpriseDetailsPanelComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      enterprise: props.enterprise,
      enterpriseStatus: props.enterpriseStatus
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.enterprise.id !== this.props.enterprise.id) {
      this.setState({
        enterprise: nextProps.enterprise
      });
    }
  }

  render() {
    const enterprise = this.state.enterprise;
    const status = this.state.enterpriseStatus;

    return (
      <div className="panel panel--wide enterprisedetailspanel-component">
        <EditEnterpriseForm enterprise={enterprise} enterpriseStatus={status}
          setActivePanel={this.props.setActivePanel} refreshData={this.props.refreshData} />
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
