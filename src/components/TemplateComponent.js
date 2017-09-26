'use strict';

import React from 'react';
import i18n from '../i18n';

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

  setLoggedIn(loggedIn) {
    this.setState({isLoggedIn: loggedIn});
  }

  constructor(props) {
    super(props);

    this.state = {
      config: {},
      isLoggedIn: false,
      setLoggedIn: this.setLoggedIn.bind(this),
      logger: {
        // eslint-disable-next-line no-console
        notify: function(msg) { console.error(msg); }
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
    return fetch('/admin/config.json')
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
        let currentLocale = config.defaultLocale || 'en';

        // If we have locales in the config, figure out which language to
        // display to the user based on the current url
        if (config.locales) {
          let currentUrl = window.location.href;

          for (let i = 0; i < config.locales.length; i += 1) {
            let locale = config.locales[i];
            let pattern = new RegExp('^' + locale.prefix, 'i');

            if (currentUrl.search(pattern) !== -1) {
              currentLocale = locale.locale;
              break;
            }
          }
        }

        i18n.changeLanguage(currentLocale);

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
        <TopBar isLoggedIn={this.state.isLoggedIn} setLoggedIn={this.state.setLoggedIn} />

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
