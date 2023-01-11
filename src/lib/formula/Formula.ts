import {Math} from "./functions/Math";

class Formula {

}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Formula extends Math {}

function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
          Object.create(null)
      );
    });
  });
}

applyMixins(Formula, [Math]);

export { Formula };
