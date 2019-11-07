import { Expect, Test, TestFixture } from "../../../core/alsatian-core";
import { removeItemByIndex } from "../../../core/utils/remove-item-by-index";

@TestFixture("remove item by index tests")
export class RemoveItemByIndexTests {
    @Test("remove first item")
    public removeFirstItem() {
        Expect(removeItemByIndex([1, 2, 3], 0)).toEqual([2, 3]);
    }

    @Test("remove second item")
    public removeSecondItem() {
        Expect(removeItemByIndex([1, 2, 3], 1)).toEqual([1, 3]);
    }

    @Test("remove third item")
    public removeLastItem() {
        Expect(removeItemByIndex([1, 2, 3], 2)).toEqual([1, 2]);
    }
}
