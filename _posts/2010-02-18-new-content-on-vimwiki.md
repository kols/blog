---
layout: post
title: "有关vimwiki的新内容"
tags:
- css
- moinmoin
- Vim
- vimwiki
- wiki
- "学习"
status: publish
type: post
published: true
meta:
  _edit_last: "1"
comments: true
---
vimwiki 现在支持 table of content 了，只要在需要的地方输入代码 `%toc`，它就会自
动生成一份当前 wiki 页面的内容目录，我没有多做测试，但对于 header 格式能够很好
的识别。这样一来 vimwiki 作为个人笔记的可用性及丰富性又提升了，相对于 moinmoin 这样的专业 wiki 除了在数据访问的问题（通过 dropbox 等也应该不难解决）上差一点外，其他方面已经足够让个人方便地管理自己的各种可输出为文本的知识内容了。

昨天弄了很久的 css，体会到了那些做前端的人的辛苦，一个属性在 chrome 下正常，换到 firefox 下则有问题。那个 height 属性，设成 auto 在 firefox 下不能将 border 的下边撑到底，让我头疼了很久，但一到 chrome 下则完全符合我预想的效果了。最后没有找到让它在两边都完美的方法，于是我只能把边框去掉了。

这里顺便要推一个
[syntaxhighlighter](http://alexgorbatchev.com/wiki/SyntaxHighlighter) 的 javascript 程序，很好地完成了 vimwiki 中的代码高亮，只是支持的语言还不够全面，但对我已足够。而且 vimwiki 自己支持内嵌语法高亮，也就是在编辑wiki源文时的语法高亮（通过 `nested_syntax` 选项设置），因此对于代码而言，已经很友好了。

再加上我也设置了一些快捷键，因此现在编辑 wiki 文件已经比较顺手，反而在整理内容时会稍难一些。但这又是更关键的一步，因此我再想对于知识的语言化是否也需要一些工具来进行辅助呢？

好了，最后附上我的 wiki 输出为 html 后的截图以及 [css 文件](http://dl.dropbox.com/u/2823002/style.css)（多数内容都是抄来的，当然:-)）。

[![vwikiscreenshot1](http://farm5.static.flickr.com/4021/4368050062_7e953d3117_o.jpg "vwikiss1")](http://farm5.static.flickr.com/4021/4368050062_7e953d3117_o.jpg)

[![vwikiscreenshot2](http://farm5.static.flickr.com/4037/4367303287_cc69ee922c_o.jpg "vwikiss2")](http://farm5.static.flickr.com/4037/4367303287_cc69ee922c_o.jpg)

*（点击放大）*
