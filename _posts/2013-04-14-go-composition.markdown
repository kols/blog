---
layout: post
title: go composition
date: 2013-04-14 16:47
comments: true
categories:
  - programming
  - go
---
go 没有 inheritance，只有基于 interface 的 composition，但它提供了类似继承的 embedding 来使这一过程尽可能简洁。这里就用具体示例来说一下如何做。

假设我需要两个图片 URL 生成器，它能根据 http 请求来源生成相应的图片 URL 集合，例如从 mobile 来的请求我为其生成 original, cover 两个 URL，而从 desktop 来的请求则生成 original, preview 和 thumbnail 三个 URL。

整理一下需求：首先是 original, cover, preview 及 thumbnail 这四个基础的实际生成 URL 的生成器，然后是 mobile 及 desktop 这两个构筑在前四者之上的抽象分类。

{% highlight go %}
type OriginalUrlBuilder interface {
    OriginalUrl() string
}

type CoverUrlBuilder interface {
    CoverUrl() string
}

type PreviewUrlBuilder interface {
    PreviewUrl() string
}

type ThumbnailUrlBuilder interface {
    ThumbnailUrl() string
}
{% endhighlight %}

这里我们先声明了四种不同 URL 的 interface，这是为了之后的 composition 更方便。

{% highlight go %}
type OriginalUrlBuilder interface {
    OriginalUrl() string
}

type Original struct {
    image *models.Image  // a model, the source we use to generate the URL, just a stab to complete the logic, pay no attention to it.
}

func (o Original) OriginalUrl() string {// generate original URL}

type CoverUrlBuilder interface {
    CoverUrl() string
}

type Cover struct {
    image *models.Image
}

func (c Cover) CoverUrl() string {// generate cover URL}

type PreviewUrlBuilder interface {
    PreviewUrl() string
}

type Preview struct {
    image *models.Image
}

func (p Preview) PreviewUrl() string {// generate preview URL}

type ThumbnailUrlBuilder interface {
    ThumbnailUrl() string
}

type Thumbnail struct {
    image *models.Image
}

func (t Thumbnail) ThumbnailUrl() string {// generate thumbnail URL}
{% endhighlight %}

声明各个具体的 builder 并实现 interface。接下来是两个分类。

{% highlight go %}
type Desktop struct {
    *Original
    *Preview
    *Thumbnail
}

type Mobile struct {
    *Original
    *Cover
}
{% endhighlight %}

这里的实现使用了 struct embedding，这里内嵌了基础 builder 的 pointer，效果是直接将内嵌 struct 的所有 method 带入新声明的 struct。这里有几点需要注意：

- 内嵌的 struct 需要 initialize
- 在所声明 struct 上调用内嵌 struct 的 method 时其 receiver 为内嵌的 struct 而非其自身：
{% highlight go %}
// when we call embedded method directly on the outer struct
d.CoverUrl()
// it's exactly like first defining this book-keeping method on the outer struct and then calling it
func (d Desktop) CoverUrl() string {
    d.Cover.CoverUrl()  // receiver is `Cover' not `Desktop'
}
d.CoverUrl()
{% endhighlight %}
- 内嵌 struct 的 field name 为其 unqualified name，即去除 package name 后的部分。
- <http://golang.org/doc/effective_go.html#embedding>

之后看一下如何实际使用这些 URL builder。

{% highlight go %}
func GetUrlBuilder(reqType string) (builder interface{}) {
    var image *models.Image
    switch reqType {
    case "desktop":
        o := &Original{image}
        p := &Preview{image}
        t := &Thumbnail{image}
        builder = Desktop{o, p, t}
    case "mobile":
        o := &Original{image}
        c := &Cover{image}
        builder = Mobile{o, c}
    default:
        panic("Oooops, don't know which type it is!")
    }
    return
}

func main() {
    reqType := GetRequestTypeFromNowhere()  // fake
    urlBuilder := GetUrlBuilder(reqType)
    switch reqType {
    case "desktop":
        urlBuilder.(OriginalUrlBuilder).OriginalUrl()  // original URL
        urlBuilder.(PreviewUrlBuilder).PreviewUrl()  // preview URL
        urlBuilder.(ThumbnailUrlBuilder).ThumbnailUrl()  // thumbnail URL
    case "mobile":
        urlBuilder.(OriginalUrlBuilder).OriginalUrl()  // original URL
        urlBuilder.(CoverUrlBuilder).CoverUrl()  // cover URL
    }
}
{% endhighlight %}

`GetUrlBuilder()` 返回 `interface{}`，即使用者不知道所返回的究竟是 `Desktop` 还是 `Mobile`。因为使用者只需负责使用就可以了，`desktop.(PreviewUrlBuilder).PreviewUrl()` 对所返回的 builder 先进行 type assertion 再调用相应 interface 中的方法，即我需要一个 preview URL 则我就调用 `PreviewUrlBuilder` 中的 `PreviewUrl()` 方法来获取这样一个 URL，除此以外我不需要知道其他任何信息，builder 的种类为何对使用者而言是透明的。而这也是最初声明四个不同基础 builder 的 interface 的好处之一。

最后总结一下这样的程序结构的优点：

-  方便新增抽象分类，例如 `PadImageUrlBuilder`，使用基础的 builder 组合一下即可。
-  可根据需要实现多个同种基础 builder，只需实现其 interface 即可，在多个 builder 之间动态替换也没问题。
-  新增基础 builder 也很容易，声明 interface 并实现，然后在抽象分类中将其 embed 进去即可。
-  抽象分类对 builder 使用者完全透明，其只需 `GetUrlBuilder()` 后根据实际需要 type assertion 至相应基础 builder 并调用其方法即可，不需知道这是 desktop 还是 mobile builder。

go 应用了这两条面向对象设计原则：

> - Favor composition over inheritance.
> - Program to an interface, not an implementation.

因此其虽非面向对象语言但是仍然有面向对象的痕迹，只是摒弃了设计者所不中意的部分（inheritance），并强调了他们喜欢的地方。在 go 中实现一个设计模式并非水到渠成的，但它所提供的概念及抽象总是在引导你试着去运用，明确地或是潜移默化地。

go 是给人一种相当朴素感觉的语言，当现代语言都在追求各种各样花哨形式（以给程序员提供乐趣，当然也确实很有乐趣）的时候，它仍以一种质朴平淡甚至近乎无聊的形式呈现自己，给你它所为你选择的它所认为重要的，显然漂亮的语法或 syntax sugar 并不在列，然而它居然也是有乐趣的，从少获得多，less is more，这也是另一种我所欣赏的审美态度。