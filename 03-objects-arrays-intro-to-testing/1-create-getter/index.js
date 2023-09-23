/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const arr = path.split(".");
  let i = 0; 
  let tmpObj;

  return function(obj) {
    getValue(obj);
    return(tmpObj);
  } 

  function getValue(obj) {
    tmpObj = obj[arr[i]];
    i++;
    if(i < arr.length) {
      if(tmpObj) getValue(tmpObj);
    }
  }  

}
