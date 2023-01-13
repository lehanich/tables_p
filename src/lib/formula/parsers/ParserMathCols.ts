// import { Formula } from "../Formula";
import type { FormulaParserEngine } from "../types";
import { CellAddrReg, FormulaReg } from "../types";

const CODES = {
  A: 65,
  Z: 90,
};

type T = string | object;

export class ParserMathCols implements FormulaParserEngine<any> {
  formula = "";
  formulaReg = FormulaReg;
  formulaName: string;
  params: any[];
  paramsString = "";
  coordinates: [string] = ["A1"];
  callBack?: () => string | undefined;
  data;

  constructor(formula: string, data: App.Matrix<T>, callback: () => string | undefined) {
    this.formula = formula;
    this.params = [];
    this.coordinates; // = coordinates; // CellAddrReg
    this.callBack = callback;
    this.data = data;

    const result1 = /^=([A-Z\d_]+)\((.*)\)$/g.exec(formula);// this.formulaReg.exec(formula);
    console.log("9993",formula, result1);

    if (result1 && result1?.length > 1) {
      this.formulaName = result1[1];
      this.paramsString = result1[2];
      this.params = this.paramsString.split(";");
      // console.log("formula params", this.params)
    } else {
      this.formulaName = "";
    }
  }

  paramsParser() {
    return [];
  }

  getCoordinates(str: string): [string, string] | undefined {
    const result = CellAddrReg.exec(str);
    if (result && result[1] && result[2]) {
      return [result[1], result[2]];
    }

    return undefined;
  }

  exec(): any {
    const result = [];
    let res;
    let area: App.CoordinatesArea<App.Coordinate> = [[0,1],[0,1]];
    let areaData: App.MatrixEngine<T>;
    for(const item of this.params) {

      switch (true) {
        case /^([A-Z])(\d+)$/g.test(item):
          res = /^([A-Z])(\d+)$/g.exec(item);
          if (!res) {
            result.push(NaN);
          } else {
            result.push(Number(this.data.getElement(String(res[1]).charCodeAt(0) - CODES.A, Number(res[2])-1)));
          }
          break;
        case /^([A-Z])(\d+):([A-Z])(\d+)$/g.test(item):
          res = /^([A-Z])(\d+):([A-Z])(\d+)$/g.exec(item);
          console.log("formula param", res)
          if (!res) {
            result.push(NaN);
          } else {

            area = [
              [res[1].charCodeAt(0) - CODES.A, +res[2]],
              [res[3].charCodeAt(0) - CODES.A, +res[4]]
            ];
            areaData = this.data.readMatrix(area);

            for (const element of areaData.print()) {
              result.push(+element);
            }
          }
          break;
        case /(\d+)/g.test(item):
          result.push(+item);
          break;
        default:
          return NaN;
          break;
      }

    }

    return result;
  };
}

