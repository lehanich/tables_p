import {describe, expect, test, it} from '@jest/globals';
import DoubleLinked from "./DoubleLinked";

describe("DoubleLinked create", function () {

  it("should create empty linked list", () => {
    const doubleLinked = new DoubleLinked();
    expect(doubleLinked.first === null);
  });
});

describe("DoubleLinked functions", function () {
  const list = new DoubleLinked();

  list.add(1);
  list.add(2);
  list.add(3);

  it("DoubleLinked is iterable", () => {
    expect(typeof list[Symbol.iterator] === "function");
  });

  it("DoubleLinked first element has value", () => {
    expect(list.first?.value === 1);
  });

  it("DoubleLinked last not empty", () => {
    expect(list.last?.value === 3);
  });

  it("DoubleLinked first element has next link", () => {
    expect(list.first?.next?.value === 2);
  });

  it("DoubleLinked elements has prev link", () => {
    expect(list.first?.next?.prev !== null && list.first?.next?.prev !== undefined);
  });

  it("DoubleLinked delete() first", () => {
    const list = new DoubleLinked();

    list.add(1);
    list.add(2);
    list.add(3);
    list.delete(list.first);

    expect(list.first?.value === 2);
  })

  it("DoubleLinked delete() last", () => {
    const list = new DoubleLinked();

    list.add(1);
    list.add(2);
    list.add(3);
    list.delete(list.last);

    expect(list.last?.value === 2);
  })

  it("DoubleLinked delete() middle", () => {
    const list = new DoubleLinked();

    list.add(1);
    list.add(2);
    list.add(3);
    list.delete(list.first?.next);

    expect(list.first?.next?.value === 3 && list.last?.prev?.value === 1);
  })
});
