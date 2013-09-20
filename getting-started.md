---
layout: subpage
pageid: getting-started
---

# Getting Started

## When Using Node...

```
$ npm install nunjucks
```

Once installed, simply use `require('nunjucks')` to load it.

## When in the Browser...

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
templates in individual files and use `render`. That way you can
inherit and include templates. In this case, you need to tell nunjucks
where these files live with the first argument of `configure`:

```js
nunjucks.configure('views', { autoescape: true });
nunjucks.render('index.html', { foo: 'bar' });
```

Using express? Simply pass your express app into `configure`:

```js
var app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.get('/', function(req, res) {
    res.render('index.html');
});
```

The above API works in node and in the browser (express is only in
node, obviously). In node, nunjucks loads templates from the
filesystem by default, and in the browser loads them over HTTP.

If you are using the slim version of nunjucks and precompiled your
templates in the browser, they will automatically be picked up by the
system and you don't have to do anything different. This makes it easy
to use the same code in development and production, while only using
precompiled templates in production.

## More Information

That's only the tip of the iceberg. See [API](/api.html) for API docs
and [Templating](/templating.html) about the templating language.