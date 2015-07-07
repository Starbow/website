var React = require('react');
var DefaultLayout = require('./../../layout/default');

var ListItemWrapper = React.createClass({
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
            return <ListItemWrapper key={index} action={action}/>;
          })}
        </ul>
      </DefaultLayout>
    );
  }
});

module.exports = Index;
