'use strict';

import React from 'react';
import { translate } from 'react-i18next';

require('styles/EnterpriseFormFields.scss');

class EnterpriseFormFieldsComponent extends React.Component {
  constructor(props) {
    super(props);

    this.handleStringInputChange = this.handleStringInputChange.bind(this);
    this.handleNumberInputChange = this.handleNumberInputChange.bind(this);

    this.state = {
      enterprise: props.enterprise,
      locale: props.locale
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.enterprise.name !== this.props.enterprise.name) {
      this.setState({
        enterprise: nextProps.enterprise
      });
    }
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

    let currEnterprise = this.state.enterprise;
    currEnterprise[target.name] = number;

    this.setState({
      enterprise: currEnterprise
    });
  }

  handleStringInputChange(event) {
    const target = event.target;

    let currEnterprise = this.state.enterprise;
    currEnterprise[target.name] = target.value;

    this.setState({
      enterprise: currEnterprise
    });
  }

  render() {
    const enterprise = this.state.enterprise;
    const { t } = this.props;

    return (
      <div className='enterpriseformfields-component enterprise-form-fields'>
        <label>
          {t('enterpriseFormFields:enterpriseName')}
          <input
            name='name'
            onChange={this.handleStringInputChange}
            required
            value={enterprise.name || ''} />
        </label>

        <label>
          {t('enterpriseFormFields:shortDescription')}
          <input
            name='short_description'
            onChange={this.handleStringInputChange}
            value={enterprise.short_description || ''} />
        </label>

        <label>
          {t('enterpriseFormFields:description')}
          <textarea
            name='description'
            onChange={this.handleStringInputChange}
            value={enterprise.description || ''} />
        </label>

        <label>
          {t('enterpriseFormFields:yearStarted')}
          <input
            name='year_started'
            onChange={this.handleNumberInputChange}
            value={enterprise.year_started || ''} />
        </label>

        <label>
          {t('enterpriseFormFields:offering')}
          <input
            name='offering'
            onChange={this.handleStringInputChange}
            value={enterprise.offering || ''} />
        </label>

        <label>
          {t('enterpriseFormFields:website')}
          <input
            name='website'
            onChange={this.handleStringInputChange}
            type='url'
            value={enterprise.website || ''} />
        </label>

        <label>
          {t('enterpriseFormFields:facebookUsername')}
          <input
            name='facebook'
            onChange={this.handleStringInputChange}
            value={enterprise.facebook || ''} />
        </label>

        <label>
          {t('enterpriseFormFields:instagramUsername')}
          <input
            name='instagram'
            onChange={this.handleStringInputChange}
            value={enterprise.instagram || ''} />
        </label>

        <label>
          {t('enterpriseFormFields:twitterUsername')}
          <input
            name='twitter'
            onChange={this.handleStringInputChange}
            value={enterprise.twitter || ''} />
        </label>
      </div>
    );
  }
}

EnterpriseFormFieldsComponent.displayName = 'EnterpriseFormFieldsComponent';

EnterpriseFormFieldsComponent.contextTypes = {
  'config': React.PropTypes.object,
  'logger': React.PropTypes.object
};

export default translate('enterpriseFormFields')(EnterpriseFormFieldsComponent);