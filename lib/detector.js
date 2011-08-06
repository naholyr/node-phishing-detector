module.exports = initialize;

function initialize (store, options, callback) {
  if ('undefined' == typeof store) {
    store = 'phishtank'; // Default 
  }
  if ('string' == typeof store) {
    var store_class;
    try {
      // Look for default location
      store_class = require('./stores/' + store);
    } catch (err) {
      // Not found in default location, load as a module
      store_class = require(store);
    }
    store = store_class;
  }
  if ('function' == typeof store) {
    store = new store(options, callback);
  }

  if ('object' != typeof store) {
    throw new Error('Phishing store must be an object');
  }
  if ('function' != typeof store.check) {
    throw new Error('Phishing store must be an instance of Store, or at least define a "check()" method');
  }

  return new PhishingDetector(store);
}

function PhishingDetector (store) {
  this.store = store;
}

PhishingDetector.prototype.check = function check (url, callback) {
  this.store.check(url, callback);
}
