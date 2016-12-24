<p id="banner" align="center">
    <img src="/documentation/images/alsatian-mascot-logo.png?raw=true" alt="Alsatian Mascot Logo" />
    <p id="tag-line" align="center">Awesomely easy and useful TypeScript and JavaScript testing framework with test cases, compatible with istanbul and tap reporters.</p>
</p>
<p id="badges" align="center">
    <a href="https://www.npmjs.com/package/alsatian">
        <img src="https://img.shields.io/npm/v/alsatian.svg" alt="NPM Version" />
    </a>
    <a href="https://www.github.com/alsatian-test/alsatian/blob/master/LICENSE">
        <img src="https://img.shields.io/github/license/alsatian-test/alsatian.svg" alt="License" />
    </a>
    <a href="https://travis-ci.org/alsatian-test/alsatian">
        <img src="https://travis-ci.org/alsatian-test/alsatian.svg?branch=master" alt="Build Status" />
    </a>
    <a href="https://codeclimate.com/github/alsatian-test/alsatian">
        <img src="https://codeclimate.com/github/alsatian-test/alsatian/badges/gpa.svg" alt="Code Climate" />
    </a>
    <a href="https://coveralls.io/github/alsatian-test/alsatian?branch=master">
        <img src="https://coveralls.io/repos/github/alsatian-test/alsatian/badge.svg?branch=master" alt="Coverage Status" />
    </a>
    <a href="https://codeclimate.com/github/alsatian-test/alsatian">
        <img src="https://codeclimate.com/github/alsatian-test/alsatian/badges/issue_count.svg" alt="Code Climate Issue Count" />
    </a>
    <a href="https://www.bithound.io/github/alsatian-test/alsatian">
        <img src="https://www.bithound.io/github/alsatian-test/alsatian/badges/code.svg" alt="bitHound Code Rating" />
    </a>
    <a href="https://www.bithound.io/github/alsatian-test/alsatian/master/dependencies/npm">
        <img src="https://www.bithound.io/github/alsatian-test/alsatian/badges/dependencies.svg" alt="bitHound Dependencies Rating" />
    </a>
    <a href="https://snyk.io/test/github/alsatian-test/alsatian">
        <img src="https://snyk.io/test/github/alsatian-test/alsatian/badge.svg" alt="Known Vulnerabilities" />
    </a>
</p>

## Why would I use Alsatian?
The key question! Well Alsatian has a lot going for it here are just a few great things to note:

* All the awesome features you love from existing frameworks
* TestCase decorator allows you to write smaller, DRY and more readable tests
* No globals!
* TAP support so you can use your favourite TAP reporter
* Great CI process, every pull request and push on every branch is scrutinised to ensure high quality
* 100% coverage all statements, lines, branches are covered in Alsatian tests
* Various services rate us very highly on lots of different factors, check out our badges
* Everything is documented in a friendly and simple way to help you get to the unit test setup of your dreams
* Being written in TypeScript it fits perfectly into your TypeScript but still compatible with JavaScript too!
* Active support if you've got a question, a suggestion or found an issue let us know and we'll get back to you quickly

Also it's lightning fast, watch it run all of it's unit tests in super quick time!
![Alsatian Test Run Video](/documentation/images/alsatian-test-run.gif?raw=true)

## Installing

Good news everybody, we're on NPM.
```
npm install alsatian
```

## Use with JavaScript

If you're using JavaScript, no worries you can still use Alsatian with Babel. Currently there is no official support for decorators (see [babel issue](https://github.com/babel/babel#2645)) but you can use a plugin!

Add `transform-decorators-legacy` plugin

```
npm install babel-plugin-transform-decorators-legacy --save-dev
```

Then update your `.babelrc`

```
{
  ...
  "plugins": ["transform-decorators-legacy"]
  ...
}
```

You should now be able to use Alsatian decorators as in all the examples below, Hooray!

## Running alsatian

### CLI

Alsatian has a CLI for easy use with your package.json or your favourite cli tool

```
alsatian [list of globs]

alsatian "./test/**/*.spec.js" "./special-test.js"
```

