  "use strict";

  var React = require('react');
  var DefaultLayout = require('../../../../layout/default');

  var AlreadyLoggedIn = React.createClass({
    render: function() {
      return (
        <DefaultLayout layout={this.props.layout}>
          <h1>{this.props.layout.title}</h1>
          <p>You are currently logged in as <strong><a href={this.props.userProfileURL}>{this.props.userNickname}</a></strong>.</p>
          <p>If you wish to log out, click the button below.</p>
          <p className="text-center"><a className="btn btn-primary" href="/logout">Logout</a></p>
        </DefaultLayout>
      );
    }
  });

  module.exports = AlreadyLoggedIn;
