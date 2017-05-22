'use strict';

import React from 'react';

import TopBar from './TopBarComponent.js';

const airbrakeJs = require('airbrake-js');

require('styles/Template.scss');

class TemplateComponent extends React.Component {
  getChildContext() {
    return {
      'config': this.state.config,
      'logger': this.state.logger
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      config: {},
      logger: {
        /* eslint-disable no-console */
        notify: function(msg) { console.error(msg); }
        /* eslint-enable no-console */
      }
    };
  }

  /**
   * Send errors to a logging system
   */
  setup_error_logger() {
    var config = this.state.config,
      logger;

    if (config.logger) {
      logger = new airbrakeJs({
        projectId: config.logger.api_key,
        projectKey: config.logger.api_key,
        reporter: 'xhr',
        host: config.logger.host
      });

      this.setState({
        logger: logger
      });
    }
  }

  /**
   * Get the configuration file
   *
   * @return A promise
   */
  get_config() {
    return fetch('/config.json')
      .then(function(response) {
        return response
                .json()
                .then(function(json) {
                  return json;
                });
      });
  }

  /**
   * Get/parse config data.
   *
   * Called by React after the initial render.
   */
  componentDidMount() {
    var app = this;

    app
      .get_config()
      .then(function(config) {
        app.setState(
          {
            config: config
          },
          app.setup_error_logger
        );
      })
      .catch(function(reason) {
        app.state.logger.notify(reason);
      });
  }

  render() {
    let childWithProps = React.cloneElement(this.props.children, this.state);

    return (
      <div className="template-component template">
        <TopBar />

        <main className="template__main">
          {childWithProps}
        </main>
      </div>
    );
  }
}

TemplateComponent.displayName = 'TemplateComponent';

TemplateComponent.childContextTypes = {
  'config': React.PropTypes.object,
  'logger': React.PropTypes.object
};

export default TemplateComponent;
