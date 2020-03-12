import * as React from "react";
import { Test, TestFixture, Expect } from "alsatian";
import { ExpectElement } from "alsatian-enzyme";
import { shallow } from "enzyme";

function ExampleComponent() {
    return <div>Example</div>;
};

@TestFixture("sample react tests")
export class SampleReactTests {

	@Test("passing example")
	passing() {
		const element  = shallow(<ExampleComponent />);
		ExpectElement(element).toMatchElement(<div>Example</div>);
	}

	@Test("failing example")
	failing() {
		const element  = shallow(<ExampleComponent />);

		Expect(element.hasClass("fancy")).toBe(true);
	}
}
