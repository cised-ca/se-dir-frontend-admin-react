'use strict';

import React from 'react';

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
    const api_root = this.context.config.api_root;

    fetch(api_root + '/enterprise/' + enterpriseId)
      .then((response) => {
        return response
          .json()
          .then((enterprise_details) => {
            // Pass this up to PanelListComponent
            this.props.handleEnterpriseClick(enterprise_details);
          });
      })
      .catch((error) => {
        this.context.logger.notify(error);
      });
  }

  componentWillReceiveProps(nextProps) {
    const next_enterprises = nextProps.enterprises;
    const curr_enterprises = this.state.enterprises;

    if (next_enterprises.length !== curr_enterprises.length) {
      this.setState({
        enterprises: next_enterprises
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
