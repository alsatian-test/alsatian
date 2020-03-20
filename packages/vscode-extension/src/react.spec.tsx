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
		const element = shallow(<ExampleComponent />);
		ExpectElement(element).toMatchElement(<div>Example</div>);
	}

	@Test("failing example")
	failing() {
		const element = shallow(<ExampleComponent />);

		Expect(element.hasClass("fancy")).toBe(true);
	}
}

/*

abstract class Command {
	get name(): string {
		throw new Error("not implemented");
	}

	public async run(): Promise<void> {
		throw new Error("not implemented");
	};
}

abstract class ToggleableCommand extends Command {
	public async isOn(): Promise<boolean> {
		// get from cache
		if (cache[this.name]) {
			return cache[this.name].isOn;
		}

		// get from remote

		return true;
	}
}

class C implements Command {
	run() {

	}
}

async function runFeat(feature: ToggleableCommand, fallback?: Command) {
	feature.isOn() ? feature.run() : fallback?.run();
}

*/
