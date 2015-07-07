var React = require('react');
var DefaultLayout = require('./../layout/default');

var NotFound = React.createClass({
  render: function() {
    return (
      <DefaultLayout title={this.props.title}>
        <div>404 - Page not found</div>
      </DefaultLayout>
    );
  }
});

module.exports = NotFound;
