import { content } from "./const.js";

function foo(cnt) {
  return `foo outpu --> ${cnt}`;
}

export const res = foo(content);
