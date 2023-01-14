import type { FormulaParser as IFormulaParser } from "./types";
import {ParserMathCols} from "./parsers/ParserMathCols";
import { Math } from "./functions/Math";
import FormulaParser from "./FormulaParser";

type T = string | object;
type F = () => string | undefined;

export default function FormulaStart(
  formula: string,
  data: App.Matrix<T>,
  callback = undefined): string {

  let fParser: IFormulaParser<any> | null;
  let formulaName = "";
  const result1 = /^=([A-Z\d_]+)\((.*)\)$/g.exec(formula);

  if (result1 && result1?.length > 1) {
    formulaName = result1[1];
  }

  Object.getOwnPropertyNames(Math.prototype).forEach((name) => {
    if (formulaName === name) {
      fParser = new FormulaParser(new ParserMathCols(formula, data, <F>callback));
    }
  });

  try {
    return fParser.exec();
  } catch (e) {
    console.log("Formula error:", e);
    return "#ERROR";
  };
}
