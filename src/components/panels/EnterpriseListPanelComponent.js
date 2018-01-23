'use strict';

import React from 'react';

import Loading from '../LoadingComponent';
import Back from '../BackComponent';

require('styles/panels/EnterpriseListPanel.scss');

class EnterpriseListPanelComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      enterprises: props.enterprises,
      status: props.status
    };
  }

  enterpriseClick(enterpriseId) {
    this.props.handleEnterpriseClick(enterpriseId);
  }

  componentWillReceiveProps(nextProps) {
    let newEnterprises = (nextProps.enterprises !== this.state.enterprises),
      newStatus = (nextProps.status !== this.state.status);

    if (newEnterprises || newStatus) {
      this.setState({
        enterprises: nextProps.enterprises,
        status: nextProps.status
      });
    }
  }

  render() {
    let jsx = [];
    const enterprises = this.state.enterprises;

    if (!enterprises) {
      return (<Loading />);
    }

    enterprises.map((enterprise) => {
      jsx.push(
        <li key={enterprise.id} onClick={this.enterpriseClick.bind(this, enterprise.id)}>
          {enterprise.name}
        </li>
      );
    });

    return (
      <div className="panel enterpriselistpanel-component">
        <Back />

        <ul>
          {jsx}
        </ul>
      </div>
    );
  }
}

EnterpriseListPanelComponent.displayName = 'PanelsEnterpriseListPanelComponent';

EnterpriseListPanelComponent.contextTypes = {
  'config': React.PropTypes.object,
  'logger': React.PropTypes.object
};

export default EnterpriseListPanelComponent;

