"use strict";

var React = require('react');
var DefaultLayout = require('../layout/default');

var Index = React.createClass({
  render: function() {
    return (
      <DefaultLayout title={this.props.title}>
        <h1>500 - We messed up</h1>
      </DefaultLayout>
    );
  }
});

module.exports = Index;
