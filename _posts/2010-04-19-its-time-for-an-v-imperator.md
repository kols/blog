---
layout: post
title: It's time for an (V)Imperator
tags:
- browser
- config
- firefox
- plugin
- Vim
- vimperator
- vimscript
- web
- "代码"
status: publish
type: post
published: true
meta:
  _edit_last: "1"
  _wp_old_slug: itu002639s-time-for-an-v-imperator
  _aioseop_description: "介绍将彻底vim化的插件vimperator，给出配置文件及插件和实际使用中的截图作为参考。"
  _aioseop_title: It's time for an (V)Imperator
  _aioseop_keywords: "配置, 截图, screenshot, 浏览器插件, firefox plugin"
comments: true
---
在[awesome](http://awesome.naquadah.org)下使用Firefox或Chrome始终有着不太适应的感觉，其中重要的一点就是这两个浏览器都是鼠标中心化的浏览器，一旦用快捷键切换到浏览器后，我的手必须离开键盘去操作鼠标来接着进行浏览。这样一来，一是我的手需要在鼠标和键盘间不停移动，有点麻烦有点累，二是随之而来的效率降低，重复动作变多。因此我就又想起了之前装了又删，删了又装的Vimperator。

[Vimperator](http://vimperator.org)是一个将Vim的理念应用在[Firefox](http://www.mozilla.com/firefox)上的插件，它的优秀是源于[Vim](http://www.vim.org)的优秀，在这次之前我曾经两次尝试过它，但是都在不久以后放弃了，而这次我却很自然而舒服地使用着，并且将其迅速地调整到适于使用的状态，这都是因为我对Vim的操作及理解已经有了相当程度的增长，并且它与awesome的键盘操作概念相当契合一致的缘故。

[![vimperator](http://farm5.static.flickr.com/4054/4531277806_bed1823d23.jpg)](http://www.flickr.com/photos/kols/4531277806/)

如果让使用过Vim的人来使用Vimperator，则会觉得很方便快捷，只要稍许看一下帮助文件，了解一下如何打开新链接，并map一些常用的功能到快捷键上，一个适于使用且纯键盘的浏览器就诞生了。而对于从未使用过Vim的同学来说，这个插件也提供了相当丰富的帮助文档，只要有少许耐心，应该也很快就能上手。在这我贴出我的.vimperatorrc文件以供做一个参考，当然，内容还相当少：

{% highlight vim %}
set go=b "图形界面只保留底部滚动条，防止页面过宽而不知道
set focuscontent "新页面不自动聚焦到输入框，方便浏览
set showtabline=0 "不显示tab栏，用插件显示到底下statusline了
colorscheme myzenburn "设定colorscheme

nmap <silent> <leader>sc :sbclose<cr> "关闭侧边栏
nmap <silent> <leader>sm :sidebar SimilarWeb<cr> "侧边栏打开similarweb插件
nmap <silent> <leader>bm :sidebar Bookmarks<cr> "侧边栏打开书签
nmap <silent> <leader>rl :sidebar Read It Later<cr> "侧边栏打开Read it later插件

"在gmail和gr里自动屏蔽vimperator快捷键
:autocmd LocationChange .* js modes.passAllKeys = /mail.google.com/.test(buffer.URL)
:autocmd LocationChange .* js modes.passAllKeys = /www.google.com/reader/.test(buffer.URL)
":autocmd LocationChange mail.google.com :set editor=gvim -f -c 'set ft=mail'<cr>
{% endhighlight %}

插件方面我装了[隐藏command-line](http://coderepos.org/share/browser/lang/javascript/vimperator-plugins/trunk/maine_coon.js)（依赖[这个脚本](http://coderepos.org/share/browser/lang/javascript/vimperator-plugins/trunk/_libly.js)），[goo.gl短网址生成](http://code.google.com/p/vimperator-labs/issues/detail?id=262&colspec=ID%20Summary%20Project%20Type%20Status%20Priority%20Stars%20Owner)以及[buftab](http://code.google.com/p/vimperator-labs/issues/detail?id=128&colspec=ID%20Summary%20Project%20Type%20Status%20Priority%20Stars%20Owner)（将tab放到statusline上）三个，colorscheme则是[myzenburn](http://code.google.com/p/vimperator-labs/issues/detail?id=142&q=colorscheme&colspec=ID%20Summary%20Project%20Type%20Status%20Priority%20Stars%20Owner)，在配置文件里也看的到。另外还有[vimperator.vim](http://vimperator-labs.googlecode.com/hg/vimperator/contrib/vim/syntax/vimperator.vim)，用来在vim中高亮.vimperatorrc语法。

经过这样的初步设置调整增强后，Vimperator已经基本让我满意了，在无鼠标的环境下有一定的可用性，推荐喜欢Vim和喜欢awesome的人来尝试。
