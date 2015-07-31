"use strict";

var React = require('react');
var DefaultLayout = require('../../layout/default');

var Failure = React.createClass({
  render: function() {
    return (
      <DefaultLayout title={this.props.title} description={this.props.description} css={this.props.css} headJs={this.props.jsHead} headMeta={this.props.headMeta}>
        <h1>{this.props.title}</h1>
        <p>Something went wrong during your login attempt.</p>
        <p>Try logging in again.</p>
        <div className="text-center"><a className="btn btn-primary" href="/login">Login</a></div>
        <p>If the problem persists, please contact the Starbow staff.</p>
      </DefaultLayout>
    );
  }
});

module.exports = Failure;
