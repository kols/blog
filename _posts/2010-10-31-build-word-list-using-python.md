---
layout: post
title: "用 Python 建英语单词表"
tags:
- english
- Org-Mode
- pic
- Python
- "学习"
status: publish
type: post
published: true
meta:
  _edit_last: "1"
comments: true
---
今天受到 dofine
同学[这篇文章](http://blog.dofine.info/2010/10/use-org-mode-to-recite-words.html)
的启发，想到也可以用相同的办法（Org-Mode 的 Checkbox）来背平时用
[Stardict](http://stardict.sourceforge.net/) 记下的陌生单词，于是写了一个
[Python](http://python.org) 脚本来将单词整理起来，过程中使用了 Dict.CN 的
[API接口](http://dict.cn/ws.php?q=word) 获取单词的音标，释义以及例句。效果看图：

[![image](http://pic.yupoo.com/kols/AAxA5L5B/medium.jpg)](http://pic.yupoo.com/kols/AAxA5L5B/11io9J.png "owlb1")

<!-- more -->

输入源：

    delineate
    parity
    heterogeneous
    deterministic
    heterogeneous,
    Intersect
    impede

脚本文件这里找：[owlb.py](http://github.com/kols/util_scripts/blob/master/owlb.py)
，用法为输入一个纯文本单词文件（格式如上：一个单词一行），输出相应 `.org` 文件，
具体请看 `python owlb.py --help`。

*2010/11/05 Updated：*现在脚本可以在原有单词列表上附加新单词，不会重复，只要将原列表作为输出文件即可。

*2011/03/17 Updated：*重写后，现在的运行速度提高至原版的十倍。
