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
            <li className="nav__item" key="Account">
              <Link className="nav__link" to="/account">{t('topBar:account')}</Link>
            </li>
            <li className="nav__item" key="SignOut">
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
        <header>
          <h1>{t('topBar:adminDashboard')}</h1>
                {accountNav}
        </header>
      </div>
    );
  }
}

TopBarComponent.displayName = 'TopBarComponent';

export default translate('topBar')(TopBarComponent);
