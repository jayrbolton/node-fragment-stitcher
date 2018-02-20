
module.exports = attemptMatch

// Try to match the end of the prefixFragment to the beginning of the suffixFragment
// Returns length > 2 if there is a match
// Otherwise returns 0

// Note: we are matching the *suffix* of prefixFragment to the *prefix* of suffixFragment

function attemptMatch (prefixFragment, suffixFragment) {
  const prefixText = prefixFragment.text
  const table = suffixFragment.table
  const suffixText = suffixFragment.text

  let lastChar = prefixText[prefixText.length - 1]
  // We can return early if the suffixFragment does not have the lastChar anywhere
  if (!(lastChar in table)) {
    return 0
  }

  // Offset tracks the nth character we are testing in the table
  // Example, given a character table of {b: [4, 3]}:
  // With an offset of 0, then we would get the `4` index for 'b'
  // With an offset of 1, then we would get the `3` index for 'b'
  // With an offset of 2, then we would get the `undefined` index for 'b'
  let offset = 0
  let matchIdx = table[lastChar][offset]

  while (matchIdx) {
    // The length of the overlap string
    const length = matchIdx + 1
    // The overlap substring in suffixText
    const prefixOverlap = prefixText.slice(prefixText.length - length)
    // The overlap substring in prefixText
    const suffixOverlap = suffixText.slice(0, length)
    if (prefixOverlap === suffixOverlap) {
      // Success! We have a match
      return length
    } else {
      // Try the next right-most character in suffixText that matches prefixText's last character
      offset += 1
      matchIdx = table[lastChar][offset]
    }
  }
  return 0 // No match
}
