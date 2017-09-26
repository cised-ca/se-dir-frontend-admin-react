'use strict';

import React from 'react';
import { translate } from 'react-i18next';

import {browserHistory} from 'react-router';

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
    let url  = apiRoot + '/account/logout';
    let component = this;

    fetch(url, {credentials: 'include'})
    .then(function(response) {
      if (response.ok) {
        component.props.setLoggedIn(false);
        browserHistory.push('/admin');
        return;
      }
      // TODO: handle the error!
      /* eslint-disable no-console */
      console.log('Got response ' + response.status);
      /* eslint-enable no-console */
    })
    .catch(err => {
      // TODO: handle the error!
      /* eslint-disable no-console */
      console.log(err);
      /* eslint-enable no-console */
    });
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
