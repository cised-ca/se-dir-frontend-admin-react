'use strict';

import React from 'react';
import Modal from 'react-modal';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.scss';

import EnterpriseForm from '../EnterpriseFormComponent';

Modal.setAppElement('#app');

require('styles/panels/EnterpriseDetailsPanel.scss');

class EnterpriseDetailsPanelComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      enterprise: props.enterprise
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.enterprise[0].enterprise.name !== this.props.enterprise[0].enterprise.name) {
      this.setState({
        enterprise: nextProps.enterprise
      });
    }
  }

  fillTabList() {
    const locales = this.context.config.locales;

    const tabs = locales.map((locale) => {
      return (
        <Tab key={locale.locale}>{locale.name}</Tab>
      );
    });

    return tabs;
  }

  fillTabPanels() {
    const locales = this.context.config.locales;

    const panels = locales.map((locale, index) => {
      const enterpriseForm = <EnterpriseForm enterprise={this.state.enterprise[index].enterprise} locale={locale.locale} />

      return (
        <TabPanel key={"enterprise" + index}>{enterpriseForm}</TabPanel>
      );
    });

    return panels;
  }

  render() {
    const tabs = this.fillTabList();
    const panels = this.fillTabPanels(false);
    const enterprise = this.state.enterprise[0].enterprise; // FIXME: Have this be the current locale, not the first one in the list

    return (
      <div className="panel panel--wide enterprisedetailspanel-component">
        <Tabs>
          <TabList>
            {tabs}
          </TabList>

          {panels}
        </Tabs>
      </div>
    );
  }
}

EnterpriseDetailsPanelComponent.displayName = 'EnterpriseDetailsPanelComponent';

EnterpriseDetailsPanelComponent.contextTypes = {
  'config': React.PropTypes.object,
  'logger': React.PropTypes.object
};

export default EnterpriseDetailsPanelComponent;
