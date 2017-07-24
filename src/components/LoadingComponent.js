'use strict';

import React from 'react';

class LoadingComponent extends React.Component {
  render() {
    return (
      <div className="loading-component">
        <p>Loading...</p>
      </div>
    );
  }
}

LoadingComponent.displayName = 'LoadingComponent';

export default LoadingComponent;