#### CLI Options

You can change how Alsatian runs your tests using the available options

| Option                    | Alias  | Description                                                                  |
| ------------------------- | ------ | ---------------------------------------------------------------------------- |
| --help                    | -h     | Outputs info about how to use the CLI                                        |            
| --version                 | -v     | Outputs the version of the CLI                                               |            
| --tap                     | -T     | Will make Alsatian output in TAP format (to be consumed by a TAP reporter)   |             
| --timeout [number in ms]  | -t     | Sets the maximum time that a test can run for before failing (default 500ms) |

### Node.js

If you're more of a nodey person then you can use that too

```typescript
import { TestSet, TestRunner } from "alsatian";
import { TapBark } from "tap-bark";

// create test set
const testSet = TestSet.create();

// add your tests
testSet.addTestsFromFiles("./tests/you-want/to-add/**/*.spec.js");

// create a test runner
const testRunner = new TestRunner();

// setup the output
testRunner.outputStream
          // this will use alsatian's default output if you remove this
          // you'll get TAP or you can add your favourite TAP reporter in it's place
          .pipe(TapBark.create().getPipeable()) 
          // pipe to the console
          .pipe(process.stdout);

// run the test set
testRunner.run(testSet)
          // this will be called after all tests have been run
          .then((results) => done())
          // this will be called if there was a problem
          .catch((error) => doSomethingWith(error));
```

### Gulp

If instead you prefer to gulp it up you can write a task similar to how you'd work with Node.js

```typescript
import * as Gulp from "gulp";
import { TestSet, TestRunner } from "alsatian";
import { TapBark } from "tap-bark";

Gulp.task("test", (done: () => any) => {

    // create test set
    const testSet = TestSet.create();

    // add your tests
    testSet.addTestsFromFiles("./tests/you-want/to-add/**/*.spec.js");

    // create a test runner
    const testRunner = new TestRunner();

    // setup the output
    testRunner.outputStream
              // this will use alsatian's default output if you remove this
              // you'll get TAP or you can add your favourite TAP reporter in it's place
              .pipe(TapBark.create().getPipeable()) 
              // pipe to the console
              .pipe(process.stdout);

    // run the test set
    testRunner.run(testSet)
              // and tell gulp when we're done
              .then(() => done());
});
```

## Using alsatian

Create your first spec file

```typescript
import { Expect, Test } from "alsatian";

export class ExampleTestFixture {

  @Test()
  public exampleTest() {
    Expect(1 + 1).toBe(2);
  }
}
```

Then check all is well

```
> alsatian "./path/to/example.spec.js"
TAP version 13
1..1
ok 1 - exampleTest
```

### Naming Tests

By default, tests will be named the same as their functions and fixtures will be named the same as their class. This will be what is output by alsatian. However, you can give the test or fixture more meaningful name simply by supplying the ```Test``` and ```TestFixture``` annotations with whatever you desire.

```typescript
import { Expect, Test, TestFixture } from "alsatian";

@TestFixture("Awesome Test Fixture")
export class ExampleTestFixture {

  @Test("Confirm 1 + 1 is 2")
  public test1() {
    Expect(1 + 1).toBe(2);
  }
}
```

Then check all is well

```
> alsatian ./path/to/example.spec
Awesome Test Fixture
Confirm 1 + 1 is 2
|====================|

Pass: 1/1
Fail: 0/1
Ignore: 0/1
```

### Test Cases

You can pass arguments to your tests simply by using the ```TestCase``` annotation

```typescript
import { Expect, TestCase, TestFixture } from "alsatian";

@TestFixture("Example Test Fixture")
export class ExampleTestFixture {

  @TestCase(1, 2)
  @TestCase(4, 5)
  public exampleTest(preIteratedValue: number, expected: number) {
    Expect(preIteratedValue++).toBe(expected);
  }
}
```

### Matchers

Now you've set up some tests, it's time to check your code is working. Let's start easy.

#### toBe

To be or not to be, that is the question! Simply put this checks whether actual === expected

