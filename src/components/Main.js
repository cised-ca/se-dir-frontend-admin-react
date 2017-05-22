require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

import { browserHistory, Router, Route, IndexRoute } from 'react-router';
import Template from './TemplateComponent.js';
import LoginPage from './pages/LoginPageComponent.js';
import Dashboard from './pages/DashboardComponent.js';

class AppComponent extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route component={Template}
          path='/'
          onChange={(prevState, nextState) => {
            if (nextState.location.action !== 'POP') {
              window.scrollTo(0, 0);
            }
          }}
      >
          <IndexRoute component={LoginPage} />

          <Route name='admin-dashboard' path='/dashboard' component={Dashboard} />
        </Route>
      </Router>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
