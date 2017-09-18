'use strict';

import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#app');

require('styles/EnterpriseForm.scss');

class EnterpriseFormComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      enterprise: props.enterprise,
      locale: props.locale,
      modalIsOpen: false
    }

    this.closeModal = this.closeModal.bind(this);
    this.deleteEnterprise = this.deleteEnterprise.bind(this);
    this.handleStringInputChange = this.handleStringInputChange.bind(this);
    this.handleNumberInputChange = this.handleNumberInputChange.bind(this);
    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.handleDeleteEnterprise = this.handleDeleteEnterprise.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.enterprise.name !== this.props.enterprise.name) {
      this.setState({
        enterprise: nextProps.enterprise
      });
    }
  }

  handleSubmitForm(event) {
    event.preventDefault();

    let enterprise = this.state.enterprise;
    const locale = this.state.locale;
    const endpoint = this.context.config.api_root + '/enterprise/' + enterprise.id;
    let enterprise_final = {};

    let enterprise_copy = Object.assign({}, enterprise);

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    delete enterprise_copy.id;
    delete enterprise_copy.locations;

    enterprise_final[locale] = enterprise_copy;
    
    const request = new Request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(enterprise_final),
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

  handleNumberInputChange(event) {
    const target = event.target;

    const filterInt = function(value) {
      if (/^([0-9]+)$/.test(value))
        return Number(value);
      return NaN;
    }

    const number = filterInt(target.value);

    if (isNaN(number)) {
      return;
    }

    let curr_enterprise = this.state.enterprise;
    curr_enterprise[target.name] = number;

    this.setState({
      enterprise: curr_enterprise
    });
  }

  handleStringInputChange(event) {
    const target = event.target;

    let curr_enterprise = this.state.enterprise;
    curr_enterprise[target.name] = target.value;

    this.setState({
      enterprise: curr_enterprise
    });
  }

  deleteEnterprise() {
    const enterprise = this.state.enterprise;
    const endpoint = this.context.config.api_root + '/enterprise/' + enterprise.id;

    const request = new Request(endpoint, {
      method: 'DELETE'
    });

    fetch(request)
      .then((response) => {
        // TODO: Display success
        // TODO: Refresh list of enterprises

        // Set active panel to the enterprise list
        this.props.setActivePanel(2);
        this.props.refreshData();
      })
      .catch((error) => {
        // TODO: Display error
    });
  }

  handleDeleteEnterprise(event) {
    event.preventDefault();

    // Are you sure modal
    this.setState({
      modalIsOpen: true
    });
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  render() {
    const enterprise = this.state.enterprise;

    return (
      <div className="enterpriseform-component enterprise-form">
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel="Are you sure you want to delete {enterprise.name}?"
        >

          <h2 className="modal__title" ref={subtitle => this.subtitle = subtitle}>
            Are you sure you want to delete {enterprise.name}?
          </h2>

          <p>
            You are about to delete {enterprise.name}. This cannot be undone.
            Are you sure you'd like to proceed?
          </p>

          <input className="button button--destructive" name="delete"
            onClick={this.deleteEnterprise}
            type="button" value="Delete" />

          <input className="button button--default" name="cancel"
            onClick={this.closeModal}
            type="button" value="Cancel" />
        </Modal>
      
        <h1>{enterprise.name}</h1>

        <form onSubmit={this.handleSubmitForm}>
          <label>
            Enterprise name:
            <input
              name="name"
              onChange={this.handleStringInputChange}
              required
              value={enterprise.name || ""} />
          </label>

          <label>
            Short description:
            <input
              name="short_description"
              onChange={this.handleStringInputChange}
              value={enterprise.short_description || ""} />
          </label>

          <label>
            Description:
            <textarea
              name="description"
              onChange={this.handleStringInputChange}
              value={enterprise.description || ""} />
          </label>

          <label>
            Year started:
            <input
              name="year_started"
              onChange={this.handleNumberInputChange}
              value={enterprise.year_started || ""} />
          </label>

          <label>
            Offering:
            <input
              name="offering"
              onChange={this.handleStringInputChange}
              value={enterprise.offering || ""} />
          </label>

          <label>
            Website:
            <input
              name="website"
              onChange={this.handleStringInputChange}
              type="url"
              value={enterprise.website || ""} />
          </label>

          <label>
            Facebook username:
            <input
              name="facebook"
              onChange={this.handleStringInputChange}
              value={enterprise.facebook || ""} />
          </label>

          <label>
            Instagram username:
            <input
              name="instagram"
              onChange={this.handleStringInputChange}
              value={enterprise.instagram || ""} />
          </label>

          <label>
            Twitter username:
            <input
              name="twitter"
              onChange={this.handleStringInputChange}
              value={enterprise.twitter || ""} />
          </label>
          
          <input className="button button--primary" type="submit" value="Save" />

          <input className="button button--destructive" name="delete"
            onClick={this.handleDeleteEnterprise}
            type="button" value="Delete" />
        </form>
      </div>
    );
  }
}

EnterpriseFormComponent.displayName = 'EnterpriseFormComponent';

EnterpriseFormComponent.contextTypes = {
  'config': React.PropTypes.object,
  'logger': React.PropTypes.object
};

export default EnterpriseFormComponent;
