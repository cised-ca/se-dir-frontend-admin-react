'use strict';

import React from 'react';
import { Link, browserHistory } from 'react-router';


class AccountPageComponent extends React.Component {

  constructor() {
    super();
    this.state = {
      loaded: false,
      directoryAdmin: false,
      authenticatedEnterprises: []
    };
  }

  componentDidMount() {
    this.setState({loaded: false});
    this.getPermissions(this.context.config.api_root);
  }

  /**
   * Called before receiving new props
   */
  componentWillReceiveProps(nextProps, nextContext) {
    let current_api_root = this.context.config.api_root,
      new_api_root = nextContext.config.api_root,
      do_query;

    do_query = (current_api_root !== new_api_root);

    // If the api root is different than the previous
    // time we received props/context, trigger a new fetch
    if (do_query) {
      this.getPermissions(new_api_root);
    }
  }

  getPermissions(api_root) {
    if (!api_root) {
      return;
    }
    let url  = api_root + '/account/permissions';
    let component = this;

    fetch(url, {credentials: 'include'})
    .then(function(response) {
      if (response.ok) {
        response.json().then(function(json) {
          component.props.setLoggedIn(true);
          component.parsePermissions(component, json);
          return;
        });
        return;
      }
      if (response.status == 403) {
        // IF we get a 403 error, it means we're not logged in.
        // Set logged in to false and redirect to login page
        component.props.setLoggedIn(false);
        browserHistory.push('/login');
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

  parsePermissions(component, permissions) {
    if (!permissions) {
      return;
    }

    if (permissions.directoryAdmin) {
      component.setState({directoryAdmin: true});
    }
    if (permissions.authenticatedEnterprises) {
      component.setState({authenticatedEnterprises: permissions.authenticatedEnterprises});
    }
    component.setState({loaded: true});
  }

  hasNoPermissions() {
    if (!this.state.directoryAdmin && this.state.authenticatedEnterprises.length == 0) {
      return true;
    }
    return false;
  }

  renderAuthenticatedEnterprises() {
    let permissions = [];
    permissions.push(
      this.state.authenticatedEnterprises.map(function(enterprise) {
        return (
          <li className='permission-item' key={enterprise.id}>{enterprise.name || 'ID: ' + enterprise.id}
            <Link className="edit-enterprise" to={'/enterprise/' + enterprise.id}>Edit</Link>
          </li>
        );
      })
    );
    return [
      (<p key="perms">You have permission to edit the following enterprises:</p>),
      (
      <ul className='permissions__list' key="permissions__list">
        {permissions}
      </ul>
      )];
  }

  renderLoading() {
    return (<li key="loading" >Loading...</li>);
  }

  renderNoPermissions() {
    return (<p>You currently have no permissions in the directory</p>);
  }

  renderDirectoryAdmin() {
    return (<p>You have permission to edit the whole directory</p>);
  }

  renderPermissions() {
    if (!this.state.loaded) {
      return this.renderLoading();
    }
    if (this.hasNoPermissions()) {
      return this.renderNoPermissions();
    }
    if (this.state.directoryAdmin) {
      return this.renderDirectoryAdmin();
    }
    return this.renderAuthenticatedEnterprises();
  }

  render() {
    let jsx = this.renderPermissions();

    return (
      <div className="accountpage-component page">
        <h1>Account</h1>
        {jsx}
      </div>
    );
  }
}

AccountPageComponent.contextTypes = {
  'config': React.PropTypes.object,
  'logger': React.PropTypes.object
};

AccountPageComponent.displayName = 'AccountPageComponent';

// Uncomment properties you need
// AccountPageComponent.propTypes = {};
// AccountPageComponent.defaultProps = {};

export default AccountPageComponent;