```typescript
Expect(1 + 1).toBe(2);
Expect(1 + 1).not.toBe(3);
```

#### toEqual

Next we can check if it's pretty much the same actual == expected

```typescript
Expect("1").toEqual(1);
Expect(1 + 1).not.toEqual("3");
```

#### toMatch

Now a cheeky little regular expression if you don't mind

```typescript
Expect("something").toMatch(/some/);
Expect("another thing").not.toMatch(/something/);
```

#### toBeDefined

Is it there or not? actual !== undefined

```typescript
Expect("something").toBeDefined();
Expect(undefined).not.toBeDefined();
```

#### toBeNull

Is it something or not? actual === null

```typescript
Expect(null).toBeNull();
Expect("something").not.toBeNull();
```

#### toBeTruthy

Is it trueish? actual == trueish

```typescript
Expect(1).toBeTruthy();
Expect(0).not.toBeTruthy();
```

#### toContain

Does the string contain another string or an array contain an item?

```typescript
Expect("something").toContain("thing");
Expect([1, 2, 3]).toContain(2);
Expect("another thing").not.toContain("something");
Expect([1, 2, 3]).not.toContain(4);
```

#### toBeGreaterThan

Which one's larger (hopefully the actual)

```typescript
Expect(2).toBeGreaterThan(1);
Expect(1).not.toBeGreaterThan(2);
```

#### toBeLessThan

For when you don't want things to get out of control, check it's not too big

```typescript
Expect(1).toBeLessThan(2);
Expect(2).not.toBeLessThan(1);
```

#### toThrow

Check whether a function throws an error

```typescript
Expect(() => throw new Error()).toThrow();
Expect(() => {}).not.toThrow();
```

#### toThrowError

Check whether a function throws a specific error with a given message

```typescript
Expect(() => throw new TypeError("things went wrong")).toThrowError(TypeError, "things went wrong");
Expect(() => throw new Error("some error we don't care about")).not.toThrow(TypeError, "super nasty error");
```

### Spying

When we want to check functions are called, this is simple first we need to turn it into a spy...

```typescript
import { SpyOn } from "alsatian";

let some = {
  function: () => {}
};

SpyOn(some, "function");

```

... then check it's been called ...

```typescript
Expect(some.function).toHaveBeenCalled();
```

... or check it's been called with certain arguments ...

```typescript
Expect(some.function).toHaveBeenCalledWith(this, "and that");
```

... or any arguments ...

```typescript
// you can use the Any function to signify an argument can be anything or any specific type
Expect(some.function).toHaveBeenCalledWith(Any, Any(Number), Any(String));
```

... or a specific number of times ...

```typescript
Expect(some.function).toHaveBeenCalled().exactly(42).times;
Expect(some.function).toHaveBeenCalledWith("something").anythingBut(10).times;
Expect(some.function).toHaveBeenCalledWith(Any).lessThan(5).times;
Expect(some.function).toHaveBeenCalledWith(Any(Number), Any(Array)).greaterThan(2).times;

// Note that this functionality must not be used with the not operator
// e.g. the following throws an error
Expect(some.function).not.toHaveBeenCalled().lessThan(42).times;

// this should be written
Expect(some.function).toHaveBeenCalled().greaterThan(41).times;
```

... you can stub it out ...

```typescript
SpyOn(some, "function").andStub();
```

... you can make it call something else ...

```typescript
SpyOn(some, "function").andCall(() => {
  console.log("I are called");  // make it do whatever you like
  return "whatever you like";   // and also return stuff too!
});
```

... or make it return whatever you desire ...

```typescript
SpyOn(some, "function").andReturn(42);
```

... and even return it to how it started

```typescript
SpyOn(some, "function");

some.function.restore();

// OR

const spy = SpyOn(some, "function");

spy.restore();
```

#### Creating a spy from thin air

You may want to just create a fake spy property this is easy to do and has all the same functionality as a Spy created through ```SpyOn```

```typescript
import { FunctionSpy } from "alsatian";

const spy = new FunctionSpy();
```

#### Spying on a property

