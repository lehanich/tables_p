import MatrixEngine from "./MatrixEngine";

type T = "" | object | App.MetaData;

export default class Matrix<T> implements App.Matrix<T> {
  engine: App.MatrixEngine<T>;

  constructor(x: number, y: number, initValue: "" | object = '') {
    this.engine = new MatrixEngine(x, y, initValue);
  }

  update(x: number, y: number): App.MatrixEngine<T> {
    return this.engine.update(x, y);
  }

  updateById(id: number, value: T): void {
    this.engine.updateById(id, value);
  }

  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  get element(): T {
    return this.engine.element;
  }

  set element(value: T) {
    this.engine.element = value;
  }

  setElement(x: number, y: number, value: T): void {
    this.engine.setElement(x, y, value);
  }

  getElement(x: number, y: number): T | undefined {
    return this.engine.getElement(x, y);
  }

  areaCoordinates(area: App.CoordinatesArea<App.Coordinate>): App.CoordinatesArray<App.Coordinate> | [] {
    return this.engine.areaCoordinates(area);
  }

  areaModify(area: App.CoordinatesArea<App.Coordinate>, delta: App.Coordinate) {
    return this.engine.areaModify(area, delta);
  }

  readMatrix(area: App.CoordinatesArea<App.Coordinate>): App.MatrixEngine<any> {
    return this.engine.readMatrix(area);
  }

  getMatrix(area: App.CoordinatesArea<App.Coordinate>): App.MatrixEngine<T> {
    return this.engine.getMatrix(area);
  }

  updateMatrix(area: App.CoordinatesArea<App.Coordinate>, buffer: App.MatrixEngine<T>): void {
    this.engine.updateMatrix(area, buffer);
  }

  set offset(value: App.Coordinate) {
    this.engine.offset = value;
  }

  get offset(): App.Coordinate {
    return this.engine.offset;
  }

  print(): T[] {
    if (!this.engine.print()) {
      return [];
    }

    return this.engine.print();
  }

  get length(): number {
    return this.engine.length;
  }

  get width(): number {
    return this.engine.width;
  }

  get height(): number {
    return this.engine.height;
  }

  get array(): T[][] {
    const a: never[][] | T[][] = [];

    for (let i=0; i < this.engine.height; i++) {
      a[i] = [];
      for (let j=0; j < this.engine.width; j++) {
        a[i][j] = <T>this.engine.setElement(i, j, <T>this.engine.getElement(i, j));
      }
    }

    return a;
  }
}