'use strict';

import React from 'react';
import { translate } from 'react-i18next';

import FlashMessage from './FlashMessageComponent';
import ModalError from './ModalErrorComponent';

import api from './api/api.js';

require('styles/UploadLogo.scss');

class UploadLogoComponent extends React.Component {
  constructor(props) {
    super(props);

    this.clearModalError = this.clearModalError.bind(this);
    this.handleUploadLogo = this.handleUploadLogo.bind(this);
    this.handleChangeLogo = this.handleChangeLogo.bind(this);
    this.handleDeleteLogo = this.handleDeleteLogo.bind(this);

    this.state = {
      enterpriseId: props.enterpriseId
    }
  }

  componentDidMount() {
    const enterpriseId = this.state.enterpriseId;
    const apiRoot = this.context.config.api_root;

    api.getEnterpriseLogo(apiRoot, enterpriseId)
      .then(blob => {
        this.setState({
          'logo': URL.createObjectURL(blob),
          'mimetype': blob.type,
          'updateMethod': 'PUT'
        });
      })
      .catch(error => {
        this.context.logger.notify('Could not fetch logo: ' + error.message);
      });
  }

  clearModalError() {
    this.setState({
      error: null
    });
  }

  handleDeleteLogo() {
    const { t } = this.props;
    const enterpriseId = this.state.enterpriseId;
    const apiRoot = this.context.config.api_root;

    api.deleteEnterpriseLogo(apiRoot, enterpriseId)
      .then(() => {
        const flashMessage = (
          <FlashMessage type="success">
            {t('common:deleteLogoSuccess')}
          </FlashMessage>
        );

        this.setState({
          'logo': null,
          'mimetype': null,
          'updateMethod': 'POST',
          'flashMessage': flashMessage
        });
      })
      .catch(error => {
        const errorModal = (
          <ModalError clearError={this.clearModalError}>
            {t('common:deleteLogoError')} "{error.message}"
          </ModalError>
        );

        this.setState({
          error: errorModal
        });
      });
  }

  handleChangeLogo(event) {
    const validMimetypes = [
      'image/png',
      'image/gif',
      'image/jpeg',
      'image/svg+xml'
    ];

    const { t } = this.props;
    const files = event.target.files;

    if ( files.length === 0) {
      const flashMessage = (
        <FlashMessage type="error">
          {t('common:noFilesSelected')}
        </FlashMessage>
      );

      this.setState({
        'flashMessage': flashMessage
      });

      return;
    }

    const file = files[ 0 ];

    if ( !validMimetypes.includes( file.type ) ) {
      const flashMessage = (
        <FlashMessage type="error">
          {t('common:invalidFileType')}
        </FlashMessage>
      );

      this.setState({
        'flashMessage': flashMessage
      });

      return;
    }

    const reader = new FileReader();

    reader.addEventListener('load', () => {
      this.setState({
        'logo': reader.result,
        'mimetype': file.type
      });
    });

    reader.readAsDataURL( file );
  }

  handleUploadLogo(event) {
    event.preventDefault();

    const { t } = this.props;
    const enterpriseId = this.state.enterpriseId;
    const updateMethod = this.state.updateMethod || 'POST';
    const logoBase64URL = this.state.logo;
    const mimetype = this.state.mimetype;
    const apiRoot = this.context.config.api_root;

    if (!logoBase64URL) {
      this.logoPicker.click();

      return;
    }

    const logoBase64 = logoBase64URL.replace( 'data:' + mimetype + ';base64,', '');

    let enterpriseLogo = {
      'content_type': mimetype,
      'logo': logoBase64
    };

    api.updateEnterpriseLogo(apiRoot, enterpriseId, enterpriseLogo, updateMethod)
      .then(() => {
        const flashMessage = (
          <FlashMessage type="success">
            {t('common:updateLogoSuccess')}
          </FlashMessage>
        );

        this.setState({
          flashMessage: flashMessage
        });
      })
      .catch(error => {
        const errorModal = (
          <ModalError clearError={this.clearModalError}>
            {t('common:updateLogoError')} "{error.message}"
          </ModalError>
        );

        this.setState({
          error: errorModal
        });
      });
  }

  render() {
    const logoPreview = this.state.logo || '/admin/images/logo-placeholder.png';
    const { t } = this.props;
    const flashMessage = this.state.flashMessage;
    const error = this.state.error;

    return (
      <div className="uploadlogo-component">
        {flashMessage}
        {error}

        <h2>{t('uploadLogo:logo')}</h2>

        <label ref={logoPicker => this.logoPicker = logoPicker}>
          <img className="logo-preview" src={logoPreview} />

          <input accept="image/png, image/gif, image/jpeg, image/svg+xml"
            onChange={this.handleChangeLogo} type="file" />
        </label>

        <div>
          <input className='button button--primary' type="submit"
            onClick={this.handleUploadLogo} value={t('uploadLogo:updateLogo')} />

          <input className='button button--destructive' name='delete'
            onClick={this.handleDeleteLogo}
            type='button' value={t('uploadLogo:deleteLogo')} />
        </div>
      </div>
    );
  }
}

UploadLogoComponent.displayName = 'UploadLogoComponent';

UploadLogoComponent.contextTypes = {
  'config': React.PropTypes.object,
  'logger': React.PropTypes.object
};

export default translate('uploadLogo')(UploadLogoComponent);
