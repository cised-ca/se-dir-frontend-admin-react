'use strict';
let path = require('path');
let defaultSettings = require('./defaults');

// Additional npm or bower modules to include in builds
// Add all foreign plugins you may need into this array
// @example:
// let npmBase = path.join(__dirname, '../node_modules');
// let additionalPaths = [ path.join(npmBase, 'react-bootstrap') ];
let additionalPaths = [];

module.exports = {
  additionalPaths: additionalPaths,
  port: defaultSettings.port,
  debug: true,
  devtool: 'eval',
  output: {
    path: path.join(__dirname, '/../dist/assets'),
    filename: 'app.js',
    publicPath: defaultSettings.publicPath
  },
  devServer: {
    contentBase: './src/',
    historyApiFallback: true,
    hot: true,
    setup: function(app) {
      app.use('/admin/locales', function(req, res) {
        var options = {
          root: __dirname + '/../src/'
        };

        res.sendFile('locales' + req.url, options, function(err) {
          if (err) {
            console.log(err);
          }

          res.end();
        });
      });

      app.use('/admin/config.json', function(req, res) {
        var options = {
          root: __dirname + '/../src/'
        };

        res.sendFile('config.json', options, function(err) {
          if (err) {
            console.log(err);
          }

          res.end();
        });
      });

      app.use('/admin/images', function(req, res) {
        var options = {
          root: __dirname + '/../src/'
        };

        res.sendFile('images' + req.url, options, function(err) {
          if (err) {
            console.log(err);
          }

          res.end();
        });
      });
    },
    port: defaultSettings.port,
    publicPath: defaultSettings.publicPath,
    proxy: {
      '/api': {
        target: 'http://localhost:10010',
        secure: false
      }
    },
    noInfo: false
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      actions: `${defaultSettings.srcPath}/actions/`,
      components: `${defaultSettings.srcPath}/components/`,
      sources: `${defaultSettings.srcPath}/sources/`,
      stores: `${defaultSettings.srcPath}/stores/`,
      styles: `${defaultSettings.srcPath}/styles/`,
      config: `${defaultSettings.srcPath}/config/` + process.env.REACT_WEBPACK_ENV
    }
  },
  module: {}
};
