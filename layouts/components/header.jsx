var React = require('react');

var Header = React.createClass({
  render: function() {
    return (
      <header id="masthead">
        <div className="row-fluid">
          <div className="span3 branding">
            <h1>
              <a href="/">{ this.props.siteName }</a>
            </h1>
          </div>
          <div className="span5 navigation"></div>
        </div>
      </header>
    );
  }
})

module.exports = Header;
