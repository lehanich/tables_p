// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

declare namespace App {
	// interface Error {}
	// interface Locals {}
	// interface PageData {}
	// interface Platform {}

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
	
		print(): T[];
	
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

	export type MetaData = {
		styles: null | {
			fontStyle: string,
			fontWeight: string,
			textDecoration: string,
			textAlign: string,
			display:string,
			width: string,
			height: string
		},
		formula?: null | undefined | string,
		main?: boolean,
		union?: CoordinatesArea<Coordinate>
	}

	export const nullMeta: MetaData = {
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
}
