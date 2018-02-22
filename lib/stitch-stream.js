const readline = require('readline')
const characterTable = require('./character-table')
const findAllMatches = require('./find-all-matches')
const createSuffixLinks = require('./create-suffix-links')
const concatAllFragments = require('./concat-all-fragments')

// Stitch a stream of text fragment lines into a decoded, ordered text with overlaps removed

module.exports = stitchStream

function stitchStream (stream, callback) {
  // We keep both an object and array of fragments to have kind of an ordered hash
  let fragObj = {}
  let fragArr = []
  // An array of successful fragment-fragment matches
  let matches = []

  // Create a stream that reads line-by-line
  const lineStream = readline.createInterface({input: stream, terminal: false})

  // Read each line from the stream and preprocess the fragment
  lineStream.on('line', function (line) {
    const fragment = createFragment(line)
    fragObj[fragment.id] = fragment
    fragArr.push(fragment)
  })

  // The stream has ended -- now stitch together all fragments
  lineStream.on('close', function () {
    if (!fragArr.length) {
      callback(new Error('Did not read any lines'))
      return
    }

    // Find all the prefix/suffix matches
    for (let prefixID in fragObj) {
      matches = matches.concat(findAllMatches(prefixID, fragObj))
    }

    // Sort the matches, with longer matches at the end
    matches = matches.sort(compareMatches)

    // Create a .next and .clipLength key for each fragment so we can start to link them up
    createSuffixLinks(matches, fragObj)

    // Now concatenate every fragment with its suffix
    // The results array will hold any end fragments that have no suffixes
    // If the full stitching was successful, results will have just one end
    // fragment with all other fragments concatenated to it
    const results = concatAllFragments(fragArr, fragObj)

    if (results.length > 1) {
      // We failed to find an unambiguous result
      // Create a printable error to diagnose the fragments
      const resultText = results.reduce(function (str, fragment, idx) {
        str += 'Result ' + (idx + 1) + ' ---\n ' + fragment.text
        str += '\n'
        return str
      }, '')
      callback(new Error('Unable to stitch fragments: ambiguous results'), resultText)
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
