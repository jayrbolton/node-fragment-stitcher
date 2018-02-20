const test = require('tape')
const characterTable = require('../lib/character-table')
const attemptMatch = require('../lib/attempt-match')

test('attemptMatch successfully matches a set of examples', function (t) {
  var ts1 = Date.now()
  const examples = [
    // [suffix_text, prefix_text, match_length]
    ['%2F%2FSample+progra', 'e+program%0Apubli', 8],
    ['start%3Astart%2Bfra', 'art%2BfragLen%5D%29%29%0A', 9],
    ['ict+court+of+Venice%0A', 'Venice%0AMust+needs+gi', 9],
    ['on+arbitrantur.+erun', 'rantur.+erunt+etiam%2C', 12],
    ['or+in+varias%0Areprehe', 'as%0Areprehensiones+in', 12]
  ]
  examples.map(createFragments).forEach(function ([prefix, suffix, len]) {
    const length = attemptMatch(prefix, suffix)
    t.strictEqual(length, len)
  })
  console.log('Milliseconds: ', Date.now() - ts1)
  t.end()
})

test('attemptMatch fails on a set of examples', function (t) {
  var ts1 = Date.now()
  const examples = [
    // [suffix_text, prefix_text]
    ['%2F%2FSample+progra', 'Sample+proart%2BfragLen%5D%29%29%0A'], // incomplete prefix
    ['start%3Astart%2Bfra', 'fre+program%0Apubli'], // match must be > 2
    ['ict+court+of+Venice%0A', 'rantur.+erunt+etiam%2C'],
    ['on+arbitrantur.+erun', 'Venice%0AMust+needs+gi'],
    ['s%29+%7B%0A++++++++%2F%2F', 'window.%0A+++++++']
  ]
  examples.map(createFragments).forEach(function ([prefix, suffix]) {
    const length = attemptMatch(prefix, suffix)
    t.strictEqual(length, 0)
  })
  console.log('Milliseconds: ', Date.now() - ts1)
  t.end()
})

// Helper function to turn strings into fragment objects of {text: string, table: characterTable}
function createFragments ([str1, str2, stitched]) {
  const frag1 = {text: str1, table: characterTable(str1)}
  const frag2 = {text: str2, table: characterTable(str2)}
  return [frag1, frag2, stitched]
}
