import { SpyCall } from "./spy-call";

export class PropertySpy<PropertyType> {

	public readonly setCalls: Array<SpyCall> = [];
	private originialGetter: () => PropertyType | undefined;
	private originialSetter: (value: PropertyType) => void | undefined;
	private value: PropertyType | undefined;
	private descriptorTarget: any;
	private getter: () => PropertyType | undefined;
	private setter: (value: PropertyType) => void | undefined;
	private returnValue: boolean | undefined;
	private propertyName: string;
	private getCalls: Array<SpyCall> = [];

	public constructor(target: any, propertyName: string) {
		// store references to property we are spying on so we can restore it
		this.descriptorTarget = target;
		this.propertyName = propertyName;

		// for TypeScript may need to search target.constructor.prototype for propertyDescriptor
		if (!Object.getOwnPropertyDescriptor(target, this.propertyName)) {
			this.descriptorTarget = target.constructor.prototype;
		}

		// get the current property descriptor
		const propertyDescriptor = Object.getOwnPropertyDescriptor(
			this.descriptorTarget,
			this.propertyName
		);

		// throw an error if we are trying to spy on a non property
		if (propertyDescriptor === undefined) {
			throw new TypeError(`${propertyName} is not a property.`);
		}

		// store the original setters and getters, which maybe undefined
		this.originialGetter = propertyDescriptor.get as () =>
			| PropertyType
			| undefined;
		this.originialSetter = propertyDescriptor.set as (
			v: PropertyType
		) => void | undefined;

		this.getter = this.originialGetter;
		this.setter = this.originialSetter;

		// set descriptor target back to original object so the prototype doesn't get modified
		this.descriptorTarget = target;

		// reset the property definition
		Object.defineProperty(this.descriptorTarget, this.propertyName, {
			get: this.get.bind(this),
			set: this.set.bind(this)
		});
	}

	public andReturnValue(value: PropertyType): PropertySpy<PropertyType> {
		this.value = value;
		this.returnValue = true;
		return this;
	}

	public andCallGetter(
		getter: () => PropertyType
	): PropertySpy<PropertyType> {
		this.getter = getter;
		this.returnValue = false;
		return this;
	}

	public andCallSetter(
		setter: (value: PropertyType) => void
	): PropertySpy<PropertyType> {
		this.setter = setter;
		this.returnValue = false;
		return this;
	}

	public restore() {
		Object.defineProperty(this.descriptorTarget, this.propertyName, {
			get: this.originialGetter,
			set: this.originialSetter
		});
	}

	private get() {
		// log that the property was requested
		this.getCalls.push(new SpyCall([]));

		// return a given value if this is the spy's behaviour
		if (this.returnValue) {
			return this.value;
		}

		// otherwise call the getter function and return it's return value
		return this.getter ? this.getter.call(this.descriptorTarget) : undefined;
	}

	private set(value: PropertyType) {
		// log that the proeprty was set and with which value
		this.setCalls.push(new SpyCall([value]));

		// call the setter function
		this.setter.call(this.descriptorTarget, value);

		// if there is not already a value to return then log this as the current value
		if (!this.returnValue) {
			this.value = value;
		}
	}
}
