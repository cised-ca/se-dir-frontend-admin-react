'use strict';

import React from 'react';

import {Link} from 'react-router';
import Logout from './LogoutComponent';

require('styles/TopBar.scss');

class TopBarComponent extends React.Component {
  createAccountNav() {
    let loggedIn = this.props.isLoggedIn;
    let jsx = [];
    if (loggedIn) {
      jsx = (
        <nav className="nav nav--top">
          <ul className="nav__items">
            <li className="nav__item" key="Account">
              <Link className="nav__link" to="/account">Account</Link>
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
    return (
      <div className="topbar-component top-bar">
        <header>
          <h1>Admin Dashboard</h1>
                {accountNav}
        </header>
      </div>
    );
  }
}

TopBarComponent.displayName = 'TopBarComponent';

export default TopBarComponent;
