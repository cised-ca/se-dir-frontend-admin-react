'use strict';

import React from 'react';
import { translate } from 'react-i18next';

import 'whatwg-fetch';

require('styles/UploadLogo.scss');

class UploadLogoComponent extends React.Component {
  constructor(props) {
    super(props);

    this.handleUploadLogo = this.handleUploadLogo.bind(this);
    this.handleChangeLogo = this.handleChangeLogo.bind(this);
    this.handleDeleteLogo = this.handleDeleteLogo.bind(this);

    this.state = {
      enterpriseId: props.enterpriseId
    }
  }

  componentDidMount() {
    const enterpriseId = this.state.enterpriseId;
    const endpoint = this.context.config.api_root + '/enterprise/' +
      enterpriseId + '/logo';

    fetch(endpoint, {credentials: 'same-origin'})
      .then((response) => {
        if (response.ok) {
          response.blob()
            .then((blob) => {
              this.setState({
                'logo': URL.createObjectURL(blob),
                'mimetype': blob.type,
                'updateMethod': 'PUT'
              });
            });
        }
      })
      .catch((error) => {
        // TODO: Display error
      });
  }

  handleDeleteLogo() {
    const enterpriseId = this.state.enterpriseId;
    const endpoint = this.context.config.api_root + '/enterprise/' +
      enterpriseId + '/logo';

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const request = new Request(endpoint, {
      method: 'DELETE',
      headers: headers
    });

    fetch(request, {credentials: 'same-origin'})
      .then((response) => {
        // TODO: Display success

        this.setState({
          'logo': null,
          'mimetype': null,
          'updateMethod': 'POST'
        });
      })
      .catch((error) => {
        // TODO: Display error
      });
  }

  handleChangeLogo(event) {
    const validMimetypes = [
      'image/png',
      'image/gif',
      'image/jpeg',
      'image/svg+xml'
    ];

    const files = event.target.files;

    if ( files.length === 0) {
      // TODO: display error
      console.log( 'No files selected' );

      return;
    }

    const file = files[ 0 ];

    if ( !validMimetypes.includes( file.type ) ) {
      // TODO: display error
      console.log( 'Invalid file type' );

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

    const enterpriseId = this.state.enterpriseId;
    const updateMethod = this.state.updateMethod || 'POST';
    const logoBase64URL = this.state.logo;
    const mimetype = this.state.mimetype;
    const endpoint = this.context.config.api_root + '/enterprise/' +
      enterpriseId + '/logo';

    const logoBase64 = logoBase64URL.replace( 'data:' + mimetype + ';base64,', '');

    let enterpriseLogo = {
      'content_type': mimetype,
      'logo': logoBase64
    };

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const request = new Request(endpoint, {
      method: updateMethod,
      body: JSON.stringify(enterpriseLogo),
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
    const logoPreview = this.state.logo || '/admin/images/logo-placeholder.png';
    const { t } = this.props;

    return (
      <div className="uploadlogo-component">
        <h2>{t('uploadLogo:logo')}</h2>

        <label>
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
