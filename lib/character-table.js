
module.exports = characterTable

// Given a string, create a table of each character paired to its indexes in the string
// We want the indexes ordered right-to-left
// We leave out indexes < 2, because we only match on overlaps of 3 or more
// For example: 'banana' -> {a: [4, 3], n: [2, 4]}
function characterTable (str) {
  const table = {}
  // Iterate right to left
  for (let idx = str.length - 1; idx > 1; --idx) {
    let char = str[idx]
    if (!(char in table)) {
      table[char] = []
    }
    table[char].push(idx)
  }
  return table
}
