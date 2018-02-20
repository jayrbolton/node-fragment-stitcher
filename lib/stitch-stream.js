const attemptMatch = require('./attempt-match')
const characterTable = require('./character-table')

// Stitch a stream of text fragment lines into a decoded, ordered text with overlaps removed

module.exports = stitchStream

function stitchStream (stream, callback) {
  // We keep both an object and array of fragments to have kind of an ordered hash
  let fragObj = {}
  let fragArr = []
  // An array of successful fragment-fragment matches
  let matches = []

  // Read each line from the stream and preprocess the fragment
  stream.on('line', function (line) {
    const fragment = createFragment(line)
    fragObj[fragment.id] = fragment
    fragArr.push(fragment)
  })

  // The stream has ended -- now stitch together all fragments
  stream.on('close', function () {
    if (!fragArr.length) {
      callback(new Error('Did not read any lines'))
      return
    }
    // Find all the prefix/suffix matches
    // XXX this is the least efficient part of the process and is O(n^2)
    for (let prefixID in fragObj) {
      let prefix = fragObj[prefixID]
      for (let suffixID in fragObj) {
        if (prefixID === suffixID) continue
        let suffix = fragObj[suffixID]
        let length = attemptMatch(prefix, suffix)
        if (length) {
          matches.push({ prefixID: prefix.id, suffixID: suffix.id, length })
        }
      }
    }

    // Sort the matches, with longer matches at the end
    matches = matches.sort(compareMatches)

    // Take the longest matches and link the prefix fragment to its suffix
    while (matches.length) {
      const match = matches.pop()
      const prefix = fragObj[match.prefixID]
      const suffix = fragObj[match.suffixID]
      if (!prefix.next && !suffix.linked) {
        // free some memory
        delete prefix.table
        delete suffix.table
        prefix.next = match.suffixID
        prefix.clipLength = match.length
        suffix.linked = true
      }
    }

    // For each fragment, move its text into its suffix match and delete it
    // The ID of the suffix becomes the ID of the prefix so that it can be stitched later with another prefix
    // If the fragment has no suffix, then it must be the end of the text -- add it to results
    let results = []
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

    if (results.length > 1) {
      // We failed to find a good result
      // Create a printable error to diagnose the fragments
      const resultText = results.reduce(function (str, fragment, idx) {
        str += 'Result ' + (idx + 1) + ' ---\n ' + fragment.text
        str += '\n'
        return str
      }, '')
      callback(new Error('Unable to stitch fragments: ambiguous results'), resultText)
      return
    } else {
      // Success!  We found a single result
      callback(null, results[0].text)
    }
  })
}

// Custom comparison function for sorting all the matches by length
function compareMatches (m1, m2) {
  if (m1.length < m2.length) {
    return -1
  } else if (m1.length > m2.length) {
    return 1
  } else {
    return 0
  }
}

// Create a new text fragment object with a rightmost character table
function createFragment (encoded) {
  const decoded = decodeURIComponent(encoded.replace(/\+/g, '%20'))
  return {
    text: decoded,
    table: characterTable(decoded),
    id: ++id
  }
}

let id = 0
