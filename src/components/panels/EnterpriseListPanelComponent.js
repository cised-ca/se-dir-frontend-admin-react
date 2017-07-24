'use strict';

import React from 'react';

require('styles/panels/EnterpriseListPanel.scss');

class EnterpriseListPanelComponent extends React.Component {

  getEnterpriseDetails(enterpriseId) {
    const api_root = this.context.config.api_root;
    const component = this;

    fetch(api_root + '/enterprise/' + enterpriseId)
      .then((response) => {
        return response
          .json()
          .then(function(json) {
            // Pass this up to PanelListComponent
            component.props.handleEnterpriseClick(json);
          });
      })
      .catch((error) => {
        this.context.logger.notify(error);
      });
  }

  render() {
    let jsx = [];
    const component = this;
    const enterprises = this.props.enterprises;

    enterprises.map(function(enterprise) {
      jsx.push(
        <li key={enterprise.id} onClick={component.getEnterpriseDetails.bind(component, enterprise.id)}>
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

// Uncomment properties you need
// EnterpriseListPanelComponent.propTypes = {};
// EnterpriseListPanelComponent.defaultProps = {};

export default EnterpriseListPanelComponent;
