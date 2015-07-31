"use strict";

var React = require('react');
var DefaultLayout = require('../layout/default');

var Index = React.createClass({
  render: function() {
    return (
      <DefaultLayout layout={this.props.layout}>
        <h1>404 - You messed up</h1>
      </DefaultLayout>
    );
  }
});

module.exports = Index;
