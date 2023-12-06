export {};

Array.prototype.firstOrDefault = function(callback, defaultReturn) {
  if (this.length === 0) {
    return undefined;
  }
  if (callback == null) {
    return this[0];
  } else {
    for (let i = 0; i < this.length; i++) {
      if (callback(this[i])) {
        return this[i];
      }
    }
  }
  return defaultReturn || null;
};