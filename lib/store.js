const OptionHandler = require('./option-handler'),
      util = require('util');

module.exports = Store;

function Store (options, callback) {
  OptionHandler.call(this, options, callback);
}

util.inherits(Store, OptionHandler);

Store.prototype.check = function check (url, callback) {
  throw new Error('Not implemented');
}

Store.create = function create (initialize, check, validateOptions) {
  var TheStore = function TheStore (options, callback) {
    var self = this;
    Store.call(this, options, function (err) {
      if (err) {
        (callback || OptionHandler.defaultValidationCallback)(err);
      } else {
        initialize.call(self, callback);
      }
    });
  }
  util.inherits(TheStore, Store);

  TheStore.prototype.check = check;
  TheStore.prototype.validateOptions = validateOptions;

  return TheStore;
}
