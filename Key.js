"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _create = _interopRequireDefault(require("./utils/create.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Key = function Key(_ref) {
  var small = _ref.small,
      shift = _ref.shift,
      code = _ref.code;

  _classCallCheck(this, Key);

  this.code = code;
  this.small = small;
  this.shift = shift;
  this.isFnKey = Boolean(small.match(/Ctrl|arr|Alt|Shift|Tab|Back|Del|Enter|Caps|Win|language/));

  if (shift && shift.match(/[^a-zA-Zа-яА-ЯёЁ0-9]/)) {
    this.sub = (0, _create["default"])('div', 'sub', this.shift);
  } else {
    this.sub = (0, _create["default"])('div', 'sub', '');
  }

  if (small.match(/language/)) {
    var lang = (0, _create["default"])('i', 'icon-globe', '');
    this.letter = (0, _create["default"])('div', 'letter', [lang]);
  } else {
    this.letter = (0, _create["default"])('div', 'letter', small);
  }

  this.div = (0, _create["default"])('div', 'keyboard__key', [this.sub, this.letter], null, ['code', this.code], this.isFnKey ? ['fn', 'true'] : ['fn', 'false']); // мы забыли этот атрибут добавить )) он нужен, чтобы в разметке стилизовать функциональные клавиши отдельно
};

exports["default"] = Key;