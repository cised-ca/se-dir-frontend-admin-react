'use strict';

import React from 'react';
import Modal from 'react-modal';
import { translate } from 'react-i18next';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.scss';

import EnterpriseFormFields from './EnterpriseFormFieldsComponent';
import UploadLogo from './UploadLogoComponent';
import EnterpriseAdmins from './EnterpriseAdminsComponent';
import FlashMessage from './FlashMessageComponent';
import ModalError from './ModalErrorComponent';

import api from './api/api.js';

Modal.setAppElement('#app');

require('styles/EditEnterpriseForm.scss');

class EditEnterpriseFormComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      enterprise: props.enterprise,
      enterpriseStatus: props.enterpriseStatus,
      modalIsOpen: false
    }

    this.closeModal = this.closeModal.bind(this);
    this.clearModalError = this.clearModalError.bind(this);
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

  clearModalError() {
      this.setState({
        error: null
    });
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

    const apiRoot = this.context.config.api_root;
    const enterprise = this.state.enterprise;
    let updatedEnterprise = {};

    const locales = this.context.config.locales;
    locales.map((locale) => {
      updatedEnterprise[locale.locale] = enterprise[locale.locale];
    });

    const { t } = this.props;

    // TODO
    // updatedEnterprise.locations = enterprise.locations || [];

    api.editEnterprise(apiRoot, enterprise.id, updatedEnterprise)
      .then(() => {
          const flashMessage = (
            <FlashMessage type="success">
              {t('common:enterpriseEditSucess')}
            </FlashMessage>
          );

          this.setState({
            flashMessage: flashMessage
          });
      })
      .catch(error => {
          const errorModal = (
            <ModalError clearError={this.clearModalError}>
              {t('common:enterpriseEditError')} "{error.message}"
            </ModalError>
          );

          this.setState({
            error: errorModal
          });
      });
  }

  deleteEnterprise() {
    const enterprise = this.state.enterprise;
    const enterpriseStatus = this.state.enterpriseStatus;
    const apiRoot = this.context.config.api_root;

    api.deleteEnterprise(apiRoot, enterprise.id, enterpriseStatus)
      .then(() => {
        this.props.setActivePanel(2);
        this.props.refreshData();
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

      // Close the "Are you sure" modal
      this.closeModal();
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
        {this.state.error}
        {this.state.flashMessage}

        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel='Are you sure you want to delete {enterprise.name}?'
        >

          <h2 className='modal__title' ref={subtitle => this.subtitle = subtitle}>
            {t('editEnterpriseForm:areYouSureDelete')} "{enterprise[currentLocale].name}"?
          </h2>

          <p>
            {t('editEnterpriseForm:youAreAboutToDelete')} "{enterprise[currentLocale].name}". {t('editEnterpriseForm:thisCannotBeUndone')}
          </p>

          <p>
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

              <EnterpriseAdmins enterpriseId={this.state.enterprise.id} />
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
