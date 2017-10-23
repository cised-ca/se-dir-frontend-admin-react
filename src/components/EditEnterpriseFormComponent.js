'use strict';

import React from 'react';
import Modal from 'react-modal';
import { translate } from 'react-i18next';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.scss';

import EnterpriseFormFields from './EnterpriseFormFieldsComponent';
import UploadLogo from './UploadLogoComponent';

Modal.setAppElement('#app');

require('styles/EditEnterpriseForm.scss');

class EditEnterpriseFormComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      enterprise: props.enterprise,
      modalIsOpen: false
    }

    this.closeModal = this.closeModal.bind(this);
    this.deleteEnterprise = this.deleteEnterprise.bind(this);
    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.handleDeleteEnterprise = this.handleDeleteEnterprise.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleTabSelect = this.handleTabSelect.bind(this);
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

  handleTabSelect(index) {
    this.setState({
      'selectedTab': index
    });
  }

  handleFormChange(fieldsState) {
    let newState = {};
    newState[fieldsState.locale] = fieldsState.enterprise;

    this.setState(newState);
  }

  handleSubmitForm(event) {
    event.preventDefault();

    const enterprise = this.state.enterprise;
    let updatedEnterprise = {};

    const locales = this.context.config.locales;
    locales.map((locale) => {
      updatedEnterprise[locale.locale] = enterprise[locale.locale];
    });

    updatedEnterprise.locations = enterprise.locations || [];

    const endpoint = this.context.config.api_root + '/enterprise/' + enterprise.id;

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const request = new Request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(enterprise),
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

  formButtons() {
    let jsx = null;
    const { t } = this.props;

    if ( this.state.selectedTab !== 2 ) {
      jsx = (
        <div>
          <input className='button button--primary' type='submit' value={t('editEnterpriseForm:save')} />

          <input className='button button--destructive' name='delete'
            onClick={this.handleDeleteEnterprise}
            type='button' value={t('editEnterpriseForm:delete')} />
        </div>
      );
    }

    return jsx;
  }

  render() {
    const tabs = this.fillTabList();
    const panels = this.fillTabPanels();
    const buttons = this.formButtons();

    const enterprise = this.state.enterprise;
    const { t } = this.props;

    const currentLocale = this.context.config.currentLocale;

    return (
      <div className='editenterpriseform-component edit-enterprise-form'>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel='Are you sure you want to delete {enterprise.name}?'
        >

          <h2 className='modal__title' ref={subtitle => this.subtitle = subtitle}>
            {t('editEnterpriseForm:areYouSureDelete')} {enterprise[currentLocale].name}?
          </h2>

          <p>
            {t('editEnterpriseForm:youAreAboutToDelete')} {enterprise[currentLocale].name}. {t('editEnterpriseForm:thisCannotBeUndone')}
            {t('editEnterpriseForm:areYouSureProceed')}
          </p>

          <input className='button button--destructive' name='delete'
            onClick={this.deleteEnterprise}
            type='button' value={t('editEnterpriseForm:delete')} />

          <input className='button button--default' name='cancel'
            onClick={this.closeModal}
            type='button' value={t('editEnterpriseForm:cancel')} />
        </Modal>

        <form onSubmit={this.handleSubmitForm}>
          <Tabs onSelect={this.handleTabSelect}>
            <TabList>
              {tabs}
              <Tab>{t('editEnterpriseForm:settings')}</Tab>
            </TabList>

            {panels}

            <TabPanel>
              <h1>{t('editEnterpriseForm:settings')}</h1>

              <UploadLogo enterpriseId={this.state.enterprise.id} />
            </TabPanel>
          </Tabs>

          {buttons}
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
