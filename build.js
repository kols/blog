var metalsmith = require('metalsmith'),
  layouts = require('metalsmith-layouts'),
  // collections = require('metalsmith-collections'),
  dateInFilename = require('metalsmith-date-in-filename'),
  markdown = require('metalsmith-markdown'),
  // permalinks = require('metalsmith-permalinks'),
  serve = require('metalsmith-serve'),
  watch = require('metalsmith-watch'),
  moment = require('moment');

var site = metalsmith(__dirname)
  .metadata({
    siteName: 'kanedou.me',
    author: 'Kane Dou',
    url: 'http://kanedou.me',
    license_url: 'http://creativecommons.org/licenses/by/4.0/'
  })
  .source('./post')
  .destination('./build');

site
  // .use(dateInFilename(false))
  .use(markdown({
    gfm: true
  }))
  // .use(collections({
  //   posts: {
  //     pattern: 'post#<{(|*.html',
  //     sortBy: 'date',
  //     reverse: true
  //   }
  // }))
  .use(layouts({
    engine: 'react',
    base: 'layouts/base.html',
    moment: moment
  }))
  // .use(serve({
  //   port: 8080,
  //   verbose: true
  // }))
  // .use(watch({
  //   pattern: '*|)}>#*',
  //   livereload: true
  // }))
  .build(function (err) {
    if (err) {
      console.log(err);
    }
  });
