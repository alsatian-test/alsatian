

interface Thing {
    prop: string;
    func(a: number): number;
    something: Thing;
}

class Stub<T> {
}

class Stubbed<T> {
    public is(value: T) {
        return;
    }
}

type AnyFunction = (...args: Array<any>) => any;
/*
type ReturnType<T extends AnyFunction>
    = T extends (...args: Array<any>) => infer R ? R : any;*/

class StubbedFunc<T extends AnyFunction> {
    public returns(value: ReturnType<T>) {
        return;
    }

    public throws(error: Error) {

    }

    public throttle(milliseconds: number) {

    }
}

type StubbedValue<T> = (T extends AnyFunction ? StubbedFunc<T> : Stubbed<T> & StubbedObject<T>) & T;
type StubbedObject<T> = { [K in keyof T]: StubbedValue<T[K]> };

function createStub<T>(): StubbedObject<T> {
    return new Stub<T>() as StubbedObject<T>;
}

const t = createStub<Thing>();
t.something.prop.is("")
t.something.is({ prop: "", something: createStub<Thing>(), func: () => 2 })
t.prop.is("2")

t.func.returns(2);

test(t);

function test(t: Thing) {
}
