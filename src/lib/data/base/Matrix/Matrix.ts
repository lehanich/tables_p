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

  updateMatrixFromCursor(coordinate: App.Coordinate, buffer: App.MatrixEngine<T>): void {
    this.updateMatrix([
      [coordinate[0],coordinate[1]],
      [coordinate[0] + buffer.width - 1, coordinate[1] + buffer.height - 1]
    ], buffer);
  }

  getMatrixString(area: App.CoordinatesArea<App.Coordinate>, separator = "\t"): string {
    let out = "";
    const buffer = this.readMatrix(area);

    for(let j=0; j < buffer.height; j++) {
      for(let i=0; i < buffer.width; i++) {
        out += buffer.getElement(i,j);
        if (i < buffer.width-1) {
          out += separator;
        }
      }
      if (j < buffer.height-1) {
        out += "\n";
      }
    }
    return out;
  }

  unionElements(area: App.CoordinatesArea<App.Coordinate>): void {
    const coordinates = this.areaCoordinates(area);
    let main = true;
    let lineIndex = 0;

    for(const line of coordinates) {
      for(let i = line[0]; i <= line[1]; i++) {
        const data: App.MetaData = <App.MetaData>this.getElement(i-line[0], lineIndex);
        this.updateById(i, <T>{
          ...data,
          main: main,
          union: [ ...area[0], ...area[1]],
          styles: {
            ...data?.styles,
            display: main ? "block" : "none",
            width: String(main ? 120 * (area[1][0] - area[0][0] + 1) : 120) + "px",
            height: String(main ? 24 * (area[1][1] - area[0][1] + 1) : 24) + "px",
          }
        })//<T>buffer.getElement(i-line[0], lineIndex);
        main = false;
      }
      lineIndex++;
    }
  }

  separateElements(area: App.CoordinatesArea<App.Coordinate>): void {
    const coordinates = this.areaCoordinates(area);
    let lineIndex = 0;

    for(const line of coordinates) {
      for(let i = line[0]; i <= line[1]; i++) {
        // console.log("777 i line buffer[] ", i, line, buffer.getElement(i-line[0], lineIndex) )

        const data = this.getElement(i-line[0], lineIndex);
        this.updateById(i, <T>{...data,
          styles: {
            display: "block",
            width: "120px",
            height: "24px",
            fontStyle: "none",
            fontWeight: "normal",
            textDecoration: "none",
            textAlign: "left",
          }})//<T>buffer.getElement(i-line[0], lineIndex);
      }
      lineIndex++;
    }
  }
}