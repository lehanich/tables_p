export type FormulaParserEngine<T> = {
  [x: string]: any;
  formula: string;
  formulaReg: RegExp;
  params: any[];
  paramsString: string;
  coordinates: string[];
  callBack?: () => string | undefined;
  getCoordinates(str: string): [string, string] | undefined;
}

export type FormulaParser<T> = {
  parser: FormulaParserEngine<T>;
  getCoordinates(str: string): [string, string] | undefined;
  exec(): any;
}

export interface Parser<T> {
  // paramsParser();
  getCoordinates(str: string): [string, string] | undefined;
  exec(): Iterable<T>;
}

export const CellAddrReg = /^([A-Z])(\d+)$/g;
export const FormulaReg = /^=([A-Z\d_]+)\((.*)\)$/g;
