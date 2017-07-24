'use strict';

import React from 'react';

require('styles/panels/EnterpriseDetailsPanel.scss');

class EnterpriseDetailsPanelComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = props.enterprise;
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmitForm = this.handleSubmitForm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.enterprise.name !== this.props.enterprise.name) {
      this.setState(nextProps.enterprise);
    }
  }

  handleSubmitForm(event) {
    event.preventDefault();

    let enterprise = this.state;
    const endpoint = this.context.config.api_root + '/enterprise/' + enterprise.id;

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    delete enterprise.id;
    delete enterprise.locations;

    // FIXME : handle 'fr' language
    enterprise = {
      en: enterprise
    };

    const request = new Request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(enterprise),
      headers: headers
    });

    fetch(request)
      .then((response) => {
        // TODO: Display success
      })
      .catch((error) => {
        // TODO: Display error
      });
  }

  handleInputChange(event) {
    const target = event.target;

    this.setState({
      [target.name]: target.value
    });
  }

  render() {
    const enterprise = this.state;

    // TODO: Add missing fields
    return (
      <div className="panel panel--wide enterprisedetailspanel-component">
        <h1>{enterprise.name}</h1>

        <form onSubmit={this.handleSubmitForm}>
          <label>
            Enterprise name:
            <input
              name="name"
              onChange={this.handleInputChange}
              required
              value={enterprise.name} />
          </label>

          <label>
            Short description:
            <input
              name="short_description"
              onChange={this.handleInputChange}
              value={enterprise.short_description} />
          </label>

          <label>
            Description:
            <textarea
              name="description"
              onChange={this.handleInputChange}
              value={enterprise.description} />
          </label>

          <label>
            Year started:
            <input
              name="year_started"
              onChange={this.handleInputChange}
              value={enterprise.year_started} />
          </label>

          <label>
            Offering:
            <input
              name="offering"
              onChange={this.handleInputChange}
              value={enterprise.offering} />
          </label>

          <label>
            Website:
            <input
              name="website"
              onChange={this.handleInputChange}
              type="url"
              value={enterprise.website} />
          </label>

          <label>
            Facebook username:
            <input
              name="facebook"
              onChange={this.handleInputChange}
              value={enterprise.facebook} />
          </label>

          <label>
            Instagram username:
            <input
              name="instagram"
              onChange={this.handleInputChange}
              value={enterprise.instagram} />
          </label>

          <label>
            Twitter username:
            <input
              name="twitter"
              onChange={this.handleInputChange}
              value={enterprise.twitter} />
          </label>

          <input type="submit" value="Save" />
        </form>
      </div>
    );
  }
}

EnterpriseDetailsPanelComponent.displayName = 'PanelsEnterpriseDetailsPanelComponent';

EnterpriseDetailsPanelComponent.contextTypes = {
  'config': React.PropTypes.object,
  'logger': React.PropTypes.object
};

export default EnterpriseDetailsPanelComponent;
