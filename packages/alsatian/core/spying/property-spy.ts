import { SpyCall } from "./spy-call";

export class PropertySpy<PropertyType> {
	private _originialGetter: () => PropertyType | undefined;
	private _originialSetter: (value: PropertyType) => void | undefined;
	private _value: PropertyType | undefined;
	private _descriptorTarget: any;
	private _getter: () => PropertyType | undefined;
	private _setter: (value: PropertyType) => void | undefined;
	private _returnValue: boolean | undefined;
	private _propertyName: string;
	private _getCalls: Array<SpyCall> = [];

	private _setCalls: Array<SpyCall> = [];
	public get setCalls() {
		return this._setCalls;
	}

	public constructor(target: any, propertyName: string) {
		// store references to property we are spying on so we can restore it
		this._descriptorTarget = target;
		this._propertyName = propertyName;

		// for TypeScript may need to search target.constructor.prototype for propertyDescriptor
		if (!Object.getOwnPropertyDescriptor(target, this._propertyName)) {
			this._descriptorTarget = target.constructor.prototype;
		}

		// get the current property descriptor
		const propertyDescriptor = Object.getOwnPropertyDescriptor(
			this._descriptorTarget,
			this._propertyName
		);

		// throw an error if we are trying to spy on a non property
		if (propertyDescriptor === undefined) {
			throw new TypeError(`${propertyName} is not a property.`);
		}

		// store the original setters and getters, which maybe undefined
		this._originialGetter = propertyDescriptor.get as () =>
			| PropertyType
			| undefined;
		this._originialSetter = propertyDescriptor.set as (
			v: PropertyType
		) => void | undefined;

		this._getter = this._originialGetter;
		this._setter = this._originialSetter;

		// set descriptor target back to original object so the prototype doesn't get modified
		this._descriptorTarget = target;

		// reset the property definition
		Object.defineProperty(this._descriptorTarget, this._propertyName, {
			get: this._get.bind(this),
			set: this._set.bind(this)
		});
	}

	public andReturnValue(value: PropertyType): PropertySpy<PropertyType> {
		this._value = value;
		this._returnValue = true;
		return this;
	}

	public andCallGetter(
		getter: () => PropertyType
	): PropertySpy<PropertyType> {
		this._getter = getter;
		this._returnValue = false;
		return this;
	}

	public andCallSetter(
		setter: (value: PropertyType) => void
	): PropertySpy<PropertyType> {
		this._setter = setter;
		this._returnValue = false;
		return this;
	}

	public restore() {
		Object.defineProperty(this._descriptorTarget, this._propertyName, {
			get: this._originialGetter,
			set: this._originialSetter
		});
	}

	private _get() {
		// log that the property was requested
		this._getCalls.push(new SpyCall([]));

		// return a given value if this is the spy's behaviour
		if (this._returnValue) {
			return this._value;
		}

		// otherwise call the getter function and return it's return value
		return this._getter ? this._getter.call(this._descriptorTarget) : undefined;
	}

	private _set(value: PropertyType) {
		// log that the proeprty was set and with which value
		this._setCalls.push(new SpyCall([value]));

		// call the setter function
		this._setter.call(this._descriptorTarget, value);

		// if there is not already a value to return then log this as the current value
		if (!this._returnValue) {
			this._value = value;
		}
	}
}