Similarly to spying on functions you can also spy on properties as below ...

```typescript
import { SpyOnProperty } from "alsatian";

class Test {

   private _property: number = 42;

   get property() {
      return this._property;
   }

   set property(value: number) {
      this._property = value;
   }
}

const test = new Test();

SpyOnProperty(test, "property");

```

... then check it's been set ...

```typescript
const propertySpy = SpyOnProperty(test, "property");

// unlike function spies expect calls on property spies
// only works using the returned spy from SpyOnProperty
// and not the property itself
Expect(propertySpy).toHaveBeenSet();
```

... or check it's been set to a specific value ...

```typescript
Expect(propertySpy).toHaveBeenSetTo(42);
```

... add a fake getter ...

```typescript
SpyOnProperty(test, "property").andCallGetter(() => { return "something"; });
```

... or setter ...

```typescript
SpyOnProperty(test, "property").andCallSetter((value: any) => { doSomethingWith(value); });
```

... return a set value ...

```typescript
SpyOnProperty(test, "property").andReturnValue(42);
```

... and restore it to how it was before

```typescript
const properySpy = SpyOnProperty(test, "property");

properySpy.restore();
```

### Async Tests

You can also have asynchronous tests using the ```AsyncTest``` annotation,

```typescript
import { Expect, AsyncTest, TestFixture } from "alsatian";

@TestFixture("Example Test Fixture")
export class ExampleTestFixture {

  @AsyncTest()
  public asyncTest() {

    return new Promise((resolve, reject) => {
      waitForSomethingToHappen((result: number) => {
         Expect(result).toBe(1);
         resolve();
      });
    });
  }
}
```

Alsatian will fail an ```AsyncTest``` if it takes longer than 500 ms to execute. You can change this if you need to though using the ```Timeout``` decorators


```typescript
import { Expect, AsyncTest, Timeout, TestFixture } from "alsatian";

@TestFixture("Example Test Fixture")
export class ExampleTestFixture {

  @AsyncTest()
  @Timeout(5000) // Alsatian will now wait 5 seconds before failing
  public asyncTest() {

    return new Promise((resolve, reject) => {
      somethingThatTakesAlmostFiveSeconds((result: number) => {
         Expect(result).toBe(1);
         resolve();
      });
    });
  }
}
``` 

### Ignoring Tests

You can stop tests from being run by using the ```IgnoreTest``` annotation

```typescript
import { Expect, Test, IgnoreTest, TestFixture } from "alsatian";

@TestFixture("Example Test Fixture")
export class ExampleTestFixture {

  @Test()
  @IgnoreTest()
  public ignoredTest() {
    Expect(1).toBe(1);
  }
}
```

or you can stop all tests in a given fixture from running using the ```IgnoreTests``` annotation

```typescript
import { Expect, Test, IgnoreTests, TestFixture } from "alsatian";

@IgnoreTests()
@TestFixture("Example Test Fixture")
export class ExampleTestFixture {

  @Test()
  public thisTestWillNotBeRun() {
    Expect(1).toBe(1);
  }

  @Test()
  public neitherWillThisOne() {
   Expect(1).toBe(1);
  }
}
```

You can provide a reason to both of these, which will put it into the TAP output.

```typescript
import { Expect, Test, IgnoreTest, TestFixture } from "alsatian";

@TestFixture("Example Test Fixture")
export class ExampleTestFixture {

  @Test()
  @IgnoreTest("This test is useless, ignore for now.")
  public ignoredTest() {
    Expect(1).toBe(1);
  }
}
```

### Focusing Tests

You can run a single test or select tests using the ```FocusTest``` annotation

```typescript
import { Expect, Test, FocusTest, TestFixture } from "alsatian";

@TestFixture("Example Test Fixture")
export class ExampleTestFixture {

  @Test()
  @FocusTest
  public thisTestWillBeRun() {
    Expect(1).toBe(1);
  }

  @Test()
  public thisTestWillNotBeRun() {
    Expect(1).toBe(1);
  }
}
```

or you can run only tests in this fixture using the ```FocusTests``` annotation

