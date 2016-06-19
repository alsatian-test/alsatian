# alsatian
TypeScript testing framework with test cases, compatible with istanbul and tap reporters.

## Installing

Good news everybody, we're on NPM.
```
npm install alsatian
```

## Running alsatian

Alsatian has a CLI for easy use with your package.json or your favourite cli tool

```
alsatian [list of globs]

alsatian ./test/**/*.spec.js ./special-test.js
```

## Using alsatian

Create your first spec file

```

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
> alsatian ./path/to/example.spec
TAP version 13
1..1
ok 1 - exampleTest
```

### Naming Tests

By default, tests will be named the same as their functions and this will be what is output by alsatian. However, you can give the test a more meaningful name simply by supplying the ```Test``` annotation with whatever you desire.

```

import { Expect, Test } from "alsatian";

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
TAP version 13
1..1
ok 1 - Confirm 1 + 1 is 2
```

### Test Cases

You can pass arguments to your tests simply by using the ```TestCase``` annotation

```

import { Expect, TestCase } from "alsatian";

export class ExampleTestFixture {

  @TestCase(1, 2)
  @TestCase(4, 5)
  public exampleTest(preIteratedValue: number, expected: number) {
    Expect(preIteratedValue++).toBe(expected);
  }
}

```

### Matchers

### Spying
