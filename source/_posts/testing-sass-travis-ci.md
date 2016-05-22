---
title: Automate Sass Testing (with Travis CI)
tags:
- CI
- CSS
- CSS3
- object orientated design
- Sass
categories:
- Technologies
date: 2014-01-19
---
**[View my demo project on GitHub](https://github.com/matthew-andrews/sass-example)**

Having a large amount of CSS is unavoidable in a modern web application. Using preprocessors such as Sass help us manage that CSS but as we write more `@mixin`'s, `@function`'s and adopt techniques such as *[object orientated css](http://coding.smashingmagazine.com/2011/12/12/an-introduction-to-object-oriented-css-oocss/)* the complexity grows. At FT Labs we even use (or perhaps abuse) npm as a package manager for **Sass only repositories** for various projects, including the [FT Web app](http://labs.ft.com/articles/the-ft-web-app/), so that those styles can be shared across projects.

With this ever increasing complexity, the differences between writing CSS and any other programming language are eroding.

### All this complexity adds risk

In other programming languages we mitigate this kind of risk with automated testing. It's time to start testing our Sass.

### Testing Sass with Travis CI

Sass isn't a language that Travis CI currently has first class support for but we can get it working with just a small number of hacks to the .travis.yml file.

Apart from some Sass (which I'm assuming you have already) you will need a .travis.yml file that looks something like this:

```yml
script:
- "test/travis.rb"

language: sass
before_install:
- gem install sass
```

[View source file](https://github.com/matthew-andrews/sass-example/blob/master/.travis.yml)

Here I'm telling Travis to **first install Sass** then **execute the file located at** `test/travis.rb`.

<small>If you use a task runner such as make, Rake, Grunt or another you'll probably want to use it rather than a script like this but I wanted to keep things as simple and technology agnostic as possible.</small>

Interestingly the `language:` option is *actually optional* and it even allows for invalid values – helpfully it will default to Ruby (the language Sass is written in). Optimistically I've set it to sass but it may be more robust to set this to ruby.

### The test

The next step will be to tell Travis exactly what to build.

Here are the contents of my `test/travis.rb` script:

```ruby
#!/usr/bin/env ruby
result = `sass main.scss built.css`
raise result unless $?.to_i == 0
raise "When compiled the module should output some CSS" unless File.exists?('built.css')
puts "Regular compile worked successfully"
```

[View source file](https://github.com/matthew-andrews/sass-example/blob/master/test/travis.rb)

I'm using back ticks rather than [any of the other other ways to run shell commands in ruby](http://tech.natemurray.com/2007/03/ruby-shell-commands.html) so I can easily check the status code and output any errors thrown by Sass (which come through via stdout). I then check to see if the built files exists – and `raise` an error if it does not.

An error thrown at either step will stop the script executing and cause the build to fail.

### Protection against bad PR

From now on [any Pull Request that causes our Sass not to compile will come with a bright ~~yellow~~ red ‘The Travis CI build failed’ warning](https://github.com/matthew-andrews/sass-example/pull/1).

### What can we actually *test*?

Compiling is a good first step but that offers little more than a [linter](https://en.wikipedia.org/wiki/Lint_(software)) and will only catch the most basic of regressions. Here are some other ideas and examples of what could be tested:

- `@mixin`'s and `@function`'s are relatively easy – test known outputs against known inputs.
- Many CSS libraries, such as [@csswizardry](https://twitter.com/csswizardry)'s [grid module](http://csswizardry.com/csswizardry-grids/) offer the option of [‘silent output’](https://github.com/csswizardry/csswizardry-grids). Your test could build the CSS library with the silent flag switched on and assert that the [resulting built css file is empty](https://github.com/matthew-andrews/csswizardry-grids/blob/travis/test/travis.rb#L9).
