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
    const apiRoot = this.context.config.api_root;

    let locales = this.context.config.locales;

    // Fetch enterprise details in all locales
    // Note: we could defer this until the user clicks on a locale tab
    //       if fetching all locales takes a long time
    Promise.all(locales.map((locale) => {
      return fetch(apiRoot + '/enterprise/' + enterpriseId + '?lang=' + locale.locale);
    }))
      .then((responses) => {
        Promise.all(responses.map((response) => {
          return response.json();
        }))
          .then((jsonArray) => {
            // For each json obj in array, construct a superset obj containing the locale, I guess.
            const i18nEnterprise = locales.map((locale, index) => {
              return {
                locale: locale,
                enterprise: jsonArray[index]
              };
            });

            this.props.handleEnterpriseClick(i18nEnterprise);
          });
      })
      .catch((error) => {
        this.context.logger.notify(error);
      });
  }

  componentWillReceiveProps(nextProps) {
    const nextEnterprises = nextProps.enterprises;
    const currEnterprises = this.state.enterprises;

    if (nextEnterprises.length !== currEnterprises.length) {
      this.setState({
        enterprises: nextEnterprises
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
