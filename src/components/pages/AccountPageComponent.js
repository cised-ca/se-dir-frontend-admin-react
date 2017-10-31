'use strict';

import React from 'react';
import { Link, browserHistory } from 'react-router';
import { translate } from 'react-i18next';

import api from '../api/api.js';

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
    let currentApiRoot = this.context.config.api_root,
      newApiRoot = nextContext.config.api_root,
      doQuery;

    doQuery = (currentApiRoot !== newApiRoot);

    // If the api root is different than the previous
    // time we received props/context, trigger a new fetch
    if (doQuery) {
      this.getPermissions(newApiRoot);
    }
  }

  getPermissions(apiRoot) {
    if (!apiRoot) {
      return;
    }

    let component = this;

    api.getPermissions(apiRoot)
      .then(json => {
        component.props.setLoggedIn(true);
        component.parsePermissions(component, json);
      })
      .catch(error => {
        if (error.status === 403) {
          component.props.setLoggedIn(false);
          browserHistory.push('/admin');
        } else {
          this.context.logger.notify(error.message);
        }
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
    const { t } = this.props;
    let permissions = [];
    permissions.push(
      this.state.authenticatedEnterprises.map(function(enterprise) {
        return (
          <li className='permission-item' key={enterprise.id}>{enterprise.name || 'ID: ' + enterprise.id}
            <Link className="edit-enterprise" to={'/enterprise/' + enterprise.id}>{t('accountPage:edit')}</Link>
          </li>
        );
      })
    );
    return [
      (<p key="perms">{t('accountPage:editEnterprises')}</p>),
      (
      <ul className='permissions__list' key="permissions__list">
        {permissions}
      </ul>
      )];
  }

  renderLoading() {
    const { t } = this.props;

    return (<li key="loading" >{t('accountPage:loading')}</li>);
  }

  renderNoPermissions() {
    const { t } = this.props;

    return (<p>{t('accountPage:noPermissions')}</p>);
  }

  renderDirectoryAdmin() {
    const { t } = this.props;

    return (<p>{t('accountPage:editPermissions')}</p>);
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
    const { t } = this.props;
    let jsx = this.renderPermissions();

    return (
      <div className="accountpage-component page">
        <h1>{t('accountPage:account')}</h1>
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

export default translate('accountPage')(AccountPageComponent);
