"use strict";

var React = require('react');
var merge = require("merge");

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

var ScriptTag = React.createClass({
  render: function(){
    return (
      <script type="text/javascript" src={this.props.src}></script>
    )
  }
});

var DefaultLayout = React.createClass({
  render: function() {
    var layout = typeof(this.props.layout) == "object" ? this.props.layout : {};
    var lang = layout.lang ? layout.lang : "en";
    var title = layout.title ? layout.title : "Starbow";
    var headMeta = (layout.meta instanceof Array) ? layout.meta : [];
    var headCss = (layout.css instanceof Array) ? layout.css : [];
    headCss = [
      "/assets/cdn/bootstrap/3.3.1/css/bootstrap.min.css",
      "/assets/framework/bootstrap/themes/starbow.css",
      "/assets/layout/default.css"
    ].concat(headCss);
    var headJs = (layout.js instanceof Array) ? layout.js : [];
    headJs = [
      "/assets/common/App.js"
    ].concat(headJs);
    return (
      <html lang={lang}>
        <head>
          <meta charSet="utf-8"/>
          <title>{title}</title>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
          <meta name="viewport" content="width=device-width,initial-scale=1"/>
          <MetaDescription description={layout.description}/>
          {headMeta.map(function(attributes, index){
            return <MetaTag attributes={attributes}/>
          })}
          {headCss.map(function(href, index){
            return <LinkTag href={href}/>
          })}
          {headJs.map(function(src, index){
            return <ScriptTag src={src}/>
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
