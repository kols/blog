---
layout: post
title: "MoinMoin的URL优化显示"
tags:
- cgi
- Google
- htaccess
- moinmoin
- os
- url
- WebTech
- wiki
- "代码"
status: publish
type: post
published: true
meta:
  _edit_last: "1"
  enclosure: |
    http://dl.dropbox.com/u/2823002/music/Catcher_in_the_rye.mp3
    5651162
    audio/mpeg

  _aioseop_description: "解释如何优化Moinmoin Wiki的URL显示，使复杂难懂的长串URL变得简介美观。"
  _aioseop_keywords: "维基,apache 配置"
comments: true
---
前几天在装 MoinMoin Wiki（下文简称 moin）时遇到的一个问题，记录在这里，可能会对大家有用。

由于 moin 默认是需要用 `moin.cgi` 这样的脚本来作为入口的，因此在使用中会产生
url 不美观的问题，例如：`http://example.com/moin.cgi` ，而这显然是不符合我的要求的。

在 Google 一番后找到了方法，而且很多，虽然大都用大同小异的方法来实现，但细节处却基本各有各的写法，这里我只列出我所使用的方法，这花去了我好几个小时反复调试但没有成功，最后却在隔了几天后的一个晚上仅用几分钟便解决了。

首先在位于网站根目录下的 `.htaccess` 文件中加入如下语句：

{% highlight apache %}
RewriteEngine On
RewriteBase /
RewriteRule ^wiki(.*)$ path/to/moin.cgi/$1 [L]
{% endhighlight %}

其中第四行的 wiki 可以改成任意希望的路径。在例子中，这会使所有向`http://example.com/wiki` 发出的请求转发到 `moin.cgi` 这个脚本文件，同时不改变url 的显示。此时在浏览器中访问 `http://example.com/wiki` 应该能正常显示 wiki 首页。

之后在 `moin.cgi` 中加入如下语句:

{% highlight python %}
os.environ['SCRIPT_NAME'] = '/wiki'
{% endhighlight %}

这句的作用是使 moin 自己生成的 url 显示正常。如果没有这一句，则 wiki 首页 url 在上一步设置后变得正常，但 wiki 中任何一个超链接的 url 都仍然带有 `moin.cgi`。

现在，整个 wiki 的 url 都应该如预期那样显示了。 最后放一首歌，试试新的插件:p*（2012-02-07 更新：歌暂时没了，因为插件没了，因为 WordPress 没了）*
