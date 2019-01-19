[![Build
Status](https://semaphoreci.com/api/v1/thrillberg/goal-setter/branches/production/badge.svg)](https://semaphoreci.com/thrillberg/goal-setter)

# Goal Setter

This project centralizes the creation of GitHub issues that correspond with
larger-scale goals for a GitHub repository. It should be an aide to goal-setting
meetings and to retrospective meetings.

This project adheres to the Contributor Covenant
[code of
conduct](https://github.com/TEECOM/goal-setter/blob/production/CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code. Please report
unacceptable behavior to
[eric.tillberg@teecom.com](mailto:eric.tillberg@teecom.com).

## Getting Started

These instructions will get you a copy of the project up and running on your
local machine for development and testing purposes. See deployment for notes on
how to deploy the project on a live system.

### Prerequisites

#### Homebrew

Homebrew will be used to install later dependencies.

If you do not already have homebrew installed, run:

```
/usr/bin/ruby -e "$(curl -fsSL
https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

in a terminal session.

#### Node.js

Node.js is a JavaScript runtime. If you do not already have Node.js installed,
you can download it [here](https://nodejs.org/en/).

#### npm

npm is a package manager for JavaScript. If you've installed Node.js, npm came
along with it.

#### Yarn

To install JavaScript dependencies, you will need to have
[Yarn](https://yarnpkg.com) installed.

To install [Yarn](https://yarnpkg.com/en/docs/install), run:

```
brew install yarn
```

### Installing

To install the remaining dependencies, we will use yarn.

From the project directory, run:

```
yarn
```

This should install all of the remaining dependencies. If something goes wrong,
please [open an issue](https://github.com/TEECOM/goal-setter/issues/new).

## Running the tests

Goal Setter strives to be 100% tested to protect against regressions and to
guide development.

To run the full suite of tests, run:

```
npm test
```

To ensure 100% test coverage, you can also run:

```
npm test -- --coverage
```

## Running the style checker

Goal Setter uses [ESLint](https://eslint.org/).

To run the code checker, run:

```
npm run lint
```

## Deployment

Deployment of Goal Setter is handled automatically by CI and Heroku. Merging
into the production branch with passing CI results in an automatic deploy.

## Questions?

If any of the above documentation is unclear, please
[create an
issue](https://github.com/TEECOM/goal-setter/issues/new).
