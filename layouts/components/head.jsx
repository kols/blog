var React = require('react');

var Head = React.createClass({
  render: function() {
    return (
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="Content-Type" content="text/html" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="Kane Dou" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link href="/feed.xml" rel="alternate" title="kandou.me" type="application/rss+xml" />
        <link rel="stylesheet" href="/assets/stylesheets/screen.css" />
        <link rel="stylesheet" href="/assets/stylesheets/syntax.css" />
        <title>{ this.props.title }</title>
      </head>
    );
  }
});

module.exports = Head;
