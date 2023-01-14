
export class Math {

  // constructor() {

  // }
  SUM(a: Iterable<number>): number {
    let result = 0;

    for (const element of a) {
      result += element;
    }

    return result;
  }

  MAX(a: Iterable<number>): number {
    let result = 0;
    let index = 0;

    for (const element of a) {
      if (element > result || index === 0) {
        result = element;
      }
      index++;
    }

    return result;
  }

  MIN(a: Iterable<number>): number {
    let result = 0;
    let index = 0;

    for (const element of a) {
      if (element < result || index === 0) {
        result = element;
      }
      index++;
    }

    return result;
  }
}
