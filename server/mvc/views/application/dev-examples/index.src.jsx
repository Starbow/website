"use strict";

var React = require('react');
var DefaultLayout = require('../../layout/default');

var LiAction = React.createClass({
  render: function() {
    return <li><a href={this.props.action.uri}>{this.props.action.name}</a></li>;
  }
});

var Index = React.createClass({
  render: function() {
    return (
      <DefaultLayout title={this.props.title}>
        <h1>Development examples</h1>
        <p>These examples are not available in production.</p>
        <ul>
          {this.props.actions.map(function(action, index) {
            return <LiAction key={index} action={action}/>;
          })}
        </ul>
        <h1>Starbow</h1>
        <p><a href="/auth/bnet">Login via Bnet</a></p>
      </DefaultLayout>
    );
  }
});

module.exports = Index;
