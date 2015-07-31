"use strict";

var React = require('react');
var DefaultLayout = require('../../layout/default');

var buttonTextLoginToBattlenet = "Login via Battle.net";

  var Login = React.createClass({
    render: function() {
      return (
        <DefaultLayout title={this.props.title} description={this.props.description} css={this.props.css}>
          <h1>{this.props.title}</h1>
          <p>You login to this website through your Battle.net Account.</p>
          <div>
            <div id="battlenetLogin" className="text-center">
              <div className="battlnetLogo"></div>
              <a className="btn btn-login" href="/auth/bnet">{buttonTextLoginToBattlenet}</a>
            </div>
          </div>
          <h2>Prerequisites</h2>
          <p>You need an active Battle.net Account to:</p>
          <ol type="A">
            <li>Login to this website.</li>
            <li>Play Starbow through the Starcraft 2 game client.</li>
          </ol>
          <p>If you do not already have a Battle.net account, you may register here: <a target="_blank" href="https://battle.net/account/creation/tos.html">{"https://battle.net/account/creation/tos.html"}</a></p>
          <h2>Login procedure</h2>
          <p>When you click the button <strong>{"\""+buttonTextLoginToBattlenet+"\""}</strong> above, the following will happen:</p>
          <ul>
            <li>You will be securely redirected to the Battle.net Login page located under: <a href="https://battle.net">{"https://battle.net"}</a></li>
            <li>You must accept that Starbow is allowed to extract non-sensitive information about your account through the <a href="https://dev.battle.net/">Battle.net API</a>.</li>
            <li>You enter your login credentials that only you and Blizzard Entertainment know and can validate. I.e. Starbow will not know or have access to your e-mail address or password.</li>
            <li>Upon succesful login you will be redirected back to this website. You may now use the various functions throughout this website, including the forum, chat, and of course matchmaking system allowing you to play ranked Starbow games.</li>
          </ul>
          <p>If you have already performed the above steps and you stay logged in at <a href="https://battle.net">Battle.net</a>, the login procedure happens automatically.</p>
        </DefaultLayout>
      );
    }
  });

  module.exports = Login;
