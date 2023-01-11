import DoubleLinked from "../DoublyLinked/DoubleLinked";
import type { LinkStack as ILinkStack } from "./interface";
import type { LinkedListNode, ListNodeLink } from "../DoublyLinked/interface";

export default class LinkStack<T> implements ILinkStack<T> {
  list: DoubleLinked<T>;
  // isEmpty: boolean;
  current: ListNodeLink<T>;

  constructor() {
    this.list = new DoubleLinked();
    this.list.insertFirst(<T>{type: "empty"});
    this.current = this.list.first;
  }

  push(value: T): void {
    if (this.current == this.list.first || !this.list.first) {
      this.list.insertFirst(value);
      this.current = this.list.first;
    } else {
      let link: ListNodeLink<T> = null;

      do {
        link = this.list.deleteFirst();
      }
      while (link !== this.current);

      this.list.insertFirst(<T>link?.value);
      this.list.insertFirst(value);
      this.current = this.list.first;
    }
  }

  pop(): T {
    const link: T = <T>this.list.deleteFirst();

    this.current = this.list.first;

    return link;
  }

  readNext(): T {
    if (!this.current?.next) {
      return <T>{};
    }
    const value: T = <T>this.current?.value;

    this.current = this.current?.next;

    return <T>value;
  }

  readPrev(): T {
    if (!this.current?.prev) {
      return <T>{};
    }

    this.current = this.current?.prev;

    return <T>this.current?.value;
  }

  print(): T[] {
    const a = [];

    for(const item of this.list) {
      a.push(item);
    }

    return a;
  }

  get isEmpty(): boolean {
    return !this.list.first
  }

  *[Symbol.iterator](): Iterator<T> {
    yield <T>this.list.first?.value;

    let currentNode = this.list.first;

    while (currentNode) {
      currentNode = currentNode.next;
      this.current = currentNode;
      yield <T>currentNode?.value;
    }
  }

  *reverceIterate(): Iterator<T> {
    yield <T>this.current?.value;

    let currentNode = this.current;

    while (currentNode) {
      currentNode = currentNode.prev;
      this.current = currentNode;
      yield <T>currentNode?.value;
    }
  }

}