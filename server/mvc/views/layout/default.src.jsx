"use strict";

var React = require('react');

var DefaultLayout = React.createClass({
  render: function() {
    var layout = typeof(this.props.layout) == "object" ? this.props.layout : {};
    var lang = layout.lang ? layout.lang : "en";
    var title = layout.title ? layout.title : "Starbow";
    return (
      <html lang={lang}>
        <head>
          <meta charSet="utf-8"/>
          <title>{title}</title>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
          <meta name="viewport" content="width=device-width,initial-scale=1"/>
          {
            layout.meta
            ? layout.meta.map(function(attributes, index) {
                return (
                  <meta {...attributes} />
                )
              })
            : null
          }
          {
            layout.description
            ? <meta name="description" content={layout.description}/>
            : null
          }
          <link type="text/css" rel="stylesheet" href="/assets/cdn/bootstrap/3.3.1/css/bootstrap.min.css"/>
          <link type="text/css" rel="stylesheet" href="/assets/framework/bootstrap/themes/starbow.css"/>
          <link type="text/css" rel="stylesheet" href="/assets/layout/default.css"/>
          {
            layout.css
            ? layout.css.map(function(href, index) {
                return (
                  <link type="text/css" rel="stylesheet" href={href}/>
                )
              })
            : null
          }
        </head>
        <body>
          <page>
            <header></header>
            <content>{this.props.children}</content>
            <footer> </footer>
          </page>
          <noscript>This website requires that you have Javascript active.</noscript>
        </body>
      </html>
    );
  }
});

module.exports = DefaultLayout;
