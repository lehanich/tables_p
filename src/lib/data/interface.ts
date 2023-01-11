export type CoordinatesArea<Coordinate> = [Coordinate,Coordinate];
export type CoordinatesArray<Coordinate> = Coordinate[] | [];
export type Coordinate = [number, number];
export type CoordinateName = [string, number];

export type Coordinates = {
  select: CoordinatesArea<Coordinate>,
  selectName: CoordinatesArea<CoordinateName>,
  borderCover: {
    height: number,
    left: number,
    top: number,
    width: number
  },
  selectCell: {
    height: number,
    left: number,
    top: number,
    width: number
  },
  selectSpace: {
    height: number,
    left: number,
    top: number,
    width: number
  },
  editCellCols: Coordinate,
  editCell: {
    height: number,
    left: number,
    top: number,
    width: number
  },
  selectFormulaSpace: {
    height: number,
    left: number,
    top: number,
    width: number
  },
  selectFormulaBorder: {
    height: number,
    left: number,
    top: number,
    width: number
  },
  functionCell: null | HTMLDivElement;
};
