var React = require('react');

var Article = React.createClass({
  render: function() {
    return (
      <article role="article" className="well">
        <Article.Header
          title={ this.props.title }
          categories={ this.props.categories }
          date={ this.props.date }
          moment={ this.props.moment } />
        <Article.Post
          serif={ this.props.serif }
          contents={ this.props.contents } />
      </article>
    );
  }
});

Article.Header = React.createClass({
  render: function() {
    return (
      <header>
        <section className="title">
          <h1>{ this.props.title }</h1>
        </section>
        <section className="meta">
          @<time>{ this.props.moment(this.props.date).format("YYYY-MM-DD") }</time>
          <span className="categories">
            {this.props.categories.map(function(cat, i) {
              return <em key={ cat } className="category">#{ cat }</em>
            })}
          </span>
        </section>
      </header>
    );
  }
});

Article.Post = React.createClass({
  render: function() {
    var contents = { '__html': this.props.contents };
    return (
      <section
        className={ this.props.serif ? 'post serif' : 'post' }
        dangerouslySetInnerHTML={ contents } />
    );
  }
})

module.exports = Article
