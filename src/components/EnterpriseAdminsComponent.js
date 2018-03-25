'use strict';

import React from 'react';
import { translate } from 'react-i18next';

import FlashMessage from './FlashMessageComponent';
import ModalError from './ModalErrorComponent';

import api from '../api/api.js';

require('styles/EnterpriseAdmins.scss');

class EnterpriseAdminsComponent extends React.Component {
  constructor(props) {
    super(props);

    this.clearModalError = this.clearModalError.bind(this);
    this.handleUpdateAdmins = this.handleUpdateAdmins.bind(this);
    this.handleChangeAdmins = this.handleChangeAdmins.bind(this);

    this.state = {
      enterpriseId: props.enterpriseId
    }
  }

  clearModalError() {
    this.setState({
      error: null
    });
  }

  handleChangeAdmins(event) {
    this.setState({
      'admins': event.target.value
    });
  }

  componentDidMount() {
    const enterpriseId = this.state.enterpriseId;
    const apiRoot = this.context.config.api_root;

    api.getEnterpriseAdministrators(apiRoot, enterpriseId)
      .then(json => {
        this.setState({
          'admins': json.admin_emails.join('\n')
        });
      })
      .catch(error => {
        this.context.logger.notify(error.message);
      });
  }

  handleUpdateAdmins(event) {
    event.preventDefault();

    const { t } = this.props;
    const enterpriseId = this.state.enterpriseId;
    const apiRoot = this.context.config.api_root;
    const newAdmins = {
      'admin_emails': this.state.admins.split('\n')
    };

    api.updateEnterpriseAdministrators(apiRoot, enterpriseId, newAdmins)
      .then(() => {
        const flashMessage = (
          <FlashMessage type="success">
            {t('common:updateEnterpriseAdminsSuccess')}
          </FlashMessage>
        );

        this.setState({
          flashMessage: flashMessage
        });
      })
      .catch(error => {
        const errorModal = (
          <ModalError isOpen={true}>
            <p>{error.message}</p>
          </ModalError>
        );

        this.setState({
          error: errorModal
        });
    });
  }

  render() {
    const { t } = this.props;
    const flashMessage = this.state.flashMessage;
    const error = this.state.error;

    return (
      <div className="enterpriseadmins-component">
        {flashMessage}
        {error}

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
