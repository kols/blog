---
layout: post
title: "没有时间胶囊的时间机器"
date: 2012-06-26 22:46
comments: true
categories:
  - linux
  - apple
  - server
---
Mac 有一个功能叫时间机器（Time
Machine），它能备份你硬盘上的所有数据到另一个硬盘或者是一个叫
[时间胶囊（Time Capsule）](http://www.apple.com/timecapsule/) 的东西上。

时间胶囊很好，但是非常非常贵。而另一个办法则需要在 USB 上一直挂一个硬盘，这很麻
烦。两个办法都不能让我满意，而备份却是必不可少的。

于是我找到了 [netatalk](http://netatalk.sourceforge.net/)。

这是一个跑在 \*NIX 机器上的开源 <abbr title="AppleShare File Server">AFP</abbr>
服务器，它能像 Samba 之于 Windows 一样分享服务器上的文件，也可以将服务器上的一
个硬盘作为网络硬盘，发挥与时间胶囊相同的作用。要求则是一台 Linux/BSD 服务器。这
里我以 [Debian](http://www.debian.org) 为例说下用法。

<!-- more -->

## 安装

### 准备源

要支持 OS X 10.7 Lion 就必须安装 2.2 以上的版本，在 Debian 中这个版本在
`wheezy` 的源中，若未启用 `wheezy` 则将下面两行加入 `/etc/apt/sources.list`

{% highlight text %}
deb http://mirrors.163.com/debian/ wheezy main contrib non-free
deb-src http://mirrors.163.com/debian/ wheezy main contrib non-free
{% endhighlight %}

### netatalk

{% highlight sh %}
$ apt-get update
$ apt-get install -t wheezy netatalk/wheezy libgcrypt11/wheezy
{% endhighlight %}

装 `wheezy` 中的 `libgcrypt11` 是因为 `netatalk` 打包的一个 bug——它默认依赖的
这个库的版本不对，会导致 `netatalk` crash。Miserable, I know。该 bug
[已提交](http://bugs.debian.org/cgi-bin/bugreport.cgi?bug=568601#30)。

### avahi

`avahi` 实现了 Apple 的 `Bonjour` 协议，可以让你的服务器直接出现在 Finder 侧边
栏，并可以让 Time Machine 自动找到对应的网络硬盘，省去每次备份前的手动挂载。

{% highlight sh %}
$ apt-get install avahi-daemon
{% endhighlight %}

## 配置

### netatalk

在 `/etc/netatalk/AppleVolumes.default` 末尾加上

{% highlight text %}
<path/to/backup/directory> "TimeMachine on $h" allow:<username> cnidscheme:dbd options:upriv,usedots,tm
{% endhighlight %}

### avahi

新建 `/etc/avahi/services/afpd.service`

{% highlight xml %}
<?xml version="1.0" standalone='no'?><!--*-nxml-*-->
<!DOCTYPE service-group SYSTEM "avahi-service.dtd">
<service-group>
  <name replace-wildcards="yes">%h</name>
  <service>
    <type>_afpovertcp._tcp</type>
    <port>548</port>
  </service>
  <service>
    <type>_device-info._tcp</type>
    <port>0</port>
    <txt-record>model=Xserve</txt-record>
  </service>
</service-group>
{% endhighlight %}

### Time Machine

Time Machine 默认不会显示 AFP 服务器上的网络硬盘，（在 Mac 上）改个参数让它显示
出来

{% highlight sh %}
$ defaults write com.apple.systempreferences TMShowUnsupportedNetworkVolumes 1
{% endhighlight %}

## 启动

重启 `netatalk` 和 `avahi`

{% highlight sh %}
$ service netatalk restart
$ service avahi-daemon restart
{% endhighlight %}

这时候 Finder 中应该会出现服务器的图标，点击挂载（第一次需要，之后只要 `avahi`
开着 Time Machine 自己会找到）

<img class="plain" src="http://pic.yupoo.com/kols_v/C4pgfYwD/14hgGk.png"
alt="Finder" />

打开 Time Machine，看到配置好的硬盘，选择即可

<img class="plain" src="http://pic.yupoo.com/kols_v/C4pgfQEP/15D4b1.png" alt="Time Machine" />
