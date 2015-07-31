"use strict";

var React = require('react');

var MetaDescription = React.createClass({
  render: function(){
    return(
      this.props.description
      ? <meta name="description" content={this.props.description}/>
      : false
    )
  }
});

var MetaTag = React.createClass({
  render: function(){
    return (
      <meta {...this.props.attributes} />
    )
  }
});

var LinkTag = React.createClass({
  render: function(){
    return (
      <link type="text/css" rel="stylesheet" href={this.props.href}/>
    )
  }
});

var DefaultLayout = React.createClass({
  render: function() {
    var layout = typeof(this.props.layout) == "object" ? this.props.layout : {};
    var lang = layout.lang ? layout.lang : "en";
    var title = layout.title ? layout.title : "Starbow";
    var metaOther = (layout.meta instanceof Array) ? layout.meta : [];
    var css = (layout.css instanceof Array) ? layout.css : [];
    return (
      <html lang={lang}>
        <head>
          <meta charSet="utf-8"/>
          <title>{title}</title>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
          <meta name="viewport" content="width=device-width,initial-scale=1"/>
          <MetaDescription description={layout.description}/>
          {metaOther.map(function(attributes, index){
            return <MetaTag attributes={attributes}/>
          })}
          <link type="text/css" rel="stylesheet" href="/assets/cdn/bootstrap/3.3.1/css/bootstrap.min.css"/>
          <link type="text/css" rel="stylesheet" href="/assets/framework/bootstrap/themes/starbow.css"/>
          <link type="text/css" rel="stylesheet" href="/assets/layout/default.css"/>
          {css.map(function(href, index){
            return <LinkTag href={href}/>
          })}
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
