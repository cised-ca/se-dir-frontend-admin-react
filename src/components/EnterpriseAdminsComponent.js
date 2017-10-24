'use strict';

import React from 'react';
import { translate } from 'react-i18next';

import 'whatwg-fetch';

require('styles/EnterpriseAdmins.scss');

class EnterpriseAdminsComponent extends React.Component {
  constructor(props) {
    super(props);

    this.handleUpdateAdmins = this.handleUpdateAdmins.bind(this);
    this.handleChangeAdmins = this.handleChangeAdmins.bind(this);

    this.state = {
      enterpriseId: props.enterpriseId
    }
  }

  handleChangeAdmins(event) {
    this.setState({
      'admins': event.target.value
    });
  }

  componentDidMount() {
    const enterpriseId = this.state.enterpriseId;
    const endpoint = this.context.config.api_root + '/enterprise/' +
      enterpriseId + '/admin';

    fetch(endpoint, {credentials: 'same-origin'})
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((json) => {
              this.setState({
                'admins': json.admin_emails.join('\n')
              });
            });
        }
      })
      .catch((error) => {
        // TODO: Display error
      });
  }

  handleUpdateAdmins(event) {
    event.preventDefault();

    const enterpriseId = this.state.enterpriseId;
    const endpoint = this.context.config.api_root + '/enterprise/' +
      enterpriseId + '/admin';
    const newAdmins = {
      'admin_emails': this.state.admins.split('\n')
    };

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const request = new Request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(newAdmins),
      headers: headers
    });

    fetch(request, {credentials: 'same-origin'})
      .then((response) => {
        // TODO: Display success
      })
      .catch((error) => {
        // TODO: Display error
      });
  }

  render() {
    const { t } = this.props;

    return (
      <div className="enterpriseadmins-component">
        <h2>{t('enterpriseAdmins:enterpriseAdministrators')}</h2>

        <label>
          {t('enterpriseAdmins:emailAddresses')}:

          <textarea value={this.state.admins} onChange={this.handleChangeAdmins}>

          </textarea>
        </label>

        <input className='button button--primary' type="submit"
          onClick={this.handleUpdateAdmins} value={t('enterpriseAdmins:updateAdmins')} />
      </div>
    );
  }
}

EnterpriseAdminsComponent.displayName = 'EnterpriseAdminsComponent';

EnterpriseAdminsComponent.contextTypes = {
  'config': React.PropTypes.object,
  'logger': React.PropTypes.object
};

export default translate('enterpriseAdmins')(EnterpriseAdminsComponent);
