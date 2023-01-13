
export class Math {

  // constructor() {

  // }
  SUM(a: number[]): number {
    let result = 0;

    for (const element of a) {
      result += element;
    }

    return result;
  }

  MAX(a: number, b: number): number {
    if (a > b) {
      return a;
    } else {
      return b;
    }
  }

  MIN(a: number, b: number): number {
    if (a > b) {
      return b;
    } else {
      return a;
    }
  }
}
