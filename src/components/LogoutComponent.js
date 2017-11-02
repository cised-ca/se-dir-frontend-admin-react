'use strict';

import React from 'react';
import { translate } from 'react-i18next';

import {browserHistory} from 'react-router';

import api from './api/api.js';

require('styles/Logout.scss');

class LogoutComponent extends React.Component {

  handleLogout(e) {
    e.preventDefault();
    this.performLogout();
  }

  performLogout() {
    let apiRoot = this.context.config.api_root;

    if (!apiRoot) {
      return;
    }

    api.logout(apiRoot)
      .then(() => {
        this.props.setLoggedIn(false);
        browserHistory.push('/admin');
      })
      .catch((error) => {
        this.props.setLoggedIn(false);
        browserHistory.push('/admin');
        this.context.logger.notify('Error while logging out: ' + error.message);
      })
  }

  render() {
    const { t } = this.props;

    return (
      <div className="logout-component">
        <button type="button" className="button--logout" onClick={this.handleLogout.bind(this)}>{t('logout:signOut')}</button>
      </div>
    );
  }
}

LogoutComponent.displayName = 'LogoutComponent';

LogoutComponent.contextTypes = {
  'config': React.PropTypes.object,
  'logger': React.PropTypes.object
};

// Uncomment properties you need
// LogoutComponent.propTypes = {};
// LogoutComponent.defaultProps = {};

export default translate('logout')(LogoutComponent);
