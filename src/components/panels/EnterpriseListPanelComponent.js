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

    let locales = this.context.config.locales;

    // Fetch enterprise details in all locales
    // Note: we could defer this until the user clicks on a locale tab
    //       if fetching all locales takes a long time
    Promise.all(locales.map((locale) => {
      return fetch(api_root + '/enterprise/' + enterpriseId + '?lang=' + locale.locale);
    }))
      .then((responses) => {
        Promise.all(responses.map((response) => {
          return response.json();
        }))
          .then((json_array) => {
            // For each json obj in array, construct a superset obj containing the locale, I guess.
            const i18nEnterprise = locales.map((locale, index) => {
              return {
                locale: locale,
                enterprise: json_array[index]
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
