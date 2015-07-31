"use strict";

var React = require('react');
var DefaultLayout = require('../../layout/default');

var Failure = React.createClass({
  render: function() {
    return (
      <DefaultLayout layout={this.props.layout}>
        <h1>{this.props.layout.title}</h1>
        <p>Something went wrong during your login attempt.</p>
        <p>Try logging in again.</p>
        <div className="text-center"><a className="btn btn-primary" href="/login">Login</a></div>
        <p>If the problem persists, please contact the Starbow staff.</p>
      </DefaultLayout>
    );
  }
});

module.exports = Failure;
