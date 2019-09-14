import memoizee from "memoizee";

import bindStyleName from "./bindStyleName";

const memoBindStyeName = bindStyleName(memoizee);
console.warn("USING MEMO IMPLEMENTATION");

export default memoBindStyeName;
