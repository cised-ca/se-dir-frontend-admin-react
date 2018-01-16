'use strict';

import React from 'react';
import {Link} from 'react-router';
import { translate } from 'react-i18next';

import Logout from './LogoutComponent';

require('styles/TopBar.scss');

class TopBarComponent extends React.Component {
  createAccountNav() {
    let loggedIn = this.props.isLoggedIn;
    let jsx = [];
    const { t } = this.props;

    if (loggedIn) {
      jsx = (
        <nav className="nav nav--top">
          <ul className="nav__items">
            <li className="nav__item" key="CreateEnterprise">
              <Link className="nav__link" to="/admin/create">{t('topBar:createEnterprise')}</Link>
            </li>
            <li className="nav__item" key="DirectoryAdmins">
              <Link className="nav__link" to="/admin/directory-admins">{t('topBar:directoryAdmins')}</Link>
            </li>
            <li className="nav__item" key="Account">
              <Link className="nav__link" to="/admin/account">{t('topBar:account')}</Link>
            </li>
            <li className="nav__item nav__item--logout" key="SignOut">
              <Logout className="nav__link" setLoggedIn={this.props.setLoggedIn}/>
            </li>
          </ul>
        </nav>
      );
    }
    return jsx;
  }

  render() {
    let accountNav = this.createAccountNav();
    const { t } = this.props;

    return (
      <div className="topbar-component top-bar">
        <header className="site-header">
          <h1 className="top-bar__title">
            <Link to="/admin">{t('topBar:adminDashboard')}</Link>
          </h1>

          {accountNav}
        </header>
      </div>
    );
  }
}

TopBarComponent.displayName = 'TopBarComponent';

export default translate('topBar')(TopBarComponent);
