'use strict';

import React from 'react';
import { translate } from 'react-i18next';

require('styles/EnterpriseFormFields.scss');

class EnterpriseFormFieldsComponent extends React.Component {
  constructor(props) {
    super(props);

    this.handleArrayInputChange = this.handleArrayInputChange.bind(this);
    this.handleStringInputChange = this.handleStringInputChange.bind(this);
    this.handleNumberInputChange = this.handleNumberInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);

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

  handleSelectChange(event) {
    const target = event.target,
      options = target.options;

    let currEnterprise = this.state.enterprise,
      values;

    values = [...options].filter(option => option.selected).map(option => option.value);

    currEnterprise[target.name] = values;

    this.setState({
      enterprise: currEnterprise
    });

    this.updateParent();
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

    this.updateParent();
  }

  handleStringInputChange(event) {
    const target = event.target;

    let currEnterprise = this.state.enterprise;
    let maxWords = target.dataset.maxWords;
    currEnterprise[target.name] = target.value;

    if ( maxWords && target.value.split(/\s+/).length > maxWords ) {
      return;
    }

    this.setState({
      enterprise: currEnterprise
    });

    this.updateParent();
  }

  handleArrayInputChange(event) {
    const target = event.target;

    let value = target.value;

    if (value) {
      value = value.split(',');
    } else {
      value = [];
    }

    let currEnterprise = this.state.enterprise;
    currEnterprise[target.name] = value;

    this.setState({
      enterprise: currEnterprise
    });

    this.updateParent();
  }

  updateParent() {
    this.props.updateParent({
      enterprise: this.state.enterprise,
      locale: this.state.locale
    });
  }

  buildPurposeOptions() {
		const { t } = this.props;

		let enterprisePurposes = this.state.enterprise.purposes || [];
    let purposeOptions = t('enterpriseFormFields:purposeOptions', { returnObjects: true });

    if (!purposeOptions) {
      return;
    }

    return (
      purposeOptions.map(x => {
        if (enterprisePurposes.includes(x)) {
          return (<option key={x} selected="selected">{x}</option>);
        }
        return (<option key={x}>{x}</option>);
      })
    );
	}

  render() {
    const enterprise = this.state.enterprise;
    const { t } = this.props;
		const purposesOptions = this.buildPurposeOptions();

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
          {t('enterpriseFormFields:shortDescription')}<br />
          ({t('enterpriseFormFields:maxWords', { number: 50 })})
          <input
            data-max-words='50'
            name='short_description'
            onChange={this.handleStringInputChange}
            value={enterprise.short_description || ''} />
        </label>

        <label>
          {t('enterpriseFormFields:description')}<br />
          ({t('enterpriseFormFields:maxWords', { number: 150 })})
          <textarea
            data-max-words='150'
            name='description'
            onChange={this.handleStringInputChange}
            value={enterprise.description || ''} />
        </label>

        <label style={{'marginBottom': '0'}}>
          {t('enterpriseFormFields:purpose')}
        </label>
        <select name='purposes' onChange={this.handleSelectChange} multiple={true}
          value={enterprise.purposes || ''}>
            <option value=''></option>
						{ purposesOptions }
        </select>

        <label>
          {t('enterpriseFormFields:offering')}<br />
          ({t('enterpriseFormFields:maxWords', { number: 3 })})
          <input
            data-max-words='3'
            name='offering'
            onChange={this.handleArrayInputChange}
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
