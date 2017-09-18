'use strict';

import React from 'react';
import {browserHistory} from 'react-router';

require('styles/Logout.scss');

class LogoutComponent extends React.Component {
  
  handleLogout(e) {
    e.preventDefault();
    this.performLogout();
  }

  performLogout() {
    let api_root = this.context.config.api_root;
    if (!api_root) {
      return;
    }
    let url  = api_root + '/account/logout';
    let component = this;

    fetch(url, {credentials: 'include'})
    .then(function(response) {
      if (response.ok) {
        component.props.setLoggedIn(false);
        browserHistory.push('/');
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
    return (
      <div className="logout-component">
        <button type="button" className="button--logout" onClick={this.handleLogout.bind(this)}>Sign Out</button>
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

export default LogoutComponent;
