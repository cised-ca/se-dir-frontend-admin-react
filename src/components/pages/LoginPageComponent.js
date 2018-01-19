'use strict';

import React from 'react';
import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';

require('styles/pages/LoginPage.scss');

class LoginPageComponent extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (this.props.isLoggedIn) {
      browserHistory.push('/admin/dashboard');
    }
  }

  render() {
    const apiRoot = this.context.config.api_root;
    const { t } = this.props;

    return (
      <div className="loginpage-component login-page">
        <div className="login-form">
          <h1 className="login-form__title">{t('loginPage:loginWith')}</h1>

          <div className="login-form__content">
          <a role="button" className="button button--login" href={apiRoot + '/account/login/facebook'}>
                  <img className="login__icon" src="/admin/images/facebook.png" alt="" />
          </a>
          <a role="button" className="button button--login" href={apiRoot + '/account/login/google'}>
                  <img className="login__icon" src="/admin/images/google.png" alt="" />
          </a>
          <a role="button" className="button button--login" href={apiRoot + '/account/login/twitter'}>
                  <img className="login__icon" src="/admin/images/twitter.png" alt="" />
          </a>
          </div>
        </div>
      </div>
    );
  }
}

LoginPageComponent.displayName = 'PagesLoginPageComponent';

LoginPageComponent.contextTypes = {
  'config': React.PropTypes.object,
  'logger': React.PropTypes.object
};

export default translate('loginPage')(LoginPageComponent);
