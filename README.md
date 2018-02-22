# node-fragment-stitcher

> Given a set of randomly ordered, url-encoded text fragments with prefix/suffix overlap, stitch them back together in the right order without overlap

This includes a command line app and a small web server to stitch text fragments together.

## Usage

### Command-line

First make sure you have the latest versions of `node` and `npm` installed. Then run:

```js
npm install
```

To run the command-line app, you can either use stdin or pass in a file path

```js
node index.js test/samples/IpsumLorem-short-frags.txt
cat test/samples/IpsumLorem-short-frags.txt | node index.js
```

### Web server

With docker and docker-compose installed, run:

```
docker-compose up
```

Without docker, make sure `node` and `npm` are installed and up-to-date. Also make sure to run `npm install`. Then you can run the server with:

```js
npm start
```

You will have a server running on port 3737, where you can make a POST request with a set of text fragments.

Simply post any text as binary data to the server and you will get the resulting repaired text in the response. For example:

```js
curl --data-binary "@test/samples/IpsumLorem-short-frags.txt" localhost:3737 
```

If the app is unable to stitch the text together correctly, you will get a 422 response with error information about the fragments.

## Tests

Run `npm test` to run the tests

## Approach

Since all the problem sizes were very small (~100 fragments), I did not prematurely optimize the algorithm. I did basically a brute-force approach with one easy optimization using string preprocessing. Inspired by remembering the Boyer-Moore algorithm, I made rightmost character tables for each fragment so that you can jump forward multiple character when testing a match

For example, say you have the fragment 'banana'. You character table is `{n: [4, 2], a: [5, 3]}` (we ignore the first two characters, as all overlaps must be at least 3 chars). When you match 'banana' with another string, you take the last character of the other string and fetch its rightmost index in the 'banana' table. If that does not match, then you advance to the next index in the array.

File layout:
* The main command-line app lives in `./index.js`
* The web server lives in `./server/index.js`
* Modules for the text fragment stitcher live in `lib/`
* All my dependencies are builtin node modules such as `http`, `fs`, `readline`, etc

I am using the [Standard JS](https://github.com/standard/standard) syntax style and linter

### Optimizing further

There are two main ways to optimize this app more, both in memory and speed:
* Use generalized suffix trees with Ukkonnen's algorithm to match fragments
* Use a fast key/value store instead of keeping all fragments in memory

Generalized suffix trees with Ukkonen's algorithm will give you `O(n*m)` search on finding suffix matches for all fragments, where n is the number of fragments and m is the length of the search path in the tree. You can search down a single path in a single tree for every fragment to find all its matches. The tree is also stored in O(n) memory where n is the total number of characters in the text.

I have Ukkonnen's algorithm mostly implemented in Node.js here: [https://github.com/jayrbolton/node-suffix-tree](https://github.com/jayrbolton/node-suffix-tree) (work-in-progress), but it is not yet included in this app, as I didn't want to overcomplicate it.

Also, instead of keeping all the fragments and all their matches in memory, you could store them in a fast key-value database like LevelDB. With node streams, when you read a file, you process a few lines at a time in parallel, and you don't hold the whole thing in memory. For every line, you can append data into the database. Then you can keep the fragments, suffix tree, matches, etc in the database as you process all the fragments and stitch them together, only holding a few objects in memory at a time.

### Fragment Ambiguity

This challenge is especially interesting because matching fragments can often be very ambiguous. For that reason, you need to find **all** matches on all fragments so that you can prioritize the longest ones.

For example, you have fragments A, B, C with the following prefix->suffix matches

```
A->C, length 10
A->B, length 6
B->C, length 12
```

If you process matches for only A first and link it to C, thinking that's the longest match, you may be incorrect. Instead, you want to create a link for A->B->C, prioritizing the longer match B->C, giving A a shorter match.

However, matching by longest matches among all matches does not always work. This was found in the `chopfile-frags.txt` example, and the ambiguity is described here: [ambig.txt](/docs/ambig.txt)

## See Also

## License

MIT

