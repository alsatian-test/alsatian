# tap-bark

TAP parser for Alsatian.

[![npm](https://img.shields.io/npm/v/tap-bark.svg)](https://www.npmjs.com/package/tap-bark)
[![license](https://img.shields.io/github/license/alsatian-test/tap-bark.svg)](https://github.com/alsatian-test/tap-bark/blob/master/LICENSE)
[![Linux and OSX Build Status](https://travis-ci.org/alsatian-test/tap-bark.svg?branch=master)](https://travis-ci.org/alsatian-test/tap-bark)
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/alsatian-test/alsatian?branch=master&svg=true)](https://ci.appveyor.com/project/jamesrichford/tap-bark)
[![Coverage Status](https://coveralls.io/repos/github/alsatian-test/tap-bark/badge.svg?branch=master)](https://coveralls.io/github/alsatian-test/tap-bark?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/alsatian-test/tap-bark/badge.svg)](https://snyk.io/test/github/alsatian-test/tap-bark)
[![Code Climate](https://codeclimate.com/github/alsatian-test/tap-bark/badges/gpa.svg)](https://codeclimate.com/github/alsatian-test/tap-bark)
[![Issue Count](https://codeclimate.com/github/alsatian-test/tap-bark/badges/issue_count.svg)](https://codeclimate.com/github/alsatian-test/tap-bark)
[![bitHound Code](https://www.bithound.io/github/alsatian-test/tap-bark/badges/code.svg)](https://www.bithound.io/github/alsatian-test/tap-bark)
[![bitHound Dependencies](https://www.bithound.io/github/alsatian-test/tap-bark/badges/dependencies.svg)](https://www.bithound.io/github/alsatian-test/tap-bark/master/dependencies/npm)

## Usage

You can use TAP Bark via the CLI or Node, Huzzah!!!

### CLI

```
// an example using alsatian
alsatian "**/*.spec.js" --tap | tap-bark

// or another test framework
another-test-framework --your-flags | tap-bark
```

### Node

```typescript
import { TapBark } from "tap-bark";

...
    // create tap bark instance
    const bark = TapBark.create();

    // setup the streams
    resultsStream.pipe(bark.getPipeable()) // pipe the TAP stream to TAP Bark
                 .pipe(process.stdout);    // then TAP Bark's output to the console (or a file if you so wish)
...
```