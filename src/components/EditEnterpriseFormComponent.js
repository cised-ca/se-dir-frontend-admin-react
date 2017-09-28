'use strict';

import React from 'react';
import Modal from 'react-modal';
import { translate } from 'react-i18next';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.scss';

import EnterpriseFormFields from './EnterpriseFormFieldsComponent';

Modal.setAppElement('#app');

require('styles/EditEnterpriseForm.scss');

class EditEnterpriseFormComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      enterprise: props.enterprise,
      locale: props.locale,
      modalIsOpen: false
    }

    this.closeModal = this.closeModal.bind(this);
    this.deleteEnterprise = this.deleteEnterprise.bind(this);
    this.handleStringInputChange = this.handleStringInputChange.bind(this);
    this.handleNumberInputChange = this.handleNumberInputChange.bind(this);
    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.handleDeleteEnterprise = this.handleDeleteEnterprise.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.enterprise.id !== this.props.enterprise.id) {
      this.setState({
        enterprise: nextProps.enterprise
      });
    }
  }

  fillTabList() {
    const locales = this.context.config.locales;
    const { t } = this.props;

    const tabs = locales.map((locale) => {
      return (
        <Tab key={locale.locale}>{t('enterpriseDetailsPanel:' + locale.name)}</Tab>
      );
    });

    return tabs;
  }

  fillTabPanels() {
    const locales = this.context.config.locales;
    const panels = locales.map((locale) => {
      const enterprise = this.state.enterprise[locale.locale];
      const enterpriseFormFields = <EnterpriseFormFields enterprise={enterprise} locale={locale.locale} />

      return (
        <TabPanel key={'enterprise-' + locale.locale}>
          <h1>{enterprise.name}</h1>

          {enterpriseFormFields}
        </TabPanel>
      );
    });

    return panels;
  }

  handleSubmitForm(event) {
    event.preventDefault();

    let enterprise = this.state.enterprise;
    const locale = this.state.locale;
    const endpoint = this.context.config.api_root + '/enterprise/' + enterprise.id;
    let enterpriseFinal = {};

    let enterpriseCopy = Object.assign({}, enterprise);

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    delete enterpriseCopy.id;
    delete enterpriseCopy.locations;

    enterpriseFinal[locale] = enterpriseCopy;

    const request = new Request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(enterpriseFinal),
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

  handleNumberInputChange(event) {
    const target = event.target;

    const filterInt = function(value) {
      if (/^([0-9]+)$/.test(value))
        return Number(value);
      return NaN;
    }

    const number = filterInt(target.value);

    if (isNaN(number)) {
      return;
    }

    let currEnterprise = this.state.enterprise;
    currEnterprise[target.name] = number;

    this.setState({
      enterprise: currEnterprise
    });
  }

  handleStringInputChange(event) {
    const target = event.target;

    let currEnterprise = this.state.enterprise;
    currEnterprise[target.name] = target.value;

    this.setState({
      enterprise: currEnterprise
    });
  }

  deleteEnterprise() {
    const enterprise = this.state.enterprise;
    const endpoint = this.context.config.api_root + '/enterprise/' + enterprise.id;

    const request = new Request(endpoint, {
      method: 'DELETE'
    });

    fetch(request, {credentials: 'same-origin'})
      .then((response) => {
        // TODO: Display success
        // TODO: Refresh list of enterprises

        // Set active panel to the enterprise list
        this.props.setActivePanel(2);
        this.props.refreshData();
      })
      .catch((error) => {
        // TODO: Display error
    });
  }

  handleDeleteEnterprise(event) {
    event.preventDefault();

    // Are you sure modal
    this.setState({
      modalIsOpen: true
    });
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  render() {
    const tabs = this.fillTabList();
    const panels = this.fillTabPanels();

    const enterprise = this.state.enterprise;
    const { t } = this.props;

    return (
      <div className='editenterpriseform-component edit-enterprise-form'>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel='Are you sure you want to delete {enterprise.name}?'
        >

          <h2 className='modal__title' ref={subtitle => this.subtitle = subtitle}>
            {t('enterpriseForm:areYouSureDelete')} {enterprise.name}?
          </h2>

          <p>
            {t('enterpriseForm:youAreAboutToDelete')} {enterprise.name}. {t('enterpriseForm:thisCannotBeUndone')}
            {t('enterpriseForm:areYouSureProceed')}
          </p>

          <input className='button button--destructive' name='delete'
            onClick={this.deleteEnterprise}
            type='button' value={t('enterpriseForm:delete')} />

          <input className='button button--default' name='cancel'
            onClick={this.closeModal}
            type='button' value={t('enterpriseForm:cancel')} />
        </Modal>
        
        <form onSubmit={this.handleSubmitForm}>
          <Tabs>
            <TabList>
              {tabs}
            </TabList>

            {panels}
          </Tabs>

          <input className='button button--primary' type='submit' value={t('editEnterpriseForm:save')} />

          <input className='button button--destructive' name='delete'
            onClick={this.handleDeleteEnterprise}
            type='button' value={t('editEnterpriseForm:delete')} />
        </form>
      </div>
    );
  }
}

EditEnterpriseFormComponent.displayName = 'EditEnterpriseFormComponent';

EditEnterpriseFormComponent.contextTypes = {
  'config': React.PropTypes.object,
  'logger': React.PropTypes.object
};

export default translate('editEnterpriseForm')(EditEnterpriseFormComponent);