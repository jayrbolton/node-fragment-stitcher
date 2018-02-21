
module.exports = createSuffixLinks

// Given an array of matches sorted by length (longer to the end)
// and an object of fragments:
// Create a suffix link for each fragment (.next)
// along with the "clipLength", the amount of overlap characters for each fragment

function createSuffixLinks (matches, fragments) {
  while (matches.length) {
    const match = matches.pop()
    const prefix = fragments[match.prefixID]
    const suffix = fragments[match.suffixID]
    if (!prefix.next && !suffix.linked) {
      // free some memory
      delete prefix.table
      delete suffix.table
      prefix.next = match.suffixID
      prefix.clipLength = match.length
      suffix.linked = true
    }
  }
}
