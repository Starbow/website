var React = require('react');
var DefaultLayout = require('./../layout/default');

var InternalServerError = React.createClass({
  render: function() {
    return (
      <DefaultLayout title={this.props.title}>
        <div>500 - Internal Server Error</div>
      </DefaultLayout>
    );
  }
});

module.exports = InternalServerError;
