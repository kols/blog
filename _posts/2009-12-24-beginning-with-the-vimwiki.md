---
layout: post
title: "初用vimwiki"
tags:
- Google
- Linux
- moinmoin
- Vim
- vimwiki
- wiki
status: publish
type: post
published: true
meta:
  _edit_last: "1"
  _aioseop_description: "介绍vim的个人笔记插件vimwiki，包括如何安装使用及其基本特点。"
comments: true
---
为了能够节约付费主机那寸MB寸$的空间，并且，在偶然的 Google Reader 打发时间之旅中发现了 vimwiki 后，我决定试用之，原因除了上面讲的还得加上那牛\*到闪死人的 vim 光环。（又错按 esc 了...）
vim 的强大自不用多费口舌，今天要写的 vimwiki 则是建筑在其之上的用来做个人笔记的一个——插件，对，只是 vim 的一个插件而已，然而，功能则不算弱，自然，只是针对其受众面而言——这是个人笔记，而非 mediawiki 这种给类似 wikipedia 的这种怪兽级应用使用的 wiki 后台。

现阶段 vimwiki 能做的事情大致有这些：

1.  为笔记附加格式，也就是附加各种纯文本做不到的类似粗斜体、大字号标题等效果。
2.  直接输出 html，无需依赖任何第三方软件或插件，除了 vim 本身。
3.  依赖 vim 强大的文本编辑能力大大提高笔记编写以及整理的速度。
4.  以纯文本也即 plain text 格式保存，无论在哪里都能看能修改，良好的便携性。

来说说其具体用法，首先是安装，到 [vimiwiki 插件页面](http://www.vim.org/scripts/script.php?script_id=2226)下载最新版并按其页面步骤安装，详细方法如下(Linux)：

1.  解压下载下来的文件得到 `vimwiki_*_*.vba`，并将其复制到 `~/.vim/`
2.  用 vim 或 gvim 打开此文件。
3.  输入命令 `:so %`
4.  安装完成
5.  windows 应该也差不多

之后用 `:h vimwiki` 查看其帮助文件以学习如何使用，开头有一个快速入门，十分简单明了，可以看看以便确实地入门，如果之前有编辑 wiki 的经验则应该很快能够上手。此外具体的语法和用法可以看此帮助文件或下载这个 [pdf](http://habamax.ru/myvim/data/vimwikiqrc.pdf)。

说说使用感想，再花了一点时间把原来写在自建 moinmoinwiki 中的两篇文章转到vimwiki 中之后，我发现其有一个缺点，即无法在 list 的对象中手动换行，于是我用嵌套 list 的方法（即在 list 对象中需要换行的地方加一个子 list 对象）来变通，基本可以达到效果。另外，其粗体斜体等语法似乎不支持中文。

最后附上一个 [vimwiki 的原文](http://dl.dropbox.com/u/2823002/blue_attachs/WordPressSettings.wiki)及一个生成后的 [html](/notes/WordPressSettings.html) 以供试看效果。*（2010-04-23 22' 由于 dropbox 被墙，链接失效。）*
