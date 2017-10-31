'use strict';

import React from 'react';
import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.scss';

import EnterpriseFormFields from '../EnterpriseFormFieldsComponent';

import api from '../api/api.js';

require('styles/pages/CreateEnterprisePage.scss');

class CreateEnterprisePageComponent extends React.Component {

  constructor(props, context) {
    super(props);

    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);

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

  handleCancel() {
    browserHistory.push('/admin/dashboard');
  }

  handleFormChange(fieldsState) {
    let newState = {};
    newState[fieldsState.locale] = fieldsState.enterprise;

    this.setState(newState);
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

    // TODO: locations
    // updatedEnterprise.locations = enterprise.locations || [];

    api.createEnterprise(apiRoot, updatedEnterprise)
      .then((response) => {
        // TODO: Display success
      })
      .catch((error) => {
        // TODO: Display error
      });
  }

  fillTabList() {
    const locales = this.context.config.locales;
    const { t } = this.props;

    const tabs = locales.map((locale) => {
      return (
        <Tab key={locale.locale}>{t('createEnterprisePage:' + locale.name)}</Tab>
      );
    });

    return tabs;
  }

  fillTabPanels() {
    const locales = this.context.config.locales;

    const panels = locales.map((locale) => {
      const enterprise = this.state.enterprise[locale.locale];
      const enterpriseFormFields = <EnterpriseFormFields enterprise={enterprise} locale={locale.locale} updateParent={this.handleFormChange} />

      return (
        <TabPanel key={'enterprise-' + locale.locale}>
          <h1>{enterprise.name}</h1>

          {enterpriseFormFields}
        </TabPanel>
      );
    });

    return panels;
  }

  render() {
    const tabs = this.fillTabList();
    const panels = this.fillTabPanels();

    const { t } = this.props;

    return (
      <div className="createenterprisepage-component create-enterprise-page">
        <form onSubmit={this.handleSubmitForm}>
          <Tabs>
            <TabList>
              {tabs}
            </TabList>

            {panels}
          </Tabs>

          <input className='button button--primary' type='submit' value={t('createEnterprisePage:save')} />

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
