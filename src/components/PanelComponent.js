'use strict';

import React from 'react';

require('styles/Panel.scss');

class PanelComponent extends React.Component {
  render() {
    return (
      <div className="panel-component panel">
        {this.props.children}
      </div>
    );
  }
}

PanelComponent.displayName = 'PanelComponent';

export default PanelComponent;
