module.exports = require('./lib/detector');

if (!module.parent) {
  var detector = require('./lib/detector')("file", {
    "file": "./urls.txt",
    "watch": true
  }, check);

  function check (err) {
    if (err) throw err;
    detector.check('http://naholyr.fr', function (err, found) {
      console.log('checked', err, !!found);
    })
  }

  detector.store.on('changed', function () {
    console.log('changed');
    detector.store.once('reloaded', check);
  });
}
