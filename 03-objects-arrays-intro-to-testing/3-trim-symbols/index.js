/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  let delStr = '';
  let repeatStr = '';
  const singleLetter = [];
  
   if(size === 0) return '';
  
   if(size === 1) { 
     string.split("").forEach((item, n, arr) => {
       if(item != arr[n+1]) singleLetter.push(item);
     });
     return singleLetter.join("");
   }
  
   for(let i = 0; i < string.length; i++) {
     repeatStr = string[i].repeat(size);
     delStr = string[i].repeat(size + 1);
     string = string.replaceAll(delStr, repeatStr);
     }
   return string;
  
}
