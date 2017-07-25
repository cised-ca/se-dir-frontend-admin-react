'use strict';

import React from 'react';

require('styles/Status.scss');

class StatusComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.name,
      count: props.enterprises.length
    }

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // Pass this up to StatusList component
    this.props.onStatusClick(this.props.enterprises, this.state.name);
  }

  componentWillReceiveProps(nextProps) {
    const count = nextProps.enterprises.length;

    if (count !== this.state.count) {
      this.setState({
        count: count
      });
    }
  }

  render() {
    return (
      <div className="status-component status" onClick={this.handleClick}>
        <span className="name">{this.state.name}</span>&nbsp;
        (<span className="count">{this.state.count}</span>)
      </div>
    );
  }
}

StatusComponent.contextTypes = {
  'config': React.PropTypes.object,
  'logger': React.PropTypes.object
};

StatusComponent.displayName = 'StatusComponent';

export default StatusComponent;
