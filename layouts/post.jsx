var React = require('react'),
  Head = require('./components/head'),
  Header = require('./components/header'),
  Article = require('./components/article'),
  Footer = require('./components/footer');

var Post = React.createClass({
  render: function() {
    return (
      <html>
        <Head title={ this.props.title } />
        <body>
          <Header siteName={ this.props.siteName } />
          <div id="content">
            <Article { ...this.props } />
          </div>
          <Footer { ...this.props } />
        </body>
      </html>
    );
  }
});

module.exports = Post;
