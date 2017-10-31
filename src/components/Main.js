require('normalize.css/normalize.css');
require('styles/App.css');

/* Imported here since we don't have our own Modal component (yet?) */
require('styles/Modal.scss');

import React from 'react';

import { browserHistory, Router, Route, IndexRoute } from 'react-router';
import Template from './TemplateComponent.js';
import LoginPage from './pages/LoginPageComponent.js';
import AccountPage from './pages/AccountPageComponent.js';
import Dashboard from './pages/DashboardComponent.js';
import CreateEnterprisePage from './pages/CreateEnterprisePageComponent.js';

class AppComponent extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route component={Template}
          path='/admin'
          onChange={(prevState, nextState) => {
            if (nextState.location.action !== 'POP') {
              window.scrollTo(0, 0);
            }
          }}
      >
          <IndexRoute component={LoginPage} />

          <Route name='account-page' path='account' component={AccountPage} />
          <Route name='create-enterprise-page' path='create' component={CreateEnterprisePage} />
          <Route name='admin-dashboard' path='dashboard' component={Dashboard} />
        </Route>
      </Router>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
