'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var _accessory = require('./accessory');

var HomeWizardSwitch = (function (_HomeWizardBaseAccessory) {
  _inherits(HomeWizardSwitch, _HomeWizardBaseAccessory);

  function HomeWizardSwitch() {
    _classCallCheck(this, HomeWizardSwitch);

    _get(Object.getPrototypeOf(HomeWizardSwitch.prototype), 'constructor', this).apply(this, arguments);

    this.model = 'Switch';
  }

  _createClass(HomeWizardSwitch, [{
    key: 'setupServices',
    value: function setupServices() {
      // Setup services
      var lightbulbService = new this.hap.Service.Lightbulb();
      lightbulbService.getCharacteristic(this.hap.Characteristic.On).on('set', this.setPowerState.bind(this));
      this.services.push(lightbulbService);
    }
  }, {
    key: 'getPowerState',
    value: function getPowerState(callback) {
      var _this = this;

      // Sadly there is no individual call to get a sensor status
      // so retrieve all and find this one
      this.api.request('swlist').then(function (data) {
        var state = undefined;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = data.reponse[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var sw = _step.value;

            if (sw.id === _this.id) {
              state = sw.state === 'on' ? 1 : 0;
              break;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
              _iterator['return']();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        callback(null, state);
      })['catch'](function (error) {
        callback(error, 0);
      });
    }
  }, {
    key: 'setPowerState',
    value: function setPowerState(state, callback) {
      var _this2 = this;

      var value = state ? 'on' : 'off';
      var url = 'sw/' + this.id + '/' + value;

      this.api.request({ url: url }).then(function () {
        _this2.log('Switched ' + _this2.name + ' to: ' + value);
        callback();
      })['catch'](function (error) {
        callback(error);
      });
    }
  }]);

  return HomeWizardSwitch;
})(_accessory.HomeWizardBaseAccessory);

exports.HomeWizardSwitch = HomeWizardSwitch;
