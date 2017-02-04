<p id="banner" align="center">
    <img src="https://github.com/alsatian-test/alsatian/raw/master/documentation/images/alsatian-mascot-logo.png" alt="Alsatian Mascot Logo" />
    <p id="tag-line" align="center">Awesomely easy and useful TypeScript and JavaScript testing framework with test cases, compatible with <a href="https://github.com/alsatian-test/alsatian/wiki/using-alsatian-with-selenium">selenium</a>, <a href="https://github.com/alsatian-test/alsatian/wiki/check-test-coverage-with-nyc">coverage checkers</a> and <a href="https://github.com/alsatian-test/alsatian/wiki/using-alsatian-with-tap-reporters">TAP reporters</a>.</p>
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

## Quick Start

If you're loving TypeScript then pop on down to our [TypeScript Quick Start](https://github.com/alsatian-test/alsatian/wiki/typescript-setup).

Otherwise if you're more of a JavaScript kinda person, have a gander at our [JavaScript Quick Start](https://github.com/alsatian-test/alsatian/wiki/javascript-setup)

Full documentation can be found on our [wiki](https://github.com/alsatian-test/alsatian/wiki/) the examples are usually in TypeScript but should be pretty much the same code for JavaScript (just lose the access modifiers and types).

## Alsatian is different

Using a different approach than other JavaScript test frameworks allows us to use more powerful patterns.

```typescript
// no globals and typing support out of the box with intellisense
import { AsyncTest, Expect, Test, TestCase, TestFixture } from "alsatian";

@TestFixture("whatever you'd like to call the fixture")
export class SetOfTests {
    
    // use the async/await pattern in your tests as you would in your code
    @AsyncTest("asychronous test")
    public async asyncTest() {
        const response = await somethingToHappen();

        Expect(response).toBeDefined();
    }

    // pass arguments into your test functions to keep your test code from being repetative
    @TestCase(2, 2, 4)
    @TestCase(2, 3, 5)
    @TestCase(3, 3, 6)
    @Test("addition tests")
    public addTest(firstNumber: number, secondNumber: number, expectedSum: number) {
        Expect(firstNumber + secondNumber).toBe(expectedSum);
    }
}

```

## Why would I use Alsatian?

The key question! Well Alsatian has a lot going for it here are just a few great things to note:

* All the awesome features you love from existing frameworks
* The [TestCase](https://github.com/alsatian-test/alsatian/wiki/test-structure#test-cases) decorator allows you to write smaller, DRY and more readable tests
* No globals!
* TAP support so you can use your favourite TAP reporter
* Great CI process, every pull request and push on every branch is scrutinised to ensure high quality
* 100% coverage all statements, lines, branches are covered in Alsatian tests
* Various services rate us very highly on lots of different factors, check out our badges
* Everything is documented in a friendly and simple way to help you get to the unit test setup of your dreams
* Being written in TypeScript it fits perfectly into your TypeScript but still compatible with JavaScript too!
* Active support - if you've got a question, a suggestion or found an issue let us know and we'll get back to you quickly

Also it's lightning fast, watch it run all of it's unit tests in super quick time!
![Alsatian Test Run Video](https://github.com/alsatian-test/alsatian/raw/master/documentation/images/alsatian-test-run.gif)

## Besides unit tests, what can I do with Alsatian

So many awesome things!
* write end to end tests with [Selenium](https://github.com/alsatian-test/alsatian/wiki/using-alsatian-with-selenium)
* check your code coverage with [NYC](https://github.com/alsatian-test/alsatian/wiki/check-test-coverage-with-nyc)
* set up a wonderful CI process and give confidence in the quality of your product
* have the output look however you desire using  [TAP reporters](https://github.com/alsatian-test/alsatian/wiki/using-alsatian-with-tap-reporters)

## Support

If at any time things are unclear or you think there may be something going wrong feel free to [raise an issue](https://github.com/alsatian-test/alsatian/issues/new) and we'll be glad to get back to you with a solution quickly.

## Contributing

We're always glad to have help out with Alsatian, check out the [guidelines](https://github.com/alsatian-test/alsatian/blob/master/CONTRIBUTING.md)

## License

Alsatian has been released under the [MIT license](https://github.com/alsatian-test/alsatian/blob/master/LICENSE)
