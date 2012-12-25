---
layout: post
title: "使用patch/diff"
tags:
- diff
- Linux
- patch
- "代码"
status: publish
type: post
published: true
meta:
  _edit_last: "1"
  _wp_old_slug: "%e4%bd%bf%e7%94%a8patchdiff"
comments: true
---
patch/diff 是一组用来创建补丁与打补丁的程序，它们都是针对plain

text而言的，所谓补丁即是对一个文件的补充。因此，这两个软件的用处基本在于对程序及配置文件加入一些需要的改动而又不用去直接改动文件本身。这样做的好处在于程序和配置文件的维护者只需要发布补丁即可对相应文件做出恰当的改动而不需要再发布整个程序，对于\*nix下的纯文本配置文件而言，创建补丁也可以让人明白自己对于一些软件的默认配置做出过哪些改动。由于WordPress主题的修改是很琐碎的，并且主题的每次升级都会将原来配置好的css文件等覆盖，因此我也用patch/diff两程序对所做的修改作记录，以便在出问题或升级后快速地恢复原样。

## diff 用法

{% highlight sh %}
# 基本用法
$ diff originalfile updatedfile > some.patch

# 多个文件用法
$ diff -ruN original/ updated/ > some.patch
#  -r 递归对比文件夹内每一个文件。
#+ -u 使用unified格式输出结果，依据网络上的资料来看使用此格式需要GNU patch，
#+   与其他patch软件不兼容，但其可生成最小且包含上下文的patch文件。
#+ -N 将源文件夹内不存在的文件当作空文件处理，patch便会时自动生成此文件。
#+ 注意源文件与更改过的文件位置不能颠倒
{% endhighlight %}

## patch 用法

{% highlight sh %}
# 基本用法
$ cd /path/to/file/to/be/patched
$ patch [filetobepatched] < some.patch
# unified格式可省略文件名

# 一些参数
$ patch [-pNum] [--dry-run] [-b] < some.patch
#  -pNum 去掉patch文件中对应文件路径之前的Num个/，例如：
#+ 原路径为/usr/src/a/b.c，设置-p1后变为usr/src/a/b.c，
#+ 设置-p3后变为a/b.c，这在为与patch文件中路径不同的文件打补丁时用到。
#+ --dry-run 模拟运行只输出运行结果但不实际运行，在打补丁前可用此参数测试一下。
#+ -b[ackup] 备份被patch的文件。
#+ 另外可以试试--verbose，输出的信息很囧。
{% endhighlight %}
