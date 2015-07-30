  "use strict";

  var React = require('react');
  var DefaultLayout = require('../../../../layout/default');

  var AlreadyLoggedIn = React.createClass({
    render: function() {
      return (
        <DefaultLayout title={this.props.title} description={this.props.description}>
          <h1>{this.props.title}</h1>
          <p>You are currently logged in as <a href={this.props.userProfileURL}>{this.props.userNickname}</a></p>
        </DefaultLayout>
      );
    }
  });

  module.exports = AlreadyLoggedIn;
