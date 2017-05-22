'use strict';

import React from 'react';

import { Link } from 'react-router';

require('styles/pages/LoginPage.scss');

class LoginPageComponent extends React.Component {
  render() {
    return (
      <div className="loginpage-component login-page">
        <div className="login-form">
          <h1 className="login-form__title">Login With</h1>

          <div className="login-form__content">
            <Link to="/dashboard">Facebook</Link>
            <Link to="/dashboard">Google</Link>
            <Link to="/dashboard">Twitter</Link>
          </div>
        </div>
      </div>
    );
  }
}

LoginPageComponent.displayName = 'PagesLoginPageComponent';

export default LoginPageComponent;

