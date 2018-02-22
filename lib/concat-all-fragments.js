
module.exports = concatAllFragments

// For each fragment, move its text into its matched suffix fragment.
// The ID of the suffix becomes the ID of the prefix so that it can be concatenated
// later with another prefix.
// If the fragment has no suffix, then it must be the end of the text -- add it to results.

function concatAllFragments (fragArr, fragObj) {
  const results = []
  while (fragArr.length) {
    const prefix = fragArr.pop()
    if (prefix.next) {
      const suffix = fragObj[prefix.next]
      const prefixStr = prefix.text.slice(0, prefix.text.length - prefix.clipLength)
      suffix.text = prefixStr + suffix.text
      fragObj[prefix.id] = suffix
      delete fragObj[suffix.id]
      suffix.id = prefix.id
    } else {
      results.push(prefix)
    }
  }
  return results
}
