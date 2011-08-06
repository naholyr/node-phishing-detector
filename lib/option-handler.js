const EventEmitter = require('events').EventEmitter,
      util = require('util');

module.exports = OptionHandler;

function OptionHandler (options, callback) {
  EventEmitter.call(this);

  if ('undefined' == typeof options) {
    options = {};
  }

  this.validateOptions(options, callback || OptionHandler.defaultValidationCallback);

  this.getOption = function (option, default_value) {
    return 'undefined' == typeof options[option] ? default_value : options[option];
  }

  this.setOption = function (option, value, callback) {
    if ('undefined' == typeof callback) callback = defaultValidationCallback;
    var old = options[option];
    options[option] = value;
    this.validateOptions(options, function (err) {
      if (err) {
        options[option] = old;
      } else {
        if (value != old) {
          this.emit('option', option, value, old);
          this.emit('option.' + option, value, old);
          options[option] = value;
        }
      }
      callback(err);
    });
  }
}

util.inherits(OptionHandler, EventEmitter);

OptionHandler.prototype.validateOptions = function (options, callback) {
  callback();
}

OptionHandler.defaultValidationCallback = function defaultValidationCallback (e) {
  if (e) {
    if (e instanceof Error) {
      throw e;
    } else {
      throw new Error(e);
    }
  }
}
