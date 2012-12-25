---
layout: post
title: "使用 scrapy （Part I）"
create_date: 2012-07-16 13:42
date: 2012-07-18 14:41
comments: true
categories:
    - python
    - scrape
    - crawl
    - scrapy
    - twisted
---
[scrapy](http://scrapy.org) 是一个高级的网页内容抓取工具，主要用来自动化访问网
页并程序化提取其中对用户有用的内容。scrapy 构建于流行的 python 异步框架
[twisted](http://twistedmatrix.com) 之上，利用该框架的特点达到抓取的高效率，但
其面向用户的接口则是完全经过封装并与普通 python 代码写法并无二致的，因此不熟悉
twisted 的用户也不用担心。

<!-- more -->

## 安装

由于 scrapy 是一个 python package，所以先安装 virtualenv 及 pip：

{% highlight sh %}
$ sudo apt-get install virtualenv python-pip
{% endhighlight %}

接着安装 scrapy：

{% highlight sh %}
$ virtualenv --no-site-packages scrapy
$ source ./scrapy/bin/activate
$ pip install scrapy
{% endhighlight %}

## 使用

scrapy 提供的各种工具能大量简化实际抓取时的代码量，同时其对抓取过程的抽象化也很
到位，方便用户对其控制的同时也提供了相当的自动化特性。

这里就用罗森的官方网站（http://www.lawson.com.cn/shops）为例，说明一下如何使用
scrapy。示例的结果是得到一份罗森在上海的所有便利店的清单。

### 新建 Project

首先用 scrapy 新建一个 project：

{% highlight sh %}
$ scrapy startproject lawson
{% endhighlight %}

熟悉一下目录结构：

{% highlight text %}
lawson
├── lawson
│   ├── __init__.py
│   ├── items.py
│   ├── pipelines.py
│   ├── settings.py
│   └── spiders
│       └── __init__.py
└── scrapy.cfg
{% endhighlight %}

- `items.py` 定义抓取结果中单个项所需要包含的所有内容，比如便利店的地址、
  分店名称等。
- `pipelines.py` 定义如何对抓取到的内容进行再处理，例如输出文件、写入数据库等。
- `settings.py` 是 scrapy 的设置文件，可对其行为进行调整。
- `spiders` 目录下存放写好的 spider，也即是实际抓取逻辑。
- `scrapy.cfg` 是整个项目的设置，主要用于部署 scrapyd 服务，本文不会涉及。

### 第一个 spider

scrapy 中最为重要的部分就是
[spider](http://doc.scrapy.org/en/0.14/topics/spiders.html)。它包含了
分析网页与抓取网页数据的具体逻辑，也就是说对网页上任何内容的任何处理都在 spider
中实现。因此，这是 scrapy 整个框架的核心。

首先定义
[Item](http://doc.scrapy.org/en/0.14/topics/items.html#module-scrapy.item)：

{% highlight python %}
from scrapy.item import Item, Field


class ConvStore(Item):
    name = Field()
    branch = Field()
    alias = Field()
    address = Field()
    city = Field()
    district = Field()
    longitude = Field(serializer=float)
    latitude = Field(serializer=float)
{% endhighlight %}

这里定义了一个便利店（`ConvStore`）所应包含的内容（
[Field](http://doc.scrapy.org/en/0.14/topics/items.html#item-fields) ），会在
spider 中用到，用来承载其抓取下来的实际数据。

现在来看 spider：

{% highlight python %}
from scrapy.contrib.linkextractors.sgml import SgmlLinkExtractor
from scrapy.contrib.spiders import CrawlSpider, Rule
from scrapy.selector import HtmlXPathSelector

from lawson.items import ConvStore


class LawsonSpider(CrawlSpider):
    name = 'lawson'
    start_urls = ['http://www.lawson.com.cn/shops']
    allowed_domains = ['lawson.com.cn']
    rules = (
            Rule(SgmlLinkExtractor(allow=r'list\?area_id=\d+', tags='a'),
                callback='parse_store_list'),
            )

    def parse_store_list(self, response):
        hxs = HtmlXPathSelector(response)
        store_selectors = hxs.select('//div[@class="ShopList"]/table/tr')[1:]

        for s in store_selectors:
            store = ConvStore()
            store['name'] = u'罗森'
            store['alias'] = u'Lawson'
            store['branch'] = s.select('th/p/text()').extract()
            store['address'] = s.select('td/span/text()').extract()
            store['district'] = response.meta['link_text']
            store['city'] = u'上海'

            yield store.load_item()
{% endhighlight %}

- 首先可以看到代码很短，整个 `LawsonSpider` 类只有二十多行，但已经能够为我们抓
  取所有必需的信息。
- scrapy 提供了一些基本类（Base class）让我们去继承，
  [`CrawlSpider`](http://doc.scrapy.org/en/0.14/topics/spiders.html#crawlspider)
  就是其中之一。代码中所定义的类变量（Class variable）都是再 scrapy 中有各自作
  用的。
  - `name` 是该 spider 的名字，scrapy 命令行工具调用 spider 时就用这个名字去找
    到对应的 spider。
  - `start_urls` 是 spider 的入口，即是告诉它该从哪个网页开始抓取。
  - `allowed_domains` 限定 spider 的抓取活动只能在指定的 domain 中进行。
- `rules` 定义了一系列规则用来匹配网页中出现的内容，并根据规则分发至不同的处理
  方法中。这里定义了一个规则是向网页中所有匹配正则表达式 `r'list\?area_id=\d+'`
  的链接（如果你在浏览器打开初始页面的话会发现这些就是页面下方以上海各个区命名
  的那几个链接）发出请求并将其结果交给 `parse_store_list` 方法（Method）来处理。
- [`SgmlLinkExtractor`](http://doc.scrapy.org/en/0.14/topics/link-extractors.html#sgmllinkextractor)
  是 scrapy 提供的连接提取器，它的用途就是，呃，提取链接。
  - `allow` 参数是正则表达式，网页中匹配的链接会被抓取。
  - `tags` 指定从哪些标签抓取链接，默认 `['a', 'area']`（通过分析网页
    这里不能包含 `area`，故手动指定。
- `parse_store_list` 方法定义了如何抓取特定网页中的数据
  - [`HtmlXPathSelector`](http://doc.scrapy.org/en/0.14/topics/selectors.html#scrapy.selector.HtmlXPathSelector)
    是一个选择器，使用它能方便地定位到网页中的某个位置并抓取其中内容。

### `CrawlSpider`

这个类是整个抓取逻辑的基础，他的工作流程如下：

1. 若有 `start_urls`，则从这些 URL 开始抓取，若没有，则执行 `start_requests` 方
   法（用户须定义），并请求该方法返回的 `Request` 对象，并从这些请求结果中开始
   抓取。
2. 所有网页请求返回的 `Response` 默认交给 `parse` 方法处理。
   - `parse` 方法在 `CrawlSpider` 的默认实现是用已定义的 `rules` 对获得的网页内
     容进行匹配并进行由 `Rule` 所指定的进一步处理（即交给 `callback` 参数所指定
     的 `callable` 去处理）。
   - 若不指定 `callback`, `Rule` 的默认处理是对匹配的网址发起请求，并再次交给
     `parse`。
3. 任何方法中返回的 Item 实例（如示例中的 `ConvStore`）都会被作为有效数据保存
   （输出文件等），再处理（
   [Pipeline](http://doc.scrapy.org/en/0.14/topics/item-pipeline.html)）。

### `HtmlXPathSelector`

这是一个通过 [XPath](http://www.w3schools.com/xpath/default.asp) 对 HTML 页面进
行结构化定位和内容读取的工具。scrapy 使用它定位到网页中用户所需要的数据并进行抓
取。

{% highlight python %}
def parse_store_list(self, response):
    hxs = HtmlXPathSelector(response)
    store_selectors = hxs.select('//div[@class="ShopList"]/table/tr')[1:]

    for s in store_selectors:
        ...
        store.add_value('branch', s.select('th/p/text()').extract())
        store.add_value('address', s.select('td/span/text()').extract())
        ...
{% endhighlight %}

- `HtmlXPathSelector` 需要一个 Response 对象来实例化。
- `//div[@class="ShopList"]/table/tr` 选择了所有包含罗森门店信息的 `tr` 标签。
- `s.select('th/p/text()').extract()` 在之前的选择基础上继续对其子标签做选择，
  这里就确实得选择到了分店名。`extract()` 则将该标签的文本数据读取出来。
- `HtmlXPathSelector` 还有正则表达式接口，后文会提到。

### Field, Item 及 Item Loader

Field 仅仅是一个 `dict` 的 wrapper 类，因此使用方法与 `dict` 完全一样，在
scrapy 中它负责声明单个 Item 的字段及该字段的各种行为（如序列化方法
`serializer`）。

Item 用 Field 定义了单个有效数据的具体字段，而实际中则是主要有两种方法写入
数据：

1. 使用其类似 `dict` 的接口进行数据的写入和读取，`key` 为字段名。
2. 使用 [Item Loader](http://doc.scrapy.org/en/0.14/topics/loaders.html)。

`dict` 接口的用法如上所示很简单，这里说一下 Item Loader。

{% highlight python %}
from scrapy.contrib.loader import ItemLoader
from scrapy.contrib.loader.processor import Compose

from lawson.items import ConvStore


class StoreLoader(ItemLoader):
    default_output_processor = Compose(lambda v: v[0], unicode.strip)

    def branch_in(self, values):
        for v in values:
            v = v.strip()
            yield v + u'店' if not v.endswith(u'店') else v


class LawsonSpider(CrawlSpider):
    ...

    def parse_store_list(self, response):
        hxs = HtmlXPathSelector(response)
        store_selectors = hxs.select('//div[@class="ShopList"]/table/tr')[1:]

        for s in store_selectors:
            store = StoreLoader(item=ConvStore(), response=response)
            store.add_value('name', u'罗森')
            store.add_value('alias', u'Lawson')
            store.add_value('branch', s.select('th/p/text()').extract())
            store.add_value('address', s.select('td/span/text()').extract())
            store.add_value('district', response.meta['link_text'])
            store.add_value('city', u'上海')

            yield store.load_item()
{% endhighlight %}

Item Loader 的主要作用是对抓取数据的各个字段进行特殊处理，在这里我们定义了一个
`StoreLoader` 类继承（Inherit）自 `ItemLoader`：

- `default_output_processor` 定义默认的输出处理器，这里我们对抓取的数据值进行
  strip 操作。
- `branch_in` 方法是对 `branch` 字段的特殊处理，他发生在输入的时候，也就是刚抓
  取到数据之后。这里的处理是为没有`店`这个字的分店名补上这个字。
- `<field>_in` 和 `<field>_out` 会各对指定字段做一次处理，前者是在刚抓取到数据
  时，后者是在最终输出之前，用户根据需要定义相应方法。
  - scrapy 有一些 [built-in processor](http://doc.scrapy.org/en/0.14/topics/loaders.html#module-scrapy.contrib.loader.processor)
    可以直接使用，进行一些通用处理。
- `add_value` 将值赋予相应字段，很好理解。
- `load_item` 返回该条填充过数据的 Item。

使用 Item Loader 的好处显而易见，我们有一个统一的地方对所有数据字段进行处理，不
用将其混入抓取逻辑，使整个流程分工明确。

另一个常用的 Item Loader 是 `XPathItemLoader`，显然这个版本利用了 XPath：

{% highlight python %}
store = XPathItemLoader(item=ConvStore(), response=response)
store.add_xpath('branch', '//div[@class="ShopList"]/table/tr[2]/th/p/text()')
{% endhighlight %}

它将字段与 XPath 表达式关联起来，直接完成定位、读取和写入数据的操作，很方便。

### 加上经纬度

经纬度对于定位一个地点是很有用的，通过电子地图能够精确地定位至相关地点。我发现
罗森网站提供了这个信息，但它并未明文显示，而是需要通过其所链接到的百度地图的页
面中去抓取下来，听起来很麻烦，但实际却很简单。

{% highlight python %}
from urlparse import urljoin

from scrapy.contrib.loader import XPathItemLoader
from scrapy.http import Request
from scrapy.selector import HtmlXPathSelector
from scrapy.utils.response import get_base_url

from poi_scrape.items import ConvStore


class StoreLoader(XPathItemLoader):
    ...


class LawsonSpider(BasePoiSpider):
    ...

    def parse_geo(self, response):
        hxs = HtmlXPathSelector(response)
        store = response.meta['store']

        lng, lat = hxs.re(r'(\d+\.\d+),(\d+\.\d+)')
        store.add_value('latitude', lat)
        store.add_value('longitude', lng)
        return store.load_item()

    def parse_store_list(self, response):
        ...

        for s in store_selectors:
            store = StoreLoader(item=ConvStore(), response=response)
            ...

            map_rel_url = s.select('td/a/@rel').extract()
            if map_rel_url:
                map_url = urljoin(get_base_url(response), map_rel_url[0])
                req = Request(map_url, callback=self.parse_geo)
                req.meta['store'] = store
                yield req
            else:
                yield store.load_item()
{% endhighlight %}

这里为 `LawsonSpider` 新增了一个方法 `parse_geo`，同时改写了
`parse_store_list`。

- 在 `parse_store_list` 的循环中我抓取每个店的 `tr` 标签中的 `td/a/@rel` 属性
  （Attribute）（这里 `@rel` 表示 `a` 标签的 `rel` 属性），若有这一属性则对这个
  地图的链接发起请求，即 `yield req`。
  - 在 scrapy 中，spider 类中的方法若返回 Request 实例则 scrapy 会自动对该
    Request 包含的 URL 发出请求，并将其返回的结果封装为 Response 后交给
    `callback` 参数中指定的方法处理，若未指定 `callback`，则交给 `parse` 方法处
    理。
- `req.meta['store'] = store`，每个 Request 有一个预定义的 `meta` 属性（`dict`
  ），保存在其中的值在其对应的 Response 中可以再次取出：
  `store = response.meta['store']`。
- `hxs.re(r'(\d+\.\d+),(\d+\.\d+)')` 使用了 `HtmlXPathSelector` 的正则表达式接
  口直接从网页中通过正则表达式匹配抓取数据。

### 完整 spider 代码

`items.py` 没有改动，与上文中的一致。

{% highlight python %}
# vim: fileencoding=utf-8
from urlparse import urljoin

from scrapy.contrib.linkextractors.sgml import SgmlLinkExtractor
from scrapy.contrib.loader import XPathItemLoader
from scrapy.contrib.loader.processor import Compose
from scrapy.contrib.spiders import CrawlSpider, Rule
from scrapy.http import Request
from scrapy.selector import HtmlXPathSelector
from scrapy.utils.response import get_base_url

from lawson.items import ConvStore


class StoreLoader(XPathItemLoader):
    default_output_processor = Compose(lambda v: v[0], unicode.strip)

    def branch_in(self, values):
        for v in values:
            v = v.strip()
            yield v + u'店' if not v.endswith(u'店') else v


class LawsonSpider(CrawlSpider):
    name = 'lawson'
    start_urls = ['http://www.lawson.com.cn/shops']
    allowed_domains = ['lawson.com.cn']
    rules = (
            Rule(SgmlLinkExtractor(allow=r'list\?area_id=\d+', tags='a'),
                callback='parse_store_list'),
            )

    def parse_geo(self, response):
        hxs = HtmlXPathSelector(response)
        store = response.meta['store']

        lng, lat = hxs.re(r'(\d+\.\d+),(\d+\.\d+)')
        store.add_value('latitude', lat)
        store.add_value('longitude', lng)
        return store.load_item()

    def parse_store_list(self, response):
        hxs = HtmlXPathSelector(response)
        store_selectors = hxs.select('//div[@class="ShopList"]/table/tr')[1:]

        for s in store_selectors:
            store = StoreLoader(item=ConvStore(), response=response)
            store.add_value('name', u'罗森')
            store.add_value('alias', u'Lawson')
            store.add_value('branch', s.select('th/p/text()').extract())
            store.add_value('address', s.select('td/span/text()').extract())
            store.add_value('district', response.meta['link_text'])
            store.add_value('city', u'上海')

            map_rel_url = s.select('td/a/@rel').extract()
            if map_rel_url:
                map_url = urljoin(get_base_url(response), map_rel_url[0])
                req = Request(map_url, callback=self.parse_geo)
                req.meta['store'] = store
                yield req
            else:
                yield store.load_item()
{% endhighlight %}

### scrapy 命令行工具

scrapy 提供了一些命令行工具
（[Command line tool](http://doc.scrapy.org/en/0.14/topics/commands.html)），之
前创建 Project 的时候用到的 `startproject` 就是其中之一。而除了这个之外，其他工
具也各自提供了相当有用的功能。

{% highlight text %}
$ scrapy
Scrapy 0.14.4 - project: lawson

Usage:
  scrapy <command> [options] [args]

Available commands:
  crawl         Start crawling from a spider or URL
  deploy        Deploy project in Scrapyd target
  edit          Edit spider
  fetch         Fetch a URL using the Scrapy downloader
  genspider     Generate new spider using pre-defined templates
  list          List available spiders
  parse         Parse URL (using its spider) and print the results
  runspider     Run a self-contained spider (without creating a project)
  server        Start Scrapyd server for this project
  settings      Get settings values
  shell         Interactive scraping console
  startproject  Create new project
  version       Print Scrapy version
  view          Open URL in browser, as seen by Scrapy

Use "scrapy <command> -h" to see more info about a command
{% endhighlight %}

这里仅挑出部分来讲。

#### `shell`

{% highlight sh %}
$ scrapy shell 'http://www.lawson.com.cn/shops'
{% endhighlight %}

运行后会进入 Python Interpreter，在这里我们能进行各种试验，配合
[Firebug](http://doc.scrapy.org/en/0.14/topics/firebug.html) 之类的工具，为程序
构建一个原型：

- 抓取各区分店列表链接，同时演示 `SgmlLInkExtractor` 用法：

{% highlight python %}
In [1]: from scrapy.contrib.linkextractors.sgml import SgmlLinkExtractor

In [2]: SgmlLinkExtractor(allow=r'list\?area_id=\d+', tags='a').extract_links(response)
Out[2]:
[Link(url='http://www.lawson.com.cn/shops/list?area_id=1', text=u'\u957f\u5b81\u533a', fragment='', nofollow=False),
 Link(url='http://www.lawson.com.cn/shops/list?area_id=2', text=u'\u5f90\u6c47\u533a', fragment='', nofollow=False),
 Link(url='http://www.lawson.com.cn/shops/list?area_id=3', text=u'\u9759\u5b89\u533a', fragment='', nofollow=False),
 ...
{% endhighlight %}

- 抓取分店列表，`fetch` 用来载入新的 URL：

{% highlight python %}
In [6]: fetch('http://www.lawson.com.cn/shops/list?area_id=1')

In [7]: hxs.select('//div[@class="ShopList"]/table/tr')[1:]
Out[7]:
[<HtmlXPathSelector xpath='//div[@class="ShopList"]/table/tr' data=u'<tr><th scope="row" class="linetop">\n\t\t\t'>,
 <HtmlXPathSelector xpath='//div[@class="ShopList"]/table/tr' data=u'<tr><th scope="row" class="linetop">\n\t\t\t'>,
 <HtmlXPathSelector xpath='//div[@class="ShopList"]/table/tr' data=u'<tr><th scope="row" class="linetop">\n\t\t\t'>,
 ...]
{% endhighlight %}

- 抓取分店名称，演示 `HtmlXPathSelector` 用法：

{% highlight python %}
In [8]: s = hxs.select('//div[@class="ShopList"]/table/tr')[1:][0]

In [9]: s.select('th/p/text()').extract()
Out[9]: [u'\n\t\t\t\t\u53e4\u5317\u65b0\u533a\n\t\t\t\t']

In [11]: print s.select('th/p/text()').extract()[0].strip() + u'店'
古北新区店
{% endhighlight %}

这是一个相当完善的命令行界面，提供了所有必需的网页分析及抓取工具，十分适合在实
际写抓取程序前做实验。

而 `shell` 不仅能从命令行直接调用，还能从程序中调用直接进入以便分析程序做调试：

{% highlight python %}
from scrapy.shell import inspect_response


class LawsonSpider(BasePoiSpider):
    ...

    def parse_geo(self, response):
        inspect_response(response)

    def parse_store_list(self, response):
        ...
{% endhighlight %}

这样在执行到 `parse_geo` 时就会掉入 `shell` 界面，可以做进一步调试。

#### `crawl`

真正的抓取就是通过这个命令执行的：

{% highlight sh %}
$ scrapy crawl store
{% endhighlight %}

{% highlight text %}
2012-07-18 15:14:58+0800 [scrapy] INFO: Scrapy 0.14.4 started (bot: lawson)
2012-07-18 15:14:58+0800 [scrapy] DEBUG: Enabled extensions: FeedExporter, LogStats, TelnetConsole, CloseSpider, WebService, CoreStats, SpiderState
2012-07-18 15:14:58+0800 [scrapy] DEBUG: Enabled downloader middlewares: HttpAuthMiddleware, DownloadTimeoutMiddleware, UserAgentMiddleware, RetryMiddleware, DefaultHeadersMiddleware, RedirectMiddleware, CookiesMiddleware, HttpCompressionMiddleware, ChunkedTransferMiddleware, DownloaderStats
2012-07-18 15:14:58+0800 [scrapy] DEBUG: Enabled spider middlewares: HttpErrorMiddleware, OffsiteMiddleware, RefererMiddleware, UrlLengthMiddleware, DepthMiddleware
2012-07-18 15:14:58+0800 [scrapy] DEBUG: Enabled item pipelines:
2012-07-18 15:14:58+0800 [lawson] INFO: Spider opened
2012-07-18 15:14:58+0800 [lawson] INFO: Crawled 0 pages (at 0 pages/min), scraped 0 items (at 0 items/min)
2012-07-18 15:14:58+0800 [scrapy] DEBUG: Telnet console listening on 0.0.0.0:6023
2012-07-18 15:14:58+0800 [scrapy] DEBUG: Web service listening on 0.0.0.0:6080
2012-07-18 15:14:59+0800 [lawson] DEBUG: Crawled (200) <GET http://www.lawson.com.cn/shops> (referer: None)
2012-07-18 15:14:59+0800 [lawson] DEBUG: Crawled (200) <GET http://www.lawson.com.cn/shops/list?area_id=16> (referer: http://www.lawson.com.cn/shops)
2012-07-18 15:14:59+0800 [lawson] DEBUG: Scraped from <200 http://www.lawson.com.cn/shops/list?area_id=16>
	{'address': u'\u5609\u5b9a\u533a\u5609\u677e\u516c\u8def6128\u53f7',
	 'alias': u'Lawson',
	 'branch': u'\u540c\u6d4e\u5927\u5b66\u5e97',
	 'city': u'\u4e0a\u6d77',
	 'district': u'\u5609\u5b9a\u533a',
	 'name': u'\u7f57\u68ee'}
...
2012-07-18 15:15:01+0800 [lawson] DEBUG: Crawled (200) <GET http://www.lawson.com.cn/shops/199/map> (referer: http://www.lawson.com.cn/shops/list?area_id=12)
2012-07-18 15:15:01+0800 [lawson] DEBUG: Scraped from <200 http://www.lawson.com.cn/shops/199/map>
	{'address': u'\u677e\u6c5f\u533a\u897f\u6797\u5317\u8def1048\u53f7',
	 'alias': u'Lawson',
	 'branch': u'\u677e\u6c5f\u5987\u5e7c\u4fdd\u5065\u9662\u5e97',
	 'city': u'\u4e0a\u6d77',
	 'district': u'\u677e\u6c5f\u533a',
	 'latitude': u'31.030622',
	 'longitude': u'121.225586',
	 'name': u'\u7f57\u68ee'}
...
2012-07-18 15:15:21+0800 [lawson] INFO: Closing spider (finished)
2012-07-18 15:15:21+0800 [lawson] INFO: Stored csv feed (320 items) in: lawson_store.csv
2012-07-18 15:15:21+0800 [lawson] INFO: Dumping spider stats:
	{'downloader/request_bytes': 158946,
	 'downloader/request_count': 309,
	 'downloader/request_method_count/GET': 309,
	 'downloader/response_bytes': 1883104,
	 'downloader/response_count': 309,
	 'downloader/response_status_count/200': 309,
	 'finish_reason': 'finished',
	 'finish_time': datetime.datetime(2012, 7, 18, 7, 15, 21, 905140),
	 'item_scraped_count': 320,
	 'request_depth_max': 2,
	 'scheduler/memory_enqueued': 309,
	 'start_time': datetime.datetime(2012, 7, 18, 7, 14, 58, 538838)}
2012-07-18 15:15:21+0800 [lawson] INFO: Spider closed (finished)
2012-07-18 15:15:21+0800 [scrapy] INFO: Dumping global stats:
	{}
{% endhighlight %}

从最后的报告中可以看到这个 spider 在一分钟内抓取了该网站全部320条数据
（`item_scraped_count`）。

若要输出抓取结果到一个文件，则加上参数：

{% highlight sh %}
scrapy crawl store -o store.csv -t csv
{% endhighlight %}


这样，这篇 scrapy 使用教程的第一部分就结束了。
