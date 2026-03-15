import { TYPE_META } from "./types.js";

const REVERSE_MAP = {
  F: "I",
  I: "F",
  R: "C",
  C: "R",
  O: "A",
  A: "O",
  T: "P",
  P: "T"
};

export function getReverseTypeCode(typeCode) {
  return typeCode
    .split("")
    .map(char => REVERSE_MAP[char] || char)
    .join("");
}

export function getReverseTypeInfo(typeCode) {
  const reverseCode = getReverseTypeCode(typeCode);
  const meta = TYPE_META[reverseCode];

  return {
    typeCode: reverseCode,
    typeName: meta?.name || reverseCode,
    shortCopy: meta?.shortCopy || ""
  };
}
