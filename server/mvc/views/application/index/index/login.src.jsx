  "use strict";

  var React = require('react');
  var DefaultLayout = require('../../../layout/default');

  var Login = React.createClass({
    render: function() {
      return (
        <DefaultLayout title={this.props.title} description={this.props.description}>
          <h1>{this.props.title}</h1>
          <p><a href="/auth/bnet">Login via Battle.net</a></p>
        </DefaultLayout>
      );
    }
  });

  module.exports = Login;
