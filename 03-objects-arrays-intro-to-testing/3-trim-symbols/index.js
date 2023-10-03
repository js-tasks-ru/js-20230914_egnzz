/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  let delStr = '';
  let repeatStr = '';
  if (size === 0) {return '';}
  if (typeof size === "undefined") {return string;}

  let i = 0;
  while (i < string.length) {
    repeatStr = string[i].repeat(size);
    delStr = string[i].repeat(size + 1);
    if (string.indexOf(delStr) >= 0) {
      string = string.replace(delStr, repeatStr);  
      i = string.indexOf(delStr);
    }
    i++;
  }
  return string;

}
