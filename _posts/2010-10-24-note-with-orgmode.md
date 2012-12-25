---
layout: post
title: "如何用 Org-Mode 做笔记"
tags:
- Emacs
- emacs
- Org-Mode
- pic
status: publish
type: post
published: true
meta:
  _edit_last: "1"
  _aioseop_keywords: "org-mode,orgmode,emacs,note,笔记"
  _wp_old_slug: howto-work-with-orgmode
comments: true
---
[*Org-Mode*](http://orgmode.org/) 是
[*Emacs*](http://www.gnu.org/software/emacs/) 中的一个 Major Mode
，主要用于做笔记，管理待办事项（TODO list）以及做项目计划（摘自其《用户手册（The Org
Manual）》）。当然，这是笼统的描述，就像说 *Emacs*
只是一个编辑器一般有种别样的幽默，但是今天我正是以其基本的笔记功能作为主题来简略地介绍一下这个有用并且好用的工具。
 整篇文章只叙述 *Org-Mode* 的使用方法及最终效果，不会对各种设置做介绍也不会涉及 *Emacs*
的使用，因此，这是一篇给所有人看的文章。

### 概览

[![image](http://pic.yupoo.com/kols/AzqxXL3X/medium.jpg)](http://pic.yupoo.com/kols/AzqxXL3X/IAYB1.png "orgmode1")

这张图是我最近正在学习的 [*Python*](http://www.python.org)
的笔记的截图，整个笔记结构很清晰，最上层的蓝色大字是标题，而后渐次缩小并改变颜色的以 `*`
为首的条目均是按层级内嵌的各种小标题，其中缩进最远的则是标题中的具体内容。可以看到，以颜色以及字体大小来凸显笔记的层级区分相当的醒目，并且每一层次的内容均可收起以节省显示空间来专注于当前需要记录或查看的条目，这样的排版使得笔记的可看性也提高许多，而条目尾部的冒号部分则是该条目的标签（Tag），在搜索笔记时这是一个重要的筛选标准，可以快速定位至相关条目。值得注意的是，那些被
`=` 包裹的文字在之后导出（Export）为 HTML 或 PDF 格式后会带有相应格式。另外其中 `#+BEGIN_SRC python`
至 `#+END_SRC` 之间的程序源代码在输出时亦会高亮显示语法。而最下面的 Footnotes
则是脚注，这张图片未显示其效果，具体则是与一般看书时遇到的脚注差不多。
 这是对 *Org-Mode*
最初的概览，之后的部分则会从笔记的两个重要方面着手，查看其真正的实用性，并简单介绍除记录外其另一个有用的功能，最终你能看到的是一篇完全用
*Org-Mode* 记录下的笔记。
 而第一步则是我们该如何以最高的效率及最小的麻烦写下一条笔记。

<!-- more -->

### 捕捉（Capture）

电脑中笔记的记录，首要的便是方便、快捷，也就是在想写的时候就能马上写，并且不用担心任何例如归类，存档之类的琐碎问题。就像随身的纸笔，拿来即写，写完即成，没有多余的动作。
 这里我们要说的就是 *Org-Mode* 的 org-capture 功能，它的功能就是“捕捉”，而捕捉所需的就是快速、准确、不冗杂。
org-capture 的操作流程如下：

[![image](http://pic.yupoo.com/kols/AzfMqdMs/medium.jpg)](http://pic.yupoo.com/kols/AzfMqdMs/mNCTL.png "orgcap1")

这张图是命令调出 org-capture 后的第一个介面，
我需要做的是在画面下方这些我已预设好的模板（Template）之中选择一个来进行记录。

[![image](http://pic.yupoo.com/kols/AzfKpnsr/medium.jpg)](http://pic.yupoo.com/kols/AzfKpnsr/Q062A.png "orgcap2")

选择 pick 模板后便转入这个介面，可以看到，现在按照模板的要求我必须在窗口最底部的 Mini buffer
中输入这条笔记的主题（Subject），也就是标题，输入完标题后还会需要输入标签，之后光标则会跳至图中 `%?`
处来完成最后的笔记正文的输入。另外可以看到的是图中除了我上述所说的三个手动输入部分以外，其他内容均是模板预设的内容，例如笔记创建时间（Created），以及与笔记相关的超链接（Link）。

[![image](http://pic.yupoo.com/kols/AzfSUoJF/medium.jpg)](http://pic.yupoo.com/kols/AzfSUoJF/CRDKe.png "orgcap3")

这就是一条输入完毕的笔记的样子，之后需要做的就是按 `Ctrl-c` 两次进行保存，当然如果写完后又觉得不需要了则可以
`Ctrl-c Ctrl-k` 进行删除，而如果需要将笔记保存至默认文件外的其他文件中，则是按 `Ctrl-c Ctrl-w` 进行
`refile` 。
 到此整个笔记记录的流程就结束了，所写下的这条笔记会按照模板的预设被保存到相应的文件中去，在这里则是进入名为 `pieces.org`
的文件中去，看下面这张图，它到了文件的最下面。

[![image](http://pic.yupoo.com/kols/Azg0yk72/medium.jpg)](http://pic.yupoo.com/kols/Azg0yk72/dliE4.png "orgcap4")

整个过程中我始终关注要记录的是什么，而模板则解决了其他繁杂重复但仍有记录价值的部分（时间，标签，保存至相应文件等）。我只需要：

1.  **快捷键呼出笔记介面**
2.  **输入笔记**
3.  **快捷键保存**

其中1、3步需要做的只是敲击几下键盘，第2步则只关注并输入真正重要的内容，因此，整个过程是简单有效的。



然而，高效的记录只是第一步。当笔记完成之后，特别是当笔记条目累积至一个较大的数目的时候，快速找到所需要的内容便成为一个亟须的功能，这也就是文章下一部分的内容——搜索。

### 搜索

搜索之所以重要是因为笔记就是用来记录那些不记下来便会忘记的内容，因此，笔记最重要的一个用处就是查阅，而在相当多的条目中光靠一般的全文搜索是比较难以快速准确地定位到某条特定内容的。
*Org-Mode* 则提供了多种搜索方式，先来看其中的几个。

[![image](http://pic.yupoo.com/kols/AzirLsss/medium.jpg)](http://pic.yupoo.com/kols/AzirLsss/WkVtx.png "orgsearch1")

按下 `Ctrl-c a` 后下半窗口弹出的是 *Org-Mode* 的日程命令，多数搜索命令也在其中，包括搜索标签、属性（ `m`
)，包含关键词的条目（ `s` ）以及所有关键词的位置（ `/`
），这些搜索各适合不同的情况，标签搜索自然是比较快速的定位方法，但是若关键词不在标签中或根本没有使用标签则退而求其次直接搜索关键词，这样得到的结果可能比较多但是因为它支持正则表达式，如果活用应该也能相当方便的找到所需内容。而若需要定位关键词在
org 文件中所有出现的位置，则 `Multi-occur`
是最好的方式。我常用的是前两种，它们都会定位到包含关键词的条目，这样浏览一下标题就基本能够找到需要的内容。
 下面看一下实际操作时的介面：

[![image](http://pic.yupoo.com/kols/AzirP9xU/medium.jpg)](http://pic.yupoo.com/kols/AzirP9xU/DMGg2.png "orgsearchmatch1")

这张图片匹配了标签中含有 `g1` 的条目，通常我要备份手机里内容的时候就会查看那条 `g1 backup list`
中记下的内容。另外画面最下方的 Mini buffer 中显示出了该条笔记在哪个文件的哪个标题的哪个小标题中，按 `Enter` 或 `Tab`
都可直接跳至该文件。

[![image](http://pic.yupoo.com/kols/AzirNuaY/medium.jpg)](http://pic.yupoo.com/kols/AzirNuaY/4L0ez.png "orgsearchkw1")

这是全文关键词搜索的结果，可以看到这里显示的条目要比标签搜索的结果多出一些，并且包含了一条明显与 *G1* 无关的 *Python*
笔记，这是因为那条笔记里也包含 `g1` 这两个字符。同样下方也指名了该笔记的详细位置。

[![image](http://pic.yupoo.com/kols/AzirTyfv/medium.jpg)](http://pic.yupoo.com/kols/AzirTyfv/FjFFR.png "orgsearchmo1")

在这里所有 org 文件中包含 `g1` 这两个字符的所有位置都被找了出来，包括标题与正文，左侧数字指明其在该文件第几行。


 这就是 *Org-Mode*
中的几种主要搜索方式，基本上可以很方便的找到所需的内容，当然搜索的质量也是与记录的质量相挂钩的，例如如果做好了每条笔记的标签工作，则能够在同时使用多个标签作为关键词的情况下迅速匹配出所需的条目。
 然而，除了这三个方法以外， *Org-Mode* 另外还提供了一种名为 `Sparse tree`
的搜索方法。这种方法的主要应用是在某个文件中迅速定位至所需内容并且自动隐藏其他的无关内容，比如这样：

[![image](http://pic.yupoo.com/kols/AzjvqRh7/medium.jpg)](http://pic.yupoo.com/kols/AzjvqRh7/16SBK.png "orgsparsetree2")

关键词为 `fixme`
，可以看到在图中被高亮了，概览中原本包含相当长的文本内容，现在全被隐藏了，只有与搜索条目相关的内容被显示了出来。从而，这个搜索方法比较适合定位至文件中某些做过标记的地方，当然，若用来搜索需要的内容也同样方便。


 这样就总结了 *Org-Mode*
中我所知道的几种搜索方式，它们各有各的适合用途，合理使用就能够快速找到所需的内容。而下面接着的话题则并非笔记中所必须的步骤，然而，它却是
一个实用的功能，也是 *Org-Mode* 强大灵活的一个体现，也就是——笔记的导出。

### 导出（Export）

导出功能可以方便的将整理好的 org 文件转换成多种适合发布的文件类型，包括 HTML 、 PDF 、 DocBook
及其他多种格式，这里我只介绍自己经常用的 HTML 导出。

[![image](http://pic.yupoo.com/kols/AzpoHJdl/medium.jpg)](http://pic.yupoo.com/kols/AzpoHJdl/MoDF6.png "orgexport1")

图中可看到 *Org-Mode* 的导出功能很庞大，基本涵盖了所有实用的文件格式。


 导出文件并不需要额外的操作，只需要输入导出命令（ `Ctrl-c Ctrl-e h` ）即可，文件会自动被导出为 HTML
文件，但其只有基本的 CSS 格式，当然这可以通过简单地自定义相应的 CSS
文件来解决。另外在对包含源代码的文件进行导出操作时会自动为其高亮显示语法，效果与在 *Emacs*
中的语法高亮完全一样，另外其针对源码还可先执行然后导出运行的结果，这对于诠释语法以及到达某些特殊需求有着相当大的作用。除此以外，还可以进行选择性导出，可以仅导出文件中的某些或某一部分内容，或者可以直接生成文件相应的
HTML 语法以适合在其他程序中发布（如 *WordPress* ）。

 不过导出只是整个发布环节中的第一步。在得到需要的文件后上传至相应服务器也是一件麻烦事，然而， *Org-Mode*
却想到了这一步，提供发布（Publish）的功能，这样便能够自动化地完成从转换格式到上传文件乃至整个项目文件夹的复杂工作，相当便利。细心的人可以发现在上图的最下两行即是发布命令，相应的可以发布单一文件，发布整个项目，或发布所有项目。这些都只需在配置文件中做出相应设置即可，但这里不会涉及。

最后，看一篇笔记输出并发布后的最终效果：[Pythonotes](http://kdblue.com/notes/pythonotes.html)
