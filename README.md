# VaccinateCA site
**PSA: this will eventually be public so be careful not to put any secrets in any commits!**

Thank you for being here! We love your participation and want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features

The code for this website is hosted on Github. We use a variety of Github tools to project manage the website, including tracking issues and feature requests as well as reviewing and merging changes to the code.

## All changes happen through Pull Requests

Pull requests are the best way to propose changes to the codebase (we use [Github Flow](https://guides.github.com/introduction/flow/index.html)). To get started:

1. Clone the repo, if you haven't already, and create your branch from `main`.
2. Begin working on the new branch to make your change(s).
3. Push your branch to Github and create a Pull Request for it. Doing even while it's still a work-in-progress is useful, as it makes it easy for you to ask others for ongoing feedback or help.
4. When you have completed your changes, ask for reviews of your Pull Request. At least 1 approval is required before the Pull Request can be merged.

## Report bugs and feature requests using Github [Issues](https://github.com/CAVaccineInventory/site/issues)
We use GitHub Issues to track potential work. Please add to this list, whether you are proposing a new feature, reporting a bug, or even raising a subject requiring discussion by [opening a new issue](https://github.com/CAVaccineInventory/site/issues/new).

## How to begin local development

### Setup with Ruby 2.7
- Start local development server with `script/server`

### First time with Jekyll?

- [jekyll](https://jekyllrb.com/) is a Ruby-based static site generator. It is easy to pick up if you've worked in Ruby before.
  - You'll see [Liquid](https://shopify.github.io/liquid/) templating used a lot.
  - Jeykll starts on [localhost:4000](http://localhost:4000/) by default.
    - You will need to restart the Jekyll process when the config file changes; that is the only time you need to restart it _most_ of the time. (Other occasions include adding collections, etc, which you'll be doing extremely infrequently.)

### Running the linter
The linter - [Prettier](https://prettier.io/) - runs on every PR automatically. If you'd like to run it locally, run `npm install` once to set up npm and then `npm run lint:fix` to run the linter. 
