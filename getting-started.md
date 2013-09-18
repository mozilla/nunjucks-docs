---
layout: subpage
pageid: getting-started
---

# Getting Started

## Node

```
$ npm install nunjucks
```

Once installed, simply use `require('nunjucks')` to load it.

## Browser

Grab <a href="#">nunjucks-dev.js</a> for the full library, and <a
href="#">nunjucks.js</a> (<a href="#">minified</a>) for the slim
version. The slim version is only 8K minified and gzipped and only
works with precompiled templates.

Simply include nunjucks with a `script` tag on the page:

```html
<script src="nunjucks.js"></script>
```

or load it as an AMD module:

```js
define(['nunjucks'], function(nunjucks) {
});
```

## Using

This is the simplest way to use nunjucks. First, set any configuration
flags like autoescaping and then render a string:

```js
nunjucks.configure({ autoescape: true });
nunjucks.renderString('Hello {% raw %}{{ username }}{% endraw %}', { username: 'James' });
```

You usually won't use `renderString`, instead you should write
templates in individual files and use `render`. In this case, you
need to tell nunjucks where these files live with the first argument of `configure`:

```js
nunjucks.configure('views', { autoescape: true });
nunjucks.render('index.html', { foo: 'bar' });
```

That way you can inherit and include templates.

The above API works in node and in the browser. In node, nunjucks
loads templates from the filesystem by default, and in the browser
loads them over HTTP. If you are using the slim version of nunjucks
and precompiled your templates, they will automatically be picked up
by the system and you don't have to do anything different. This makes
it easy to use the same code in development and production, while only
using precompiled templates in production.


## All of the below should go into the real docs


### Async

Nunjucks supports an async API, which is only necessary if you are using any asynchronous filters or extensions:

```js
nunjucks.render('index.html', { foo: 'bar' }, function(err, res) {
    // handle err or use the result
});
```

Otherwise, all render calls can be used synchronously just as well.
There is no advantage to the async API by default since template
loading is either cached or precompiled. It's only necessary if your
filters or extensions do anything async.

### More APIs

That's only the tip of the iceberg. The above higher-level API uses this more powerful API.