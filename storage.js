"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.set = set;
exports.get = get;
exports.del = del;

function set(name, value) {
  window.localStorage.setItem(name, JSON.stringify(value));
}

function get(name) {
  var subst = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  return JSON.parse(window.localStorage.getItem(name) || subst);
}

function del(name) {
  localStorage.removeItem(name);
}