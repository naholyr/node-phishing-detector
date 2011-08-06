const Store = require('../store'),
      fs = require('fs'),
      path = require('path');

var FileStore = module.exports = Store.create(initialize, check, validateOptions);

FileStore.prototype.reload = function reload (callback) {
  var self = this;
  fs.readFile(this.getOption('file'), function (err, content) {
    if (!err) {
      self.entries = content.toString().split("\n");
      self.emit('reloaded');
    } else {
      self.emit('readerror', err);
    }
    if (callback) {
      callback(err);
    }
  });
}

function validateOptions (options, callback) {
  if ('undefined' == typeof options.file) return callback('Required option "file"');
  path.exists(options.file, function (exists) {
    if (exists) {
      callback();
    } else {
      callback('Invalid option "file": cannot be found');
    }
  });
}

function initialize (callback) {  
  var self = this;

  function startWatching (file, callback) {
    self.emit('watching');
    fs.watchFile(file, function (curr, prev) {
      if (curr.mtime != prev.mtime) {
        self.emit('changed');
        self.reload(callback);
      }
    });
  }

  function stopWatching (file) {
    self.emit('unwatching');
    fs.unwatchFile(file);
  }

  this.entries = null;

  this.reload(function (err) {
    if (self.getOption('watch', true)) startWatching(self.getOption('file'));
    self.emit('ready');
    if (callback) callback();
  });

  this.on('option.file', function (value, old) {
    if (this.getOption('watch')) {
      stopWatching(old);
      startWatching(value);
    }
  });

  this.on('option.watch', function (value, old) {
    if (value) {
      startWatching(self.getOption('file'));
    } else {
      stopWatching(self.getOption('file'));
    }
  });
}

function check (url, callback) {
  if (!this.entries) {
    callback(new Error('FileStore not ready yet'));
  } else {
    callback(null, ~this.entries.indexOf(url));
  }
}
