# VaccinateCA site
**PSA: this will eventually be public so be careful not to put any secrets in any commits!**

Use Issues in this repository for task-tracking.

## Setup with Ruby 2.7
- `bundle install`
- Start server with `bundle exec jekyll serve --livereload`

## First time with Jekyll?

- [jekyll](https://jekyllrb.com/) is a Ruby-based static site generator. It is easy to pick up if you've worked in Ruby before.
  - You'll see [Liquid](https://shopify.github.io/liquid/) templating used a lot.
  - Jeykll starts on [localhost:4000](http://localhost:4000/) by default.
    - You will need to restart the Jekyll process when the config file changes; that is the only time you need to restart it _most_ of the time. (Other occasions include adding collections, etc, which you'll be doing extremely infrequently.)