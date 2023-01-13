import { Formula } from "./Formula";
import type { FormulaParser as IFormulaParser, FormulaParserEngine } from "./types";
import {ParserMathCols} from "./parsers/ParserMathCols";

export default class FormulaParser implements IFormulaParser<any> {
  engine: Formula;
  parser: FormulaParserEngine<any>;

  constructor(parser: FormulaParserEngine<any>) {
    this.parser = parser;
    this.engine = new Formula();
  }

  // paramsParser() {
  //   return [];
  // }

  getCoordinates(str: string) {
    return this.parser.getCoordinates(str);
  }

  exec(): string {
    const a = this.parser.exec();
    try {
      // const a = this.parser.exec();
      const f = this.engine[this.parser.formulaName];
      return f(a);
    } catch (e) {
      console.log("Formula error: ",e)
      return "#ERROR";
    }
  };
}

export {
  ParserMathCols
}