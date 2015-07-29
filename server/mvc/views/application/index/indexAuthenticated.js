  "use strict";

  var React = require('react');
  var DefaultLayout = require('../../layout/default');

  var Index = React.createClass({displayName: "Index",
    render: function() {
      return (
        React.createElement(DefaultLayout, {title: this.props.title}, 
          React.createElement("h1", null, "Starbow"), 
          React.createElement("p", null, "User ID: ", React.createElement("strong", null, this.props.userId), React.createElement("br", null), 
          "Battletag: ", React.createElement("strong", null, this.props.battletag)), 
          React.createElement("ul", null, 
            React.createElement("li", null, React.createElement("a", {href: "/profile/info"}, "SC2 Profile Info")), 
            React.createElement("li", null, React.createElement("a", {href: "/profile/matchhistory"}, "See Match History")), 
            React.createElement("li", null, React.createElement("a", {href: "/userstuff"}, "User stuff (temporary development endpoint)"))
          ), 
          React.createElement("p", null, React.createElement("a", {href: "/logout"}, "Logout"))
        )
      );
    }
  });

  module.exports = Index;
