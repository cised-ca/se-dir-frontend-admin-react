'use strict';

import React from 'react';
import Modal from 'react-modal';
import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.scss';

import EnterpriseFormFields from './EnterpriseFormFieldsComponent';
import EnterpriseMap from './EnterpriseMapComponent';
import UploadLogo from './UploadLogoComponent';
import EnterpriseAdmins from './EnterpriseAdminsComponent';
import FlashMessage from './FlashMessageComponent';
import ModalError from './ModalErrorComponent';

import api from '../api/api.js';

Modal.setAppElement('#app');

require('styles/EditEnterpriseForm.scss');

class EditEnterpriseFormComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      enterprise: props.enterprise,
      enterpriseStatus: props.enterpriseStatus,
      modalIsOpen: false,
      selectedTab: 0
    }

    this.closeModal = this.closeModal.bind(this);
    this.clearModalError = this.clearModalError.bind(this);
    this.deleteEnterprise = this.deleteEnterprise.bind(this);
    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.handleDeleteEnterprise = this.handleDeleteEnterprise.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleTabSelect = this.handleTabSelect.bind(this);
    this.handlePublishEnterprise = this.handlePublishEnterprise.bind(this);
    this.handleUnpublishEnterprise = this.handleUnpublishEnterprise.bind(this);
    this.handlePendingEnterprise = this.handlePendingEnterprise.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleLocationSubmit = this.handleLocationSubmit.bind(this);
    this.deleteLocation = this.deleteLocation.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.enterprise.id !== this.props.enterprise.id) {
      this.setState({
        enterprise: nextProps.enterprise,
        flashMessage: null,
        selectedTab: 0
      });
    }
  }

  clearModalError() {
      this.setState({
        error: null
    });
  }

  handleLocationChange(event) {
    const target = event.target;

    let value = target.value;

    if (!value) {
      value = '';
    }

    this.setState({newLocation: value});
  }

  handleLocationSubmit() {
    const apiRoot = this.context.config.geo_api_root;
    const { t } = this.props;
    let newLocation = this.state.newLocation;

    if (newLocation) {
      newLocation = newLocation.toUpperCase();

      api.getLatLonFromPostalCode(apiRoot, newLocation)
        .then((locationDetails) => {
          const lat = locationDetails.latitude;
          const lon = locationDetails.longitude;
          const coords = [parseFloat(lon), parseFloat(lat)];

          this.submitForm(coords);
        })
        .catch((error) => {
          let errorMessage = error.message;

          if (error.status === 404) {
            errorMessage = t('editEnterpriseFormComponent:postalCodeNotFound');
          }

          const errorModal = (
            <ModalError clearError={this.clearModalError}>
              {t('common:enterpriseEditError')} "{errorMessage}"
            </ModalError>
          );

          this.setState({
            error: errorModal
          });
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

    if (this.state.enterpriseStatus === 'published') {
      tabs.push(<Tab>{t('editEnterpriseForm:settings')}</Tab>);
    }

    return tabs;
  }

  deleteLocation(index) {
    this.state.enterprise.locations.coordinates.splice(index, 1);

    this.submitForm();
  }

  buildLocations() {
    const { t } = this.props;
    let newLocation = this.state.newLocation || '';

    let jsx = (
      <div className='admin-feature locations'>
        <h2>{t('editEnterpriseForm:locations')}</h2>

        <div className='locations__map'>
          <EnterpriseMap enterprise={this.state.enterprise} deleteLocation={this.deleteLocation} redrawMap={this.state.redrawMap} />
        </div>

        <div className='locations__new'>
          <label>{t('editEnterpriseForm:addNewLocation')}<br />
            {t('editEnterpriseForm:locationCode')}<br />

            <input type='text'
              name='newLocation'
              onChange={this.handleLocationChange}
              placeholder='K2K'
              maxLength='3'
              value={newLocation} />
          </label>

          <input className='button button--primary' name='addLocation'
            onClick={this.handleLocationSubmit} type='button' value={t('editEnterpriseForm:addLocation')} />
        </div>
      </div>
    );

    return jsx;
  }

  fillTabPanels() {
    const locales = this.context.config.locales;
    const { t } = this.props;
    const locations = this.buildLocations();

    const panels = locales.map((locale) => {
      const enterprise = this.state.enterprise[locale.locale];
      const enterpriseFormFields = <EnterpriseFormFields enterprise={enterprise}
                                     locale={locale.locale} updateParent={this.handleFormChange} />

      return (
        <TabPanel key={'enterprise-' + locale.locale}>
          <h1>{enterprise.name}</h1>

          {enterpriseFormFields}
        </TabPanel>
      );
    });

    if (this.state.enterpriseStatus === 'published') {
      panels.push(
        <TabPanel>
          <div className='admin-feature'>
            <h1>{t('editEnterpriseForm:settings')}</h1>

            <UploadLogo enterpriseId={this.state.enterprise.id} />
          </div>

          {locations}

          <EnterpriseAdmins enterpriseId={this.state.enterprise.id} />
        </TabPanel>
      );
    }

    return panels;
  }

  handleUnpublishEnterprise() {
    const apiRoot = this.context.config.api_root;
    const enterprise = this.state.enterprise;
    const { t } = this.props;

    let backendEnterprise = {
      en: enterprise.en,
      fr: enterprise.fr,
      locations: enterprise.locations
    }

    api.unpublishEnterprise(apiRoot, enterprise.id, backendEnterprise)
      .then( () => {
        browserHistory.push('/admin');
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

  handlePublishEnterprise() {
    const apiRoot = this.context.config.api_root;
    const enterprise = this.state.enterprise;
    const enterpriseStatus = this.state.enterpriseStatus;
    const { t } = this.props;

    let backendEnterprise = {
      en: enterprise.en,
      fr: enterprise.fr,
      locations: enterprise.locations
    }

    api.publishEnterprise(apiRoot, enterprise.id, enterpriseStatus, backendEnterprise)
      .then( () => {
        browserHistory.push('/admin');
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

  handleTabSelect(index) {
    let redrawMap = false;

    if (index === 2) {
      redrawMap = true;
    }

    this.setState({
      'selectedTab': index,
      'redrawMap': redrawMap
    });
  }

  handleFormChange(fieldsState) {
    let newState = {};
    newState[fieldsState.locale] = fieldsState.enterprise;

    this.setState(newState);
  }

  handleSubmitForm(event) {
    event.preventDefault();

    this.submitForm();
  }

  submitForm(newLocation) {
    const { t } = this.props;
    const apiRoot = this.context.config.api_root;
    const enterprise = this.state.enterprise;
    const enterpriseStatus = this.state.enterpriseStatus;
    let updatedEnterprise = {};

    updatedEnterprise.locations = enterprise.locations;

    if (newLocation) {
      updatedEnterprise.locations.coordinates.push(newLocation);
    }

    const locales = this.context.config.locales;
    locales.map((locale) => {
      updatedEnterprise[locale.locale] = enterprise[locale.locale];
    });

    api.editEnterprise(apiRoot, enterprise.id, enterpriseStatus, updatedEnterprise)
      .then(() => {
          const flashMessage = (
            <FlashMessage type="success">
              {t('common:enterpriseEditSucess')}
            </FlashMessage>
          );

          this.setState({
            flashMessage: flashMessage,
            newLocation: null
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

  handlePendingEnterprise() {
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

    api.editEnterprise(apiRoot, enterprise.id, 'pending', updatedEnterprise)
      .then(() => {
        browserHistory.push('/admin');
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
        this.props.refreshData();
        browserHistory.push('/admin');
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
    let extraButtons = null;
    let nonAdminButtons = null;

    const { t } = this.props;
    const enterpriseStatus = this.state.enterpriseStatus;

    if ( enterpriseStatus === 'unpublished' || enterpriseStatus ===  'pending' ) {
      extraButtons = (
        <input className='button button--default admin-feature admin-feature--inline-block' name='publish'
          onClick={this.handlePublishEnterprise} type='button' value={t('editEnterpriseForm:publish')} />
      );
    } else if ( enterpriseStatus === 'published' ) {
      extraButtons = (
        <input className='button button--default' name='unpublish'
          onClick={this.handleUnpublishEnterprise} type='button' value={t('editEnterpriseForm:unpublish')} />
      );
    }

    if (enterpriseStatus !== 'pending') {
      nonAdminButtons = (
        <input className='button button--primary' name='pending' onClick={this.handlePendingEnterprise}
          type='button' value={t('editEnterpriseForm:submitForApproval')} />
      );
    } else {
      nonAdminButtons = (
        <input className='button button--primary' type='button' onClick={this.handlePendingEnterprise}
          value={t('editEnterpriseForm:save')} />
      );
    }

    if ( this.state.selectedTab !== 2 ) {
      jsx = (
        <div>
          <div className='admin-feature'>
            {extraButtons}

            <input className='button button--primary' type='submit' value={t('editEnterpriseForm:save')} />

            <input className='button button--destructive'
              name='delete' onClick={this.handleDeleteEnterprise} type='button'
              value={t('editEnterpriseForm:delete')} />
          </div>

          <div className='non-admin-buttons'>
            {nonAdminButtons}
          </div>
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
          <Tabs selectedIndex={this.state.selectedTab} onSelect={this.handleTabSelect}>
            <TabList>
              {tabs}
            </TabList>

            {panels}

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
