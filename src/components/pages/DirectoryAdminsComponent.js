'use strict';

import React from 'react';

require('styles/pages/DirectoryAdmins.scss');

import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';

import api from '../../api/api.js';

import Back from '../BackComponent';
import Loading from '../LoadingComponent';
import FlashMessage from '../FlashMessageComponent';
import ModalError from '../ModalErrorComponent';

class DirectoryAdminsComponent extends React.Component {
  constructor(props) {
    super(props);

    this.handleAdminsChange = this.handleAdminsChange.bind(this);
    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.handleCancelForm = this.handleCancelForm.bind(this);

    this.state = {
      admins: null,
      flashMessage: null
    };
  }

  componentDidMount() {
    api.getDirectoryAdministrators(this.context.config.api_root)
      .then((admins) => {

        const emails = admins.map((admin) => {
          return admin.email;
        });

        this.setState({
          admins: emails.join('\n')
        });
      });
  }

  handleAdminsChange(event) {
    const target = event.target;

    this.setState({
      admins: target.value
    });
  }

  handleSubmitForm(event) {
    event.preventDefault();

    const { t } = this.props;
    const textareaVal = this.state.admins.split('\n');
    const newAdmins = textareaVal.map((email) => {
      return {
        email: email
      };
    });

    api.updateDirectoryAdministrators(this.context.config.api_root, newAdmins)
      .then(() => {
        const flashMessage = (
          <FlashMessage type="success">
            {t('directoryAdmins:updateDirectoryAdminsSuccess')}
          </FlashMessage>
        );

        this.setState({
          flashMessage: flashMessage
        });
      })
      .catch(error => {
        const errorModal = (
          <ModalError>
            <p>{error.message}</p>
          </ModalError>
        );

        this.setState({
          error: errorModal
        });
    });
  }

  handleCancelForm() {
    browserHistory.goBack();
  }

  render() {
    const { t } = this.props;
    const state = this.state;
    const admins = state.admins;
    const flashMessage = state.flashMessage;

    let jsx = [];

    if (admins === null) {
      jsx.push(<Loading key='loading' />);
    } else {
      jsx.push(
        <form key='directory-admins-form' onSubmit={this.handleSubmitForm}>
          {flashMessage}

          <label>
            {t('directoryAdmins:admins')}
            <textarea
              name='admins'
              onChange={this.handleAdminsChange}
              value={admins || ''} />
          </label>

          <div>
            <input className='button button--primary' type='submit' value={t('directoryAdmins:save')} />

            <input className='button button--default' name='cancel'
              onClick={this.handleCancelForm}
              type='button' value={t('directoryAdmins:cancel')} />
          </div>
        </form>
      );
    }

    return (
      <div className="directoryadmins-component page">
        <Back />

        {jsx}
      </div>
    );
  }
}

DirectoryAdminsComponent.displayName = 'DirectoryAdminsComponent';

DirectoryAdminsComponent.contextTypes = {
  'config': React.PropTypes.object,
  'logger': React.PropTypes.object
};

export { DirectoryAdminsComponent };
export default translate('directoryAdmins')(DirectoryAdminsComponent);

