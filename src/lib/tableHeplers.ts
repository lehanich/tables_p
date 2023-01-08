function toChar(_: any, i:number) {
  return String.fromCharCode(CODES.A + i);
}

const CODES = {
  A: 65,
  Z: 90,
};

export {
  toChar,
}