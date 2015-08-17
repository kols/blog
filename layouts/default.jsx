var React = require('react'),
  Head = require('./components/head'),
  Header = require('./components/header'),
  Footer = require('./components/footer');

var Default = React.createClass({
  render: function() {
    var { contents, ...other } = this.props,
      contents = { '__html': this.props.contents };
    return (
      <html>
        <Head { ...other } />
        <body>
          <Header siteName={ this.props.siteName } />
          <div id="content" dangerouslySetInnerHTML={ contents } />
          <Footer { ...this.props } />
        </body>
      </html>
    );
  }
});

module.exports = Default;
