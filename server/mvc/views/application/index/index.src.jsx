"use strict";

var React = require('react');
var DefaultLayout = require('../../layout/default');

var Index = React.createClass({
  render: function() {
    return (
      <DefaultLayout title={this.props.title}>
        <h1>Starbow</h1>
        <p><a href="/auth/bnet">Login via Bnet</a></p>
      </DefaultLayout>
    );
  }
});

module.exports = Index;
