const stitchStream = require('./lib/stitch-stream')
const fs = require('fs')

let input
if (process.argv[2]) {
  input = fs.createReadStream(process.argv[2], 'utf8')
} else {
  input = process.stdin
}

stitchStream(input, function (err, result) {
  if (err) {
    throw err
  }
  console.log(result)
})
