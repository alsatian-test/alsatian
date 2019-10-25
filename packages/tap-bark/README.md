# tap-bark

TAP parser for Alsatian.

[![npm](https://img.shields.io/npm/v/tap-bark.svg)](https://www.npmjs.com/package/tap-bark)
[![license](https://img.shields.io/github/license/alsatian-test/tap-bark.svg)](https://www.github.com/alsatian-test/alsatian/blob/master/packages/tap-bark/LICENSE)
[![build status](https://travis-ci.com/alsatian-test/alsatian.svg?branch=master)](https://travis-ci.com/alsatian-test/alsatian)
[![code quality](https://codeclimate.com/github/alsatian-test/alsatian/badges/gpa.svg)](https://codeclimate.com/github/alsatian-test/alsatian)
[![code coverage](https://api.codeclimate.com/v1/badges/ba8c9cedceb03ab59dc8/test_coverage)](https://codeclimate.com/github/alsatian-test/alsatian/test_coverage)

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
