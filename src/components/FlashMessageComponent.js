'use strict';

import React from 'react';

require('styles/FlashMessage.scss');

class FlashMessageComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messageIsOpen: true
    }

    this.closeMessage = this.closeMessage.bind(this);
  }

  closeMessage() {
    this.setState({
      messageIsOpen: false
    });
  }

  render() {
    const type = this.props.type || 'info',
        klass = 'flashmessage--' + type;

    return (
      <div className={'flashmessage-component ' + klass}>
        {this.props.children}
      </div>
    );
  }
}

FlashMessageComponent.displayName = 'FlashMessageComponent';

FlashMessageComponent.contextTypes = {
  'config': React.PropTypes.object,
  'logger': React.PropTypes.object
};

export default FlashMessageComponent;
