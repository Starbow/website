"use strict";

var React = require('react');
var DefaultLayout = require('../../layout/default');

var Index = React.createClass({
  render: function() {
    return (
      <DefaultLayout layout={this.props.layout}>
        <p>The current worker is: {this.props.workerId}</p>
        <p>
          <a href={this.props.killUri}>Kill current worker</a>
        </p>
      </DefaultLayout>
    );
  }
});

module.exports = Index;
