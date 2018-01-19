'use strict';

import React from 'react';
import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';

import ModalError from '../ModalErrorComponent';
import Back from '../BackComponent';

import api from '../../api/api.js';

require('styles/pages/CreateEnterprisePage.scss');

class CreateEnterprisePageComponent extends React.Component {

  constructor(props, context) {
    super(props);

    this.clearModalError = this.clearModalError.bind(this);
    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleStringInputChange = this.handleStringInputChange.bind(this);

    let enterprise = {};

    const locales = context.config.locales;
    locales.map((locale) => {
      enterprise[locale.locale] = {};
    });

    this.state = {
      enterprise: enterprise
    };
  }

  componentWillMount() {
    if (!this.props.isLoggedIn) {
      browserHistory.push('/admin');
    }
  }

  clearModalError() {
      this.setState({
        error: null
    });
  }

  handleCancel() {
    browserHistory.push('/admin/dashboard');
  }

  handleStringInputChange(event) {
    const target = event.target;

    let currEnterprise = this.state.enterprise;
    currEnterprise[target.dataset.locale][target.name] = target.value;

    this.setState({
      enterprise: currEnterprise
    });
  }

  handleSubmitForm(event) {
    event.preventDefault();

    const apiRoot = this.context.config.api_root;
    const enterprise = this.state.enterprise;
    let updatedEnterprise = {};

    const locales = this.context.config.locales;
    locales.map((locale) => {
      updatedEnterprise[locale.locale] = enterprise[locale.locale];
    });

    api.createEnterprise(apiRoot, updatedEnterprise)
      .then((response) => {
        browserHistory.push('/admin/dashboard/unpublished/' + response.id);
      })
      .catch(error => {
          const errorModal = (
            <ModalError clearError={this.clearModalError}>
              {error.message}
            </ModalError>
          );

          this.setState({
            error: errorModal
          });
      });
  }

  render() {
    const error = this.state.error;
    let enterprise = this.state.enterprise;

    const { t } = this.props;

    return (
      <div className="createenterprisepage-component create-enterprise-page">
        <Back />

        {error}

        <form onSubmit={this.handleSubmitForm}>

          <label>
            {t('createEnterprisePage:englishEnterpriseName')}
            <input
              name='name'
              data-locale='en'
              onChange={this.handleStringInputChange}
              required
              value={enterprise.en.name || ''} />
          </label>

          <label>
            {t('createEnterprisePage:frenchEnterpriseName')}
            <input
              name='name'
              data-locale='fr'
              onChange={this.handleStringInputChange}
              required
              value={enterprise.fr.name || ''} />
          </label>

          <input className='button button--primary' type='submit' value={t('createEnterprisePage:next')} />

          <input className='button button--default' name='cancel'
            onClick={this.handleCancel}
            type='button' value={t('createEnterprisePage:cancel')} />
        </form>
      </div>
    );
  }
}

CreateEnterprisePageComponent.displayName = 'CreateEnterprisePageComponent';

CreateEnterprisePageComponent.contextTypes = {
  'config': React.PropTypes.object,
  'logger': React.PropTypes.object
};

export default translate('createEnterprisePage')(CreateEnterprisePageComponent);
