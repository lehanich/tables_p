type T = "" | object;

const nullMeta: App.MetaData = {
  styles: {
    fontStyle: "none",
    fontWeight: "normal",
    textDecoration: "none",
    textAlign: "left",
    display: "block",
    width: "120px",
    height: "24px"
  }
}

export default class MatrixEngine<T> implements App.MatrixEngine<T> {
  private data: T [];
  private matrixWidth: number;
  private matrixHeight: number;
  private offsetX: number;
  private offsetY: number;
  private initValue: unknown;
  private x: number;
  private y: number;

  constructor(x: number, y: number, initValue: "" | object = '') {
    console.log("matrix new size ", x, y);
    try {
      this.data = new Array(x*y);
    } catch(e) {
      console.log("!!!! matrix create error",e);
      this.data = new Array(10);
    }
    this.initValue = initValue;
    if (typeof initValue === "string") {
      this.data.fill(<T>"");
    } else {
      for(let i=0; i < this.data.length; i++) {
        this.data[i] = <T>{}; // nullMetadata
      }
    }

    this.matrixWidth = x;
    this.matrixHeight = y;
    this.x = 0;
    this.y = 0;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  private getId(x: number, y: number): number {
    return this.width * y + x;
  }

  // private checkMatrix(x: number, y: number): boolean {
  //   return false;
  // }

  update(x: number, y: number): App.MatrixEngine<T> {
    this.x = x;
    this.y = y;

    return this;
  }

  updateById(id: number, value: T): void {
    if (this.data) {
      this.data[id] = value;
    }
  }

  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  get element(): T {
    return this.data[this.getId(this.x, this.y)];
  }

  set element(value: T) {
    this.setElement(this.x, this.y, value);
  }

  setElement(x: number, y: number, value: T): void {
    if (!this.data) {
      return undefined;
    }

    this.data[this.getId(x,y)] = value;
  }

  getElement(x: number, y: number): T | undefined {
    if (!this.data) {
      return undefined;
    }

    return this.data[this.getId(x,y)];
  }

  areaCoordinates(area: App.CoordinatesArea<App.Coordinate>): App.CoordinatesArray<App.Coordinate> | [] {
    const coordinates = [];
    let line: number = area[0][1] - 1;

    while(line < area[1][1]) {
      coordinates.push([
        this.getId(area[0][0], line), this.getId(area[1][0], line)
      ]);
      line++;
    }

    return <App.CoordinatesArray<App.Coordinate>>coordinates;
  }

  areaModify(area: App.CoordinatesArea<App.Coordinate>,
    delta: App.Coordinate): App.CoordinatesArea<App.Coordinate> {
    return [
      [area[0][0] + delta[0], area[0][1] + delta[1]],
      [area[1][0] + delta[0], area[1][1] + delta[1]]
    ];
  }

  readMatrix(area: App.CoordinatesArea<App.Coordinate>): App.MatrixEngine<any> {
    console.log("matrix new boofer size", area[1][0] - area[0][0] + 1, area[1][1] - area[0][1] + 1)
    const buffer = new MatrixEngine(area[1][0] - area[0][0] + 1, area[1][1] - area[0][1] + 1);
    const bufferCoordinates = this.areaCoordinates(area);
    let lineIndex = 0;

    buffer.offset = [area[0][0], area[0][1]];

    for(const line of bufferCoordinates) {
      for(let i = line[0]; i <= line[1]; i++) {
        buffer.setElement(i-line[0], lineIndex, this.data[i]);
      }
      lineIndex++;
    }

    return buffer;
  }

  getMatrix(area: App.CoordinatesArea<App.Coordinate>): App.MatrixEngine<T> {
    console.log("matrixnew boofer size", area[1][0] - area[0][0] + 1, area[1][1] - area[0][1] + 1)
    const buffer = new MatrixEngine(area[1][0] - area[0][0] + 1, area[1][1] - area[0][1] + 1);
    const bufferCoordinates = this.areaCoordinates(area);
    let lineIndex = 0;

    buffer.offset = [area[0][0], area[0][1]];

    for(const line of bufferCoordinates) {
      for(let i = line[0]; i <= line[1]; i++) {
        buffer.setElement(i-line[0], lineIndex, this.data[i]);
        if (typeof this.initValue === "string") {
          this.data[i] = <T>"";
        } else {
          this.data[i] = <T>nullMeta;
        }
      }
      lineIndex++;
    }

    return <App.MatrixEngine<T>>buffer;
  }

  updateMatrix(area: App.CoordinatesArea<App.Coordinate>, buffer: App.MatrixEngine<T>): void {
    let lineIndex = 0;
    const dataCoordinates = this.areaCoordinates(area);

    for(const line of dataCoordinates) {
      for(let i = line[0]; i <= line[1]; i++) {
        this.data[i] = <T>buffer.getElement(i-line[0], lineIndex);
      }
      lineIndex++;
    }
  }

  set offset(value: App.Coordinate) {
    this.offsetX = value[0];
    this.offsetY = value[1];
  }

  get offset(): App.Coordinate {
    return [this.offsetX, this.offsetY]
  }

  print(): T[] {
    if (!this.data) {
      return [];
    }
    return this.data;
  }

  get length(): number {
    if (!this.data) {
      return 0;
    }

    return this.data.length;
  }

  get width(): number {
    return this.matrixWidth;
  }

  get height(): number {
    return this.matrixHeight;
  }

}
