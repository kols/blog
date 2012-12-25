---
layout: post
title: "Gentoo的SSH代理启动脚本"
tags:
- Gentoo
- Linux
- "代码"
status: publish
type: post
published: true
meta:
  _edit_last: "1"
  _aioseop_keywords: "gentoo,ssh,sshproxy,initscript,代理,ssh代理"
comments: true
---
<abbr title="Secure Shell">SSH</abbr> 代理是相当方便的翻墙工具，我因为不想用其他多余的工具来使用它，因此，出于方便，自己写了一个用于 Gentoo 下的 Initscript，需要的同学可以把下面这个文件放到 `/etc/init.d/sshtunnel` 修改 `username` 和 `remotehost` 两个变量并新建一个软链 `/usr/bin/sshtn` 至 `/usr/bin/ssh`，最后使用 `sudo rc-update add sshtunnel default` 来启用，默认端口7070。

<!-- more -->

{% highlight sh %}
#!/sbin/runscript
#: Author: Kane Dou <douqilong@gmail.com>
#: Description: Create ssh tunnel to remote server to establish a socks proxy.

processname='sshtn' # Symbolic link to /usr/bin/ssh to prevent
                    #+start-stop-daemon from stoping other ssh connections
args='qnTfND' # q for quiet
                #+n for output to /dev/null
                #+T for no tty allocation
                #+f for fork to background
                #+N for no command execution
                #+D for dynamic port forwarding
username='[ChangeMe]'
remotehost='[ChangeMe]'
port=7070 # Change me maybe

depend() {
    need net
    before NetworkManager
}

start() {
    ebegin "Starting SSH Tunnel"
    start-stop-daemon --start --quiet --name "$processname"
    --exec /usr/bin/sshtn -- -"$args" "$port" "$username"@"$remotehost"
    eend $?
}

stop() {
    ebegin "Stopping SSH Tunnel"
    start-stop-daemon --stop --quiet --name "$processname"
    eend $?
}

restart() {
    ebegin "Will restart SSH Tunnel"
    svc_stop
    sleep 3
    svc_start
    eend $?
}

# vim: set ft=gentoo-init-d ts=3 sw=3 et:
{% endhighlight %}

注意，如果服务器会自动切断不活动的 SSH 连接，请在 `$HOME/.ssh/config` 中加入：

    Host [RemoteServerName]
    ServerAliveInterval 60

2011/04/28 Update: 又写了个 Debian 版本，[这里](https://github.com/kols/util_scripts/blob/master/ssh_initscript/sshtunnel_debian)找
