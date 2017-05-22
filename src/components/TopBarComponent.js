'use strict';

import React from 'react';

require('styles/TopBar.scss');

class TopBarComponent extends React.Component {
  render() {
    return (
      <div className="topbar-component top-bar">
        <header>
          <h1>Admin Dashboard</h1>
        </header>
      </div>
    );
  }
}

TopBarComponent.displayName = 'TopBarComponent';

export default TopBarComponent;