```typescript
import { Expect, Test, FocusTests, TestFixture } from "alsatian";

@FocusTests
@TestFixture("Example Test Fixture")
export class ExampleTestFixture {

  @Test()
  public thisTestWillBeRun() {
    Expect(1).toBe(1);
  }

  @Test()
  public soWillThisTest() {
    Expect(1).toBe(1);
  }
}
```

### Setup

You can get a function to be run before every function in the fixture using the ```Setup``` decorators

```typescript
import { Expect, Test, Setup, TestFixture } from "alsatian";

@TestFixture("Example Test Fixture")
export class ExampleTestFixture {

  @Setup
  public thisFunctionWillBeRunBeforeAllTests() {
    // do some setup work
  }

  @Test()
  public exampleTest() {
   Expect(1).toBe(1);
  }
}
```

### Teardown

You can also run functions after every test has completed using the ```Teardown``` decorators

```typescript
import { Expect, Test, Teardown, TestFixture } from "alsatian";

@TestFixture("Example Test Fixture")
export class ExampleTestFixture {

  @Teardown
  public thisFunctionWillBeRunAfterAllTests() {
    // do some teardown work
  }

  @Test()
  public exampleTest() {
   Expect(1).toBe(1);
  }
}
```

### Extending Expect

Extending the Expect call in Alsatian is super simple as it's OO and extensible by default! All you need to do is extend...

```typescript
class MatcherExtension extends Matcher {
    isSomething() {
        if (this.actualValue !== "something") {
          throw new MatchError("should have been something", "something", "not something");
        }
    }
}
```

Then if you want to you can wrap it in a function to add some neat fluent syntax

```typescript
// name it whatever your heart desires
export ExtendedExpect = (value: any) => new MatcherExtension(value);
```

Here's an explanation of some of the concepts that are useful here

#### this.actualValue

This is the value that is added into the Matcher constructor / Expect function i.e. the value under test

#### this.shouldMatch

This indicates whether the not opperator has been used

```typescript
Expect(something).toBe(nothing);     // this.shouldMatch === true
Expect(something).not.toBe(nothing); // this.shouldMatch === false
```

#### MatchError

Throwing this error will tell Alsatian that the test found something wrong (you can extend this too). It has three arguments, the actual value, the expected value and a message. A usage example can be found below.

```typescript
throw new MatchError(
  "expected nothing to be something, but it wasn't.",            // an explanation of the issue
  "something",                                                   // what the value was expected to be
  "nothing"                                                      // what the value actually was
);
```

You may also set each value independently if you extend them (as the setters are protected)

```typescript
export class ExtendedMatchError {
  public constructor() {
    super();
    this.message = "expected nothing to be something, but it wasn't.";
    this._expected = "something";
    this._actual = "nothing";
  }
}
```

#### Example assertion function

```typescript
public toBeHexCode() {
    // check whether the value provided in Expect() is a hex code or not
    const isHexCode = /^#[A-F|0-9]{6}$/i.test(this.actualValue);
    
    // if the value should have been a hex code and wasn't
    // or should not have been and was
    if (isHexCode !== this.shouldMatch) {

      // output for Alsatian that it should have been a hex code
      if (this.shouldMatch) {
        throw new MatchError(                                             
          `expected {this.actualValue} to be a hex code but it wasn't.`,                                                    
          "a hex code",     
          "not a hex code"
        );
      }
      // output for Alsatian that it should not have been a hex code
      else {
        throw new MatchError(                                            
          `expected {this.actualValue} to not be a hex code but it wasn't.`,                                           
          "not a hex code", 
          "a hex code"        
        );
      }
    }
}
```

#### usage

Now you're ready to use your extended ```Expect```. This is super easy...

```typescript
import { ExtendedExpect as Expect } from "./your/extended-expect/location";
import { TestFixture, Test } from "alsatian";

@TestFixture("color tests")
export default class ColorTestFixture {

  @Test("check hexcodes")
  public checkHexcodes {
    Expect("#00000").toBeHexCode();
  }
}

```