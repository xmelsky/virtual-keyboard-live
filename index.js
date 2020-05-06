"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var storage = _interopRequireWildcard(require("./storage.js"));

var _create = _interopRequireDefault(require("./utils/create.js"));

var _index = _interopRequireDefault(require("./layouts/index.js"));

var _Key = _interopRequireDefault(require("./Key.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialOrder = [['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Delete'], ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backspace'], ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Backslash', 'Enter'], ['ShiftLeft', 'IntlBackslash', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ArrowUp', 'ShiftRight'], ['ControlLeft', 'Win', 'AltLeft', 'Space', 'AltRight', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'ControlRight']];
var lang = storage.get('kbLang', '"ru"');

var Keyboard = function Keyboard() {
  var _this = this;

  var rowsOrder = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialOrder;

  _classCallCheck(this, Keyboard);

  _defineProperty(this, "init", function (targetElement, parentElement) {
    var langCode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : lang;
    _this.lang = langCode;
    _this.keyBase = _index["default"][langCode];

    if (targetElement instanceof HTMLTextAreaElement || targetElement instanceof HTMLInputElement) {
      _this.output = targetElement;
    } else {
      var Element = document.querySelector(targetElement);
      if (!Element) throw Error("Target Element '".concat(targetElement, "' not found in DOM"));
      _this.output = Element;
    }

    if (parentElement instanceof HTMLElement) {
      _this.parentContainer = targetElement;
    } else {
      _this.parentContainer = document.querySelector(parentElement);
      if (!_this.parentContainer) throw Error("Target Element '".concat(parentElement, "' not found in DOM"));
    }

    return _this;
  });

  _defineProperty(this, "generateLayout", function () {
    _this.container = (0, _create["default"])('div', 'keyboard', null, _this.parentContainer, ['language', _this.lang]);
    _this.keyButtons = [];

    _this.rowsOrder.forEach(function (row, i) {
      var rowElement = (0, _create["default"])('div', 'keyboard__row', null, _this.container, ['row', i + 1]);
      rowElement.style.gridTemplateColumns = "repeat(".concat(row.length, ", 1fr)");
      row.forEach(function (code) {
        var keyObj = _this.keyBase.find(function (key) {
          return key.code === code;
        });

        if (keyObj) {
          var keyButton = new _Key["default"](keyObj);

          _this.keyButtons.push(keyButton);

          rowElement.appendChild(keyButton.div);
        }
      });
    });

    document.addEventListener('keydown', _this.handleEvent);
    document.addEventListener('keyup', _this.handleEvent);
    _this.container.onmousedown = _this.preHandleEvent;
    _this.container.onmouseup = _this.preHandleEvent;
  });

  _defineProperty(this, "preHandleEvent", function (e) {
    e.stopPropagation();
    var keyDiv = e.target.closest('.keyboard__key');
    if (!keyDiv) return;
    var code = keyDiv.dataset.code;
    keyDiv.addEventListener('mouseleave', _this.resetButtonState);

    _this.handleEvent({
      code: code,
      type: e.type
    });
  });

  _defineProperty(this, "handleEvent", function (e) {
    if (e.stopPropagation) e.stopPropagation();
    var code = e.code,
        type = e.type;

    var keyObj = _this.keyButtons.find(function (key) {
      return key.code === code;
    });

    if (!keyObj) return;

    _this.output.focus(); // НАЖАТИЕ КНОПКИ


    if (type.match(/keydown|mousedown/)) {
      if (!type.match(/mouse/)) e.preventDefault();
      if (code.match(/Shift/)) _this.shiftKey = true;
      if (_this.shiftKey) _this.switchUpperCase(true);
      if (code.match(/Control|Alt|Caps/) && e.repeat) return;
      if (code.match(/Control/)) _this.ctrKey = true;
      if (code.match(/Alt/)) _this.altKey = true;
      if (code.match(/Control/) && _this.altKey) _this.switchLanguage();
      if (code.match(/Alt/) && _this.ctrKey) _this.switchLanguage();
      if (code.match(/Win/)) _this.switchLanguage();
      keyObj.div.classList.add('active');

      if (code.match(/Caps/) && !_this.isCaps) {
        _this.isCaps = true;

        _this.switchUpperCase(true);
      } else if (code.match(/Caps/) && _this.isCaps) {
        _this.isCaps = false;

        _this.switchUpperCase(false);

        keyObj.div.classList.remove('active');
      } // Определяем, какой символ мы пишем в консоль (спец или основной)


      if (!_this.isCaps) {
        // если не зажат капс, смотрим не зажат ли шифт
        _this.printToOutput(keyObj, _this.shiftKey ? keyObj.shift : keyObj.small);
      } else if (_this.isCaps) {
        // если зажат капс
        if (_this.shiftKey) {
          // и при этом зажат шифт - то для кнопки со спецсимволом даем верхний регистр
          _this.printToOutput(keyObj, keyObj.sub.innerHTML ? keyObj.shift : keyObj.small);
        } else {
          // и при этом НЕ зажат шифт - то для кнопки без спецсивмола даем верхний регистр
          _this.printToOutput(keyObj, !keyObj.sub.innerHTML ? keyObj.shift : keyObj.small);
        }
      }

      _this.keysPressed[keyObj.code] = keyObj;

      if (_this.subscribers.has(code)) {
        _this.subscribers.get(code).forEach(function (cb) {
          return cb();
        });
      } // ОТЖАТИЕ КНОПКИ

    } else if (e.type.match(/keyup|mouseup/)) {
      _this.resetPressedButtons(code); // if (code.match(/Shift/) && !this.keysPressed[code])


      if (code.match(/Shift/)) {
        _this.shiftKey = false;

        _this.switchUpperCase(false);
      }

      if (code.match(/Control/)) _this.ctrKey = false;
      if (code.match(/Alt/)) _this.altKey = false;
      if (!code.match(/Caps/)) keyObj.div.classList.remove('active');
    }
  });

  _defineProperty(this, "resetButtonState", function (_ref) {
    var code = _ref.target.dataset.code;

    if (code.match('Shift')) {
      _this.shiftKey = false;

      _this.switchUpperCase(false);

      _this.keysPressed[code].div.classList.remove('active');
    }

    if (code.match(/Control/)) _this.ctrKey = false;
    if (code.match(/Alt/)) _this.altKey = false;

    _this.resetPressedButtons(code);

    _this.output.focus();
  });

  _defineProperty(this, "resetPressedButtons", function (targetCode) {
    if (!_this.keysPressed[targetCode]) return;
    if (!_this.isCaps) _this.keysPressed[targetCode].div.classList.remove('active');

    _this.keysPressed[targetCode].div.removeEventListener('mouseleave', _this.resetButtonState);

    delete _this.keysPressed[targetCode];
  });

  _defineProperty(this, "switchUpperCase", function (isTrue) {
    // Флаг - чтобы понимать, мы поднимаем регистр или опускаем
    if (isTrue) {
      // Мы записывали наши кнопки в keyButtons, теперь можем легко итерироваться по ним
      _this.keyButtons.forEach(function (button) {
        // Если у кнопки есть спецсивол - мы должны переопределить стили
        if (button.sub) {
          // Если только это не капс, тогда поднимаем у спецсимволов
          if (_this.shiftKey) {
            button.sub.classList.add('sub-active');
            button.letter.classList.add('sub-inactive');
          }
        } // Не трогаем функциональные кнопки
        // И если капс, и не шифт, и именно наша кнопка без спецсимвола


        if (!button.isFnKey && _this.isCaps && !_this.shiftKey && !button.sub.innerHTML) {
          // тогда поднимаем регистр основного символа letter
          button.letter.innerHTML = button.shift; // Если капс и зажат шифт
        } else if (!button.isFnKey && _this.isCaps && _this.shiftKey) {
          // тогда опускаем регистр для основного симовла letter
          button.letter.innerHTML = button.small; // а если это просто шифт - тогда поднимаем регистр у основного символа
          // только у кнопок, без спецсимвола --- там уже выше отработал код для них
        } else if (!button.isFnKey && !button.sub.innerHTML) {
          button.letter.innerHTML = button.shift;
        }
      });
    } else {
      // опускаем регистр в обратном порядке
      _this.keyButtons.forEach(function (button) {
        // Не трогаем функциональные кнопки
        // Если есть спецсимвол
        if (button.sub.innerHTML && !button.isFnKey) {
          // то возвращаем в исходное
          button.sub.classList.remove('sub-active');
          button.letter.classList.remove('sub-inactive'); // если не зажат капс

          if (!_this.isCaps) {
            // то просто возвращаем основным символам нижний регистр
            button.letter.innerHTML = button.small;
          } else if (!_this.isCaps) {
            // если капс зажат - то возвращаем верхний регистр
            button.letter.innerHTML = button.shift;
          } // если это кнопка без спецсимвола (снова не трогаем функциональные)

        } else if (!button.isFnKey) {
          // то если зажат капс
          if (_this.isCaps) {
            // возвращаем верхний регистр
            button.letter.innerHTML = button.shift;
          } else {
            // если отжат капс - возвращаем нижний регистр
            button.letter.innerHTML = button.small;
          }
        }
      });
    }
  });

  _defineProperty(this, "switchLanguage", function () {
    var langAbbr = Object.keys(_index["default"]);
    var langIdx = langAbbr.indexOf(_this.container.dataset.language);
    _this.keyBase = langIdx + 1 < langAbbr.length ? _index["default"][langAbbr[langIdx += 1]] : _index["default"][langAbbr[langIdx -= langIdx]];
    _this.container.dataset.language = langAbbr[langIdx];
    storage.set('kbLang', langAbbr[langIdx]);

    _this.keyButtons.forEach(function (button) {
      var keyObj = _this.keyBase.find(function (key) {
        return key.code === button.code;
      });

      if (!keyObj) return;
      button.shift = keyObj.shift;
      button.small = keyObj.small;

      if (keyObj.shift && keyObj.shift.match(/[^a-zA-Zа-яА-ЯёЁ0-9]/g)) {
        button.sub.innerHTML = keyObj.shift;
      } else {
        button.sub.innerHTML = '';
      }

      if (button.code !== 'Win') {
        button.letter.innerHTML = keyObj.small;
      }
    });

    if (_this.isCaps) _this.switchUpperCase(true);
  });

  _defineProperty(this, "printToOutput", function (keyObj, symbol) {
    var cursorPos = _this.output.selectionStart;

    var left = _this.output.value.slice(0, cursorPos);

    var right = _this.output.value.slice(cursorPos);

    var textHandlers = {
      Tab: function Tab() {
        _this.output.value = "".concat(left, "\t").concat(right);
        cursorPos += 1;
      },
      ArrowLeft: function ArrowLeft() {
        cursorPos = cursorPos - 1 >= 0 ? cursorPos - 1 : 0;
      },
      ArrowRight: function ArrowRight() {
        cursorPos += 1;
      },
      ArrowUp: function ArrowUp() {
        var positionFromLeft = _this.output.value.slice(0, cursorPos).match(/(\n).*$(?!\1)/g) || [[1]];
        cursorPos -= positionFromLeft[0].length;
      },
      ArrowDown: function ArrowDown() {
        var positionFromLeft = _this.output.value.slice(cursorPos).match(/^.*(\n).*(?!\1)/) || [[1]];
        cursorPos += positionFromLeft[0].length;
      },
      Enter: function Enter() {
        _this.output.value = "".concat(left, "\n").concat(right);
        cursorPos += 1;
      },
      Delete: function Delete() {
        _this.output.value = "".concat(left).concat(right.slice(1));
      },
      Backspace: function Backspace() {
        _this.output.value = "".concat(left.slice(0, -1)).concat(right);
        cursorPos -= 1;
      },
      Space: function Space() {
        _this.output.value = "".concat(left, " ").concat(right);
        cursorPos += 1;
      }
    };
    if (textHandlers[keyObj.code]) textHandlers[keyObj.code]();else if (!keyObj.isFnKey) {
      cursorPos += 1;
      _this.output.value = "".concat(left).concat(symbol || '').concat(right);
    }

    _this.output.setSelectionRange(cursorPos, cursorPos);
  });

  _defineProperty(this, "on", function (keyCode, cb) {
    if (_this.subscribers.has(keyCode)) {
      _this.subscribers.get(keyCode).push(cb);
    } else {
      _this.subscribers.set(keyCode, [cb]);
    }
  });

  this.rowsOrder = rowsOrder;
  this.keysPressed = {};
  this.isCaps = false;
  this.subscribers = new Map();
};

exports["default"] = Keyboard;