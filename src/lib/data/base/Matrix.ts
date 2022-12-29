
export default class Matrix {
  private data: undefined | any[];

  constructor(x: number, y: number) {
    this.data = new Array(x*y);
  }

  set(x: number, y: number, value: any): void {
    this.update(x,y,value)
  }

  update(x: number, y: number, value: any): void {
    if (!this.data) {
      return undefined;
    }

    return this.data[x*y] = value;
  }

  get(x: number, y: number): any | undefined {
    if (!this.data) {
      return undefined;
    }

    return this.data[x*y];
  }

  print(): any[] | undefined {
    return this.data;
  }

  get length(): number {
    if (!this.data) {
      return 0;
    }

    return this.data.length;
  }
}