const attemptMatch = require('./attempt-match')

module.exports = findAllMatches

// Given an object of fragments and an id for a prefix
// Find all the suffix matches for that prefix
// Returns an array of match objects of {prefixID, suffixID, length}

// TODO this is the least efficient part of the process and is O(n^2)
// Replacing the match algorithm with a generalized suffix tree would make it O(n)

function findAllMatches (prefixID, fragments) {
  const found = []
  const prefix = fragments[prefixID]
  for (let suffixID in fragments) {
    if (prefixID === suffixID) continue
    const suffix = fragments[suffixID]
    const length = attemptMatch(prefix, suffix)
    if (length) {
      found.push({ prefixID: prefix.id, suffixID: suffix.id, length })
    }
  }
  return found
}
