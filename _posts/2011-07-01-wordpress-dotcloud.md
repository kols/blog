---
layout: post
title: WordPress on dotCloud
tags:
- dotcloud
- web
- WebTech
- WordPress
status: publish
type: post
published: true
meta:
  _edit_last: "1"
  _wp_old_slug: build-word-list-using-python-2
comments: true
---
[dotCloud](http://dotcloud.com) 是一个平台，或者是一个有人代为管理的服务器。它的主要用途是让人们免费的发布自己的
Web 应用，并且在其之上省去了管理服务器的工作，也就省去了相当的繁琐，使得发布应用更快速方便，并且使得 Developer
专注于应用，而不用为发布操太多心。想想那些名字，apache、nginx、php-fpm、uwsgi、SSL
等等等等，各种各样的各不相同的设置与调试只会让人觉得麻烦、不轻松，虽然这其中也有知识。 然而 dotCloud 的应用发布则相当简单：
（dotcloud 的 python
客户端安装及命令行基本使用方法请参考[官方文档](https://docs.dotcloud.com/)，很简单。）

<!-- more -->

1.  新建 namespace。

        $ dotcloud create kdblue

2.  建立 Build File。

        dotcloud.yml:

        www:
          approot: blog
          type: php
          instances: 3
        db:
          type: mysql


    -   `www` 与 `db` 为 service 名称。
    -   `approot` 指定该 service 所在的本地根目录。
    -   `type` 指定应用类型（语言、服务器）。
    -   `instances` 设置进程数，若是 php 应用则会启动相应数量的 php-fpm 进程。

3.  将设置推送至服务器。

        $ dotcloud push kdblue .

这样，一个名为 Build File 的 `dotcloud.yml` 文件就完成了所有服务器端的设置，简单并且轻量。 接下来的工作就是
WordPress
的自身设置，根据[著名的5分钟安装](http://codex.wordpress.org/Installing_WordPress#Famous_5-Minute_Install)教程教我们的：

1.  搞到 WordPress。
2.  在服务器上搞定数据库设置。
    1.  首先获取 mysql 数据库密码及地址。

            $ dotcloud info kdblue.db
            build_revision: rsync-1309344965.25
            cluster: wolverine
            config:
                hostname: kdblue-default-blog-db-0
                mysql_password: tpKsNbSjxXlb7I8DM3RH
            created_at: 1309267100.7312429
            ports:
            -   name: ssh
                url: tcp://53e93k2c.dotcloud.com:9219
            -   name: mysql
                url: tcp://53e93k2c.dotcloud.com:9220
            state: running
            type: mysql


    2.  登录并创建 WordPress 用数据库。

            $ dotcloud run kdblue.db -- mysql -u root -ptpKsNbSjxXlb7I8DM3RH
            (Below in mysql shell)
            > create user 'dql' identified by 'password';
            > create database wordpress;
            > grant all on wordpress.* to 'dql'@'%'
              identified by 'password';
            > flush privileges;


3.  重命名 `wp-config-sample.php` 为 `wp-config.php`。
4.  修改 `wp-config.php` 中的数据库设置。

        define('DB_NAME', 'blog');
        define('DB_USER', 'dql');
        define('DB_PASSWORD', 'password');
        define('DB_HOST', '53e93k2c.dotcloud.com:9220');


5.  确认一下文件树结构。

          myapp/
          |- dotcloud.yml
          |_ blog/
             |_ wordpress/
                 |_ wp-config.php
                 |_ wp-contents/
                 |_ ...


6.  将设置完毕的 WordPress 推送至服务器并重启进程。

        $ dotcloud push kdblue .
        $ dotcloud restart kdblue.www

    至此 WordPress 便部署成功，访问
    `http://53e93k2c.dotcloud.com/wordpress/wp-admin/install` 即可完成安装。

7.  有域名的可以设置自定义域名，并按说明更改相应 DNS 设置。

        $ dotcloud alias add kdblue.www www.example.com

之后是一些有用的 Tip。

-   因为每次 `push` 都会将服务器端的更改删除（例如安装插件），因此可以使用一个 Post-Install Hook 来避免。

        #!/bin/sh
        if [ -d ~/data/wp-content ]
        then
              rm -rf ~/current/wordpress/wp-content
        else
              mkdir -p ~/data
              mv ~/current/wordpress/wp-content ~/data/wp-content
        fi
        ln -s ~/data/wp-content ~/current/wordpress/wp-content


    将此文件命名为 `postinstall` 加上执行权限后放在 `approot` 目录下，这样每次 `push`
    后之前网页端所做的更改都会保留。（但升级 WordPress 本体似乎必须在本地执行后推送）

-   若要直接在域名处（`www.example.com`）而非子目录处（`www.example.com/wordpress`）显示
    WordPress，则需要自定义一项 nginx 设置。

        try_files $uri $uri/ /index.php;

    保存为 `nginx.conf` 后放在 `approot` 目录中。

-   [wwwizer](http://www.wwwizer.com/) 可以免费将 dotcloud 不支持的 naked domain
    301重定向到前缀 www 的子域名，免费且不用注册，直接 A 记录指向其提供的 IP 即可。
