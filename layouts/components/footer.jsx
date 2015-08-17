var React = require('react');

var Footer = React.createClass({
  render: function() {
    return (
      <footer role="contentinfo" className="contentinfo">
        <div>
          <span className="copy">&copy; 2005-2015 { this.props.author }</span>
          |
          <span className="license">
            <a href={ this.props.license_url }>license</a>
          </span>
          |
          <span className="engine">
          </span>
        </div>
      </footer>
    );
  }
});

module.exports = Footer;
