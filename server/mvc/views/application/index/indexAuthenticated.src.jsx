  "use strict";

  var React = require('react');
  var DefaultLayout = require('../../layout/default');

  var Index = React.createClass({
    render: function() {
      return (
        <DefaultLayout title={this.props.title} description={this.props.description}>
          <h1>Starbow</h1>
          <p>User ID: <strong>{this.props.userId}</strong><br/>
          Battletag: <strong>{this.props.battletag}</strong></p>
          <ul>
            <li><a href="/profile/info">SC2 Profile Info</a></li>
            <li><a href="/profile/matchhistory">See Match History</a></li>
            <li><a href="/userstuff">User stuff (temporary development endpoint)</a></li>
          </ul>
          <p><a href="/logout">Logout</a></p>
        </DefaultLayout>
      );
    }
  });

  module.exports = Index;
