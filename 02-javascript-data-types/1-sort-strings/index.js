/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
   let newArr = [...arr];
   let direct;
    switch (param)
    {
     case 'asc': {direct = 1; break}
     case 'desc': {direct = -1; break}
    }
    return newArr.sort((a, b) => {
      return direct * a.localeCompare(b, ["ru", "en"], { caseFirst: 'upper'}); 
    });
}
