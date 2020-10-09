

import * as React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

import { Test, TestFixture, Expect, TestCase } from "alsatian";
import { FailureDetail } from "./failure-detail";

@TestFixture("<FailureDetails /> Tests")
export class FailureDetailTests {
    @TestCase(null)
    @TestCase(undefined)
    @TestCase({})
    @TestCase({ phil: "rob", dawid: "binks" })
    @Test("weird inputs")
    public weirdThingsDoesntBreak(value: any) {
        const result = shallow(<FailureDetail name="something" value={value} />);

        Expect(() => result.html()).not.toThrow();
    }
}
