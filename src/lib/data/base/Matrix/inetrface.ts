import type { CoordinatesArea,
  CoordinatesArray,
  Coordinate
} from "../../interface";

export interface MatrixEngine<T> {
  // private checkMatrix(x: number, y: number): boolean;

  update(x: number, y: number): MatrixEngine<T>;
  updateById(id: number, value: T): void;

  set element(value: T);
  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  get element(): T //{ x: number, y: number, value: T };

  getElement(x: number, y: number): T | undefined;
  setElement(x: number, y: number, value: T): void;

  areaCoordinates(area: CoordinatesArea<Coordinate>): CoordinatesArray<Coordinate>;
  areaModify(area: CoordinatesArea<Coordinate>, delta: [number, number]): CoordinatesArea<Coordinate>;
  readMatrix(area: CoordinatesArea<Coordinate>): MatrixEngine<T>
  getMatrix(area: CoordinatesArea<Coordinate>): MatrixEngine<T>;

  updateMatrix(area: CoordinatesArea<Coordinate>, buffer: MatrixEngine<T>): void;

  print(): T[] | undefined;

  set offset(value: Coordinate);
  get offset(): Coordinate
  get length(): number;
  get width(): number;
  get height(): number;
}

export interface Matrix<T> {
  engine: MatrixEngine<T>;

  update(x: number, y: number): MatrixEngine<T>;
  updateById(id: number, value: T): void;

  set element(value: T);
  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  get element(): T //{ x: number, y: number, value: T };

  getElement(x: number, y: number): T | undefined;
  setElement(x: number, y: number, value: T): void;

  areaCoordinates(area: CoordinatesArea<Coordinate>): CoordinatesArray<Coordinate>;
  areaModify(area: CoordinatesArea<Coordinate>, delta: [number, number]): CoordinatesArea<Coordinate>;
  readMatrix(area: CoordinatesArea<Coordinate>): MatrixEngine<T>
  getMatrix(area: CoordinatesArea<Coordinate>): MatrixEngine<T>;

  updateMatrix(area: CoordinatesArea<Coordinate>, buffer: MatrixEngine<T>): void;

  print(): T[];

  set offset(value: Coordinate);
  get offset(): Coordinate
  get length(): number;
  get width(): number;
  get height(): number;
  get array(): T[][];

  updateMatrixFromCursor(coordinate: App.Coordinate, buffer: App.MatrixEngine<T>): void;
  getMatrixString(area: App.CoordinatesArea<App.Coordinate>, separator: string): string;
  unionElements(area: App.CoordinatesArea<App.Coordinate>): void;
  separateElements(area: App.CoordinatesArea<App.Coordinate>): void;
}