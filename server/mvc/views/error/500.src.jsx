"use strict";

var React = require('react');
var DefaultLayout = require('../layout/default');

var Index = React.createClass({
  render: function() {
    return (
      <DefaultLayout layout={this.props.layout}>
        <h1>500 - We messed up</h1>
      </DefaultLayout>
    );
  }
});

module.exports = Index;
