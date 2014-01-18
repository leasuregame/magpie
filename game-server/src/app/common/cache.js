var Cache, now;

Cache = (function() {
  function Cache() {
    this.cache = {};
    this.debug = false;
    this.hitCount = 0;
    this.missCount = 0;
  }

  Cache.prototype.put = function(key, value, time, timeoutCallback) {
    if (this.debug) console.log('caching: ' + key + ' = ' + value + ' (@' + time + ')');
    var oldRecord = this.cache[key];
    if (oldRecord) {
      clearTimeout(oldRecord.timeout);
    }

    var expire = time + now();
    var record = {
      value: value,
      expire: expire
    };

    var _this = this;
    if (!isNaN(expire)) {
      var timeout = setTimeout(function() {
        _this.del(key);
        if (typeof timeoutCallback === 'function') {
          timeoutCallback(key);
        }
      }, time);
      record.timeout = timeout;
    }

    this.cache[key] = record;
  };

  Cache.prototype.del = function(key) {
    delete this.cache[key];
  };

  Cache.prototype.clear = function() {
    this.cache = {};
  };

  Cache.prototype.get = function(key) {
    var data = this.cache[key];
    if (typeof data != "undefined") {
      if (isNaN(data.expire) || data.expire >= now()) {
        if (this.debug) hitCount++;
        return data.value;
      } else {
        // free some space
        if (this.debug) missCount++;
        this.del(key);
      }
    }
    return null;
  };

  Cache.prototype.all = function() {
    var key, results = [],
      item = null;
    for (key in this.cache) {
      if (this.cache.hasOwnProperty(key)) {
        item = this.get(key);
        if (item !== null) {
          results.push(item);
        }
      }
    }
    return results;
  };

  Cache.prototype.size = function() {
    var size = 0,
      key;
    for (key in this.cache) {
      if (this.cache.hasOwnProperty(key))
        if (this.get(key) !== null)
          size++;
    }
    return size;
  };

  Cache.prototype.memsize = function() {
    var size = 0,
      key;
    for (key in this.cache) {
      if (this.cache.hasOwnProperty(key))
        size++;
    }
    return size;
  };

  Cache.prototype.debug = function(bool) {
    this.debug = bool;
  };

  Cache.prototype.hits = function() {
    return this.hitCount;
  };

  Cache.prototype.misses = function() {
    return this.missCount;
  };

  return Cache;

})();

now = function() {
  return (new Date).getTime();
};

module.exports = Cache;