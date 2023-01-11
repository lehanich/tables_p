import type {LinkedList} from "../DoublyLinked/interface";

export interface LinkStack<T> {
  list: LinkedList<T>;
  get isEmpty(): boolean;
  push(value: T): void;
  pop(): T;
  print(): T[];

  [Symbol.iterator](): Iterator<T>;
  // deleteElement():;
}
