"use strict";

var React = require('react');

var DefaultLayout = React.createClass({
  render: function() {
    return (
      <html>
        <head>
          <meta charSet="utf-8"/>
          <title>{this.props.title}</title>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
          <meta name="viewport" content="width=device-width,initial-scale=1"/>
          {
            this.props.description
            ? <meta name="description" content={this.props.description}/>
            : null
          }
          <link type="text/css" rel="stylesheet" href="/assets/cdn/bootstrap/3.3.1/css/bootstrap.min.css"/>
          <link type="text/css" rel="stylesheet" href="/assets/framework/bootstrap/themes/starbow.css"/>
          <link type="text/css" rel="stylesheet" href="/assets/layout/default.css"/>
        </head>
        <body>
          <page>
            <header></header>
            <content>{this.props.children}</content>
            <footer> </footer>
          </page>
        </body>
      </html>
    );
  }
});

module.exports = DefaultLayout;
