var Notification = function (actor, verb, object) {
  if (!actor || !verb) {
    throw new Error('Actor and Verb parameters are mandatory');
  }
  
  this.actor = actor;
  this.verb = verb;
  this.object = object;
  this.time = new Date();
};

var Notif = function() {
  this._handlers = [];
};

Notif.prototype.send = function (actor, verb, object, cb) {
  if (typeof object === 'function') {
    cb = object;
    object = null;
  }
  if (typeof cb !== 'function') {
    cb = function () {};
  }

  var notification = new Notification(actor, verb, object);

  this._executeHandlers(notification, cb);
};

Notif.prototype._getHandlers = function (notification) {
  var self = this;

  var queue = [];
  this._handlers.forEach(function (handler) {
    var opts = handler.opts;
    if (opts.only) {
      if (opts.only.indexOf(notification.verb) !== -1) {
        queue.push(handler);
      }
    }
    else if (opts.except) {
      if (opts.except.indexOf(notification.verb) === -1) {
        queue.push(handler);
      }
    }
    else if (opts.all) {
      queue.push(handler);
    }
  });  
  return queue;
};

Notif.prototype._executeHandlers = function (notification, cb) {
  var handlers = this._getHandlers(notification);

  // wrap handlers for use with async.series
  var errors = [];
  var results = [];
  var callbackCount = 0;
  handlers.forEach(function (handler) {
    // hanlders are run asynchronously
    handler(notification, function (err, res) {
      errors.push(err);
      results.push(res);
      callbackCount++;

      // handle last call back -> call external callback with
      // accumulated errors/results
      if (callbackCount === handlers.length) {
        if (errors.length === 0) errors = null;
        cb(errors, results);
      }
    });
  });
};

Notif.prototype.register = function (opts, handler) {
  // notif.register('verb..', fn)
  if (typeof opts === 'string') {
    opts = { only: opts }
  }
  // notif.register(fn);
  else if (typeof opts === 'function') {
    handler = opts;
    opts = { all: true };
  }
  
  handler.opts = opts;
  this._handlers.push(handler);
}; 

module.exports = new Notif();
