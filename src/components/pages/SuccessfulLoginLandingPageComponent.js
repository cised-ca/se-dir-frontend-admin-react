'use strict';

import React from 'react';
import { translate } from 'react-i18next';
import { browserHistory, Link } from 'react-router';

require('styles/pages/SuccessfulLoginLandingPage.scss');

class SuccessfulLoginLandingPageComponent extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (!this.props.isLoggedIn) {
      browserHistory.push('/admin');
    }
  }

  render() {
    return (
      <div className="successful-loginpage-component successful-login-page">
        Welcome / Bienvenue!

        // FIXME: what should the real link point to?
        <Link className='button--primary button' to='/admin/dashboard'>Continue in English</Link>
        <Link className='button--primary button' to='/admin/dashboard'>Continuer en Français</Link>

      </div>
    );
  }
}

SuccessfulLoginLandingPageComponent.displayName = 'PagesSuccessfulLoginLandingPageComponent';

SuccessfulLoginLandingPageComponent.contextTypes = {
  'config': React.PropTypes.object,
  'logger': React.PropTypes.object
};

export default translate('successfulLoginLandingPage')(SuccessfulLoginLandingPageComponent);
