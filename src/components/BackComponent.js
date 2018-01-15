'use strict';

import React from 'react';

require('styles/Back.scss');

import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';

class BackComponent extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <div className="back-component">
        <a className="back" onClick={browserHistory.goBack}>{t('back:back')}</a>
      </div>
    );
  }
}

BackComponent.displayName = 'BackComponent';

export { BackComponent };
export default translate('back')(BackComponent);

