'use strict';

import React from 'react';
import { translate } from 'react-i18next';

import Modal from 'react-modal';

Modal.setAppElement('#app');

require('styles/ModalError.scss');

class ModalErrorComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: true
    };

    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    if (this.props.clearError) {
      this.props.clearError();
    }

    /*this.setState({
      modalIsOpen: false
  }); */
  }

  render() {
    return (
      <div className="error-component">
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel='Error'
        >

          <h2 className='modal__title' ref={subtitle => this.subtitle = subtitle}>
            Error
          </h2>

          <p>
            {this.props.children}
          </p>

          <input className='button button--default' name='ok'
            onClick={this.closeModal}
            type='button' value='Ok' />
        </Modal>
      </div>
    );
  }
}

ModalErrorComponent.displayName = 'ModalErrorComponent';

ModalErrorComponent.contextTypes = {
  'config': React.PropTypes.object,
  'logger': React.PropTypes.object
};

export default translate('modalError')(ModalErrorComponent);
