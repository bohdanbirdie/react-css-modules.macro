import bindStyleName from "./bindStyleName";

const pureBindStyeName = bindStyleName(func => func);
console.warn("USING PURE IMPLEMENTATION");
export default pureBindStyeName;
