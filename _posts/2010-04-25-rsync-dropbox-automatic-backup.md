---
layout: post
title: "Rsync, Dropbox与自动备份"
tags:
- bashscript
- dropbox
- Linux
- rsync
- ssh
- vimwiki
- "代码"
- "备份"
status: publish
type: post
published: true
meta:
  _edit_last: "1"
  _aioseop_description: "介绍rsync结合等软件的备份方案，文中以备份vimwiki为样例，给出详细注释的脚本代码，方便理解与学习。"
  _wp_old_slug: rsync-dropbox-with-automatic-backup
  _aioseop_keywords: backup,code,shellscript
comments: true
---
自从在GR中读某人一篇介绍[rsync](http://samba.anu.edu.au/rsync/)的文章后（抱歉忘记出处了），就一直对其抱有想试一试的想法，但一直拖到现在，也不得不佩服一下我自己。昨天终于坐下来研究了半天rsync，最后成功将其应用到我的vimwiki的内容发布及备份工作上。不得不感叹这个软件的灵活强大，搭配上cron、tar及dropbox后几乎可以完成任何我所需要的备份工作（主要备份各种文本配置文件）。

关于vimwiki的介绍你可以在本博客上找到，这是一个方便高效率的知识管理工具，为此我也花了点心思将其调整到一个适合使用的状态（例如设置快捷键，写css文件，加入各种语法高亮等）。而这些设置，都是慢慢积累起来的，就像每个vim用户的vimrc文件一样，不是一朝一夕就能配置到完全适合的样子，因此对配置文件的备份就显得相当重要。

而另一个更重要的东西，当然就是我使用vimwiki所写下的各种笔记，这些笔记都是我自己创作的内容，是我在生活、学习过程中实践思考的一些成果，应该说，这些东西——笔记——对于我而言都是相当重要的东西，它就相当于一部更详细的草稿，是自己灵感及经验的记录。如果因为某些意外情况而导致这些文件遗失的话，会是相当让人沮丧苦恼的。

出于这个原因，我开始研究rsync。

## 思路

rsync可以在各个Linux发行版中找到，如果没有找到，也应该可以通过包管理系统找到并自行安装。而Windows下我认为通过[Cygwin](http://www.cygwin.com)使用rsync会是一个比较好的方法，但我还未试过。

第一次使用，应该好好看一下"man rsync"，相当长，但并非每个功能都是每个人需要用到的，实际上，在我的情况中，我只使用了大约15个左右的Option，在下面的Script中可以看到。

另外，可以搭配rsync使用的软件是cron，这应该算是Linux的标配软件，它能够以一个用户设定好的固定周期来执行某些命令，当然也可以是脚本文件，这样我们对rsync的备份应用便可以完全自动化，无需人工干预。

[Dropbox](https://www.dropbox.com/referrals/NTI4MjMwMDI5)*(2010-05-21 补充：由于众所周知的原因，Dropbox这个优秀的网络服务已经正式享受到了各种鸡鸣狗盗之辈所无法企及的黑名单待遇)*早就声名在外了，它是一个个人网络硬盘，可以在不同的机器、系统上同步其存储的内容。说的简单点，你在家中电脑上把一个文件同步到Dropbox后，到办公室电脑上同步后便可以直接使用这个文件，不用另外的U盘拷贝或电邮发送。而这其中所谓的同步，就与一般的复制粘帖操作完全无异。因此，这是一个相当方便的服务，它相当于把网盘的操作简单化、傻瓜化。

至此，我的大致思路应该已经比较明显了。我通过shell script将这三者融合起来，首先将我的数据通过rsync备份（复制）到Dropbox及发布到我的博客，并通过cron使其自动化。

另外上文中提到的tar，则是压缩软件，在用rsync将vimwiki的文件树完全备份到Dropbox及博客之后，我再使用tar将其整个目录打包为一个压缩文件，并通过mutt发送到我的gmail信箱，这样，我就实现了三重备份，即Dropbox、博客及Gmail三方。这样，我的数据应该是比较安全的，除非世界末日，否则这三个地方同时丢失数据的可能应该很小。

## 实现

{% highlight sh %}
#!/bin/bash

# 整个脚本的"echo -e"输出的几乎都是debug信息，之后在cron中运行此脚本，debug信息会记录到我所设定的log文件中。

# Variables
Time="`date +%Y%m%d_%H%M`"
BackupDir="backup/$Time" # 备份目标目录中会被删除（因备份源中此文件被删除或移往别处等）的文件将被一致这个目录
Filter="H_vwbf*" # 这两行为过滤选项，详情看man page中FILTER RULE条目
Filter1="P_backup/"
Source="/data/Documents/vimwiki/" # 这两行为备份源/目标目录
Target="/home/kols/Dropbox/backup/vimwiki/"
RsOpts="-avzubrKh --filter=$Filter --filter=$Filter1 --write-batch=vwbf --protocol=29 --progress --delete --del --stats --backup-dir=$BackupDir" # 这是rsync的参数，需要花些时间研究你自己要用到的。你可以对照man page来看看我的这些参数各是什么意思

cd $HOME
# Local Rsync Backup
echo -e "********************************n*[`date`]*n********************************n"
rsync $RsOpts $Source $Target
echo -e "====== Dropbox Backup Completed! ======n"

# Upload rsync batch file to remote host via rsync
#+这个部分使用了rsync的batch mode功能，因为我在Dropbox和博客上的vimwiki文件目录树相同，
#+因此在rsync备份前所做的文件一致性验证只需做一次，然后将batch file上传至博客服务器后
#+在服务器上用batch file中的验证数据进行备份，就可避免重复验证浪费资源。详情仍请参看
#+man page。
Source="/data/backup/rsbatchfile/vwbf*"
Target="username@remotehost:path/to/dir"
RsOpts="-avz"
rm -f $Source
mv vwbf* /data/backup/rsbatchfile/
rsync $RsOpts $Source $Target
echo -e "====== Batch File Transfered! ======n"

# Do rsync in batch mode using the batch file received
ssh yourusername@example.com 'cd backups/rsbatchfile/ && ./vwbf.sh /path/to/your/backup/dir/'
echo -e "====== Remote Backup Completed! ======n"

# Make tarball backup file
TarballName="vw_$Time.tar.gz"
TarballDir="/path/to/your/local/backup/dir/"
Source="vimwiki/"
cd /data/Documents && tar capsf $TarballName $Source && mv *.tar.gz $TarballDir # 将整个目录作成压缩文件

# Send tarball to gmail via mutt
if [ -e "$TarballDir$TarballName" ]
then
  echo -e "====== Tarball Created! ======n"
  mutt -s "Vimwiki tarball backup" -a $TarballDir$TarballName -- youremailaddress@gamil.com < /dev/null # 使用mutt发送压缩文件至gmail信箱
  echo -e "====== Tarball Sent! ======n"
else
  echo -e "====== Tarball is Not Successfully Created. Backup Failed! ======n"
  exit 2
fi
{% endhighlight %}

之后配置cron，这样做：

{% highlight sh %}
$ crontab -e # 编辑本用户的crontab（相当于计划时间表）

# 这里我的这个脚本会在每周三、六晚九点自动执行。
# min hour dayomon mon dayoweek command
# run vimwiki backup script(to dropbox, remotehost, gmail) twice a week(Wednesday, Saturday)
0 21 * * 3,6 /data/shell_scripts/management/vwbk2dbx_rhs_ml.sh >> $HOME/bklog/vwbk.log # 后面这个就是log文件，每次执行脚本后其debug信息会被append到这个日志文件，便于查错。

#+详细的crontab语法请看：
$ man 5 crontab
{% endhighlight %}

## 补充

由于rsync在远程备份中默认使用ssh，因此在这个脚本中另一个关键点是配置ssh的key验证，也就是无需输入密码直接登录远程服务器，如果要输入密码，那么这个脚本是无法完成自动化执行的。但这不是本文的要点，且比较容易，故请自行搜索网络资源寻找方法。

这个备份方案可以算作抛砖引玉，你可以将其应用在备份任何文件上，所要做的只是修改一下脚本文件的相应内容。

另，从本文开始之后的文章几乎都会如此排版，此版式的灵感来源于[可能吧](https://www.kenengba.com)，在此感谢它的作者们。*（2012-02-07 补充：此改动作废）*

不过我对此配色方案还不是十分地满意，因此，如果谁有更好的色彩搭配（指文章中的heading）请不吝赐教;-)
