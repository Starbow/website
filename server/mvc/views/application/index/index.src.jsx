"use strict";

var React = require('react');
var DefaultLayout = require('../../layout/default');

var Index = React.createClass({
  render: function() {
    return (
      <DefaultLayout layout={this.props.layout}>
        <h1>Starbow</h1>
        <p><a className="btn btn-primary" href="/login">Login</a></p>
      </DefaultLayout>
    );
  }
});

module.exports = Index;
