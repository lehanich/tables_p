export default class Matrix {
  private data: undefined | any[];
  private width: number;
  private height: number;
  private offsetX: number;
  private offsetY: number;

  constructor(x: number, y: number, initValue: any = '') {
    this.data = new Array(x*y);
    this.data.fill(initValue);
    this.width = x;
    this.height = y;
  }

  private getId(x: number, y: number): number {
    return this.width * y + x;
  }

  private checkMatrix(x: number, y: number): boolean {
    return false;
  }

  update(x: number, y: number) {
    this.x = x;
    this.y = y;

    return this;
  }

  set element(value) {
    this.setElement(this.x, this.y, value);

  }

  setElement(x: number, y: number, value: any): void {
    if (!this.data) {
      return undefined;
    }

    return this.data[this.getId(x,y)] = value;
  }

  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  get element(): any | undefined {
    if (!this.data) {
      return undefined;
    }

    return this.data[this.getId(this.x, this.y)];
  }

  getElement(x,y): any | undefined {
    if (!this.data) {
      return undefined;
    }

    return this.data[this.getId(x,y)];
  }

  areaCoordinates(area) {
    const coordinates = [];
    let line = area[0][1] - 1;

    while(line < area[1][1]) {
      coordinates.push([
        this.getId(area[0][0], line), this.getId(area[1][0], line)
      ]);
      line++;
    }

    return coordinates;
  }

  areaModify(area, delta) {
    area[0][1] = area[0][1] + delta[1]
    area[1][1] = area[1][1] + delta[1]
    area[0][0] = area[0][0] + delta[0]
    area[1][0] = area[1][0] + delta[0]

    return area;
  }

  getMatrix(area) {
    const buffer = new Matrix(area[1][0] - area[0][0] + 1, area[1][1] - area[0][1] + 1);
    const bufferCoordinates = this.areaCoordinates(area);
    let lineIndex = 0;
    console.log("777 data before buffer ", this.data)
    buffer.offset = [area[0][0], area[0][1]];

    for(const line of bufferCoordinates) {
      for(let i = line[0]; i <= line[1]; i++) {
        buffer.setElement(i-line[0], lineIndex, this.data[i]);
        this.data[i] = "";
      }
      lineIndex++;
    }
    console.log("777 buffer", buffer.print())
    return buffer;
  }

  updateMatrix(area, buffer) {
    let lineIndex = 0;
    const dataCoordinates = this.areaCoordinates(area);
    console.log("777 dataCoordinates", dataCoordinates)
    const offset = buffer.offset;

    for(const line of dataCoordinates) {
      for(let i = line[0]; i <= line[1]; i++) {
        console.log("777 i line buffer[] ", i, line, buffer.getElement(i-line[0], lineIndex) )

        this.data[i] = buffer.getElement(i-line[0], lineIndex);
        
      }
      lineIndex++;
    }

    // index1 = 0;
    // for(let i=selCoordinates[0][1] - 1 + deltaCols[1]; i < selCoordinates[1][1] + deltaCols[1]; i++) {

    //   let index2 = 0;
    //   for(let j = selCoordinates[0][0] + deltaCols[0]; j <= selCoordinates[1][0] + deltaCols[0]; j++) {
    //     $state[i][j] = buffer[index1][index2];
    //     index2++;
    //   }
    //   index1++;
    // }
    console.log("777 new data", this.data)
  }

  set offset(value) {
    this.offsetX = value[0];
    this.offsetY = value[1];
  }

  get offset() {
    return [this.offsetX, this.offsetY]
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

  get width(): number {
    return this.width;
  }

  get height(): number {
    return this.height;
  }
}