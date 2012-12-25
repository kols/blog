---
layout: post
title: "Ubuntu 10.04 Intel显卡性能问题的应对"
tags:
- "10.04"
- display
- graphic
- intel 8xx
- Linux
- performance
- ubuntu
- "代码"
status: publish
type: post
published: true
meta:
  _edit_last: "1"
  _aioseop_keywords: "9.10,9.04,显卡,显示,黑屏,vesa"
  _wp_old_slug: ubuntu-10-04-intel-graphics-performance-problems-should
comments: true
---
升级到 Ubuntu 10.04 后我的 *Intel 82852/82855* 显卡一直不能与系统协调的工作，表
现就是只能使用vesa驱动，无法开启 <abbr title="Kernel Mode Setting">KMS</abbr>，这些都或多或少导致了一些不便，比如动态开机画面分辨率很低，播放电影帧数不够，以及无法开启 compiz 等。

昨天在看过 Ubuntu 10.04 的 Release log 中相对应的一些方法，并按着其中一个方法做了之后这些不愉快这些机能表现上的倒退问题大部分都解决了，如果不是完全解决的话。这个方法的主要内容在[这里](https://wiki.ubuntu.com/X/Bugs/Lucidi8xxFreezes)可以找到，参照其中的 Workaround F 部分。如果需要更多信息的话，可以点击此 Workaround 中的链接。 在这里，为了方便，我将这个方法直接写在此处。

1.  打开 `/etc/X11/xorg.conf`，将如下内容替代原内容，建议先备份源文件。

{% highlight text %}
#注意：此方法只在我的机器上试过并通过，因此，如果显卡型号与我所用不同，可能无法成功。
Section "Screen"
        Identifier  "Configured Screen Device"
        Device      "Configured Video Device"
EndSection

Section "Device"
        Identifier      "Configured Video Device"
        Option          "AccelMethod"   "UXA"
        VideoRam        130560
EndSection
#其中倒数第二行的VideoRam需要根据实际内存大小来填写，建议看一下Workaround中包含的链接页面中的说明。
{% endhighlight %}

2.  启动时开启 `modeset`，方法因 bootloader 不同而不同。grub 直接在 kernel 行加入 `i915.modeset=1`；grub2 则请自行 google。
3.  重启，注意非与我相同之硬件重启可能导致开机不能，在这种情况下只需将备份的 `xorg.conf` 再复原。

补充：成功后 (s)mplayer 或 vlc 播放视频文件可能会有大问题，请换成 x11 模块播放。

## 另

作为一个成功的 Linux 发行版的 Ubuntu，却在10.04这个长期支持版上出现这样一种兼容
性问题，绝对不应该，要知道 Intel 的显卡是千千万万遍布全球各地的电脑都在使用的。
如果从没有使用过 Ubuntu，并且只是想看看 Linux 到底是什么的人装上 Ubuntu 后却看到一个大黑屏，基本上他之后所能说出的人类语言就是“所谓 Linux 就是装完后直接黑屏的操作系统”。可能，在速度上，美工上，这一版本的确做到了较大进步，然而，这种进步的代价就是许多从9.10升级而来的人无法正常工作，而相同的情况在 Windows 或 Mac 应该是不太会发生的。说到底，这是一种不负责的行为，为了一些指标而牺牲最基本的可用性，这是很昏头的，人说先跑起来再考虑跑得快，这边则直接快到人人都要 hack 一下设置文件才能正常使用了，太直接的本末倒置。

为了正常使用一台电脑，要看完我这么一篇长长的文章，是人都会觉得相当无聊。但究竟值与不值就如人饮水冷暖自知，而无需去多作评价了。
