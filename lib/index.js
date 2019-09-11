'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IntercomAPI = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

var IntercomAPI = exports.IntercomAPI = function IntercomAPI() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (canUseDOM && window.Intercom) {
    window.Intercom.apply(null, args);
  } else {
    console.warn('Intercom not initialized yet');
  }
};

var Intercom = _react2.default.memo(function (props) {
  var appID = props.appID,
      otherProps = _objectWithoutProperties(props, ['appID']);

  if (!canUseDOM) return null;

  (0, _react.useEffect)(function () {
    var initializeIntercom = function initializeIntercom() {
      if (!appID || !canUseDOM) {
        return;
      }

      if (!window.Intercom) {
        (function (w, d, id, s) {
          function i() {
            i.c(arguments);
          }
          i.q = [];
          i.c = function (args) {
            i.q.push(args);
          };
          w.Intercom = i;
          s = d.createElement('script');
          s.async = 1;
          s.src = 'https://widget.intercom.io/widget/' + id;
          d.head.appendChild(s);
        })(window, document, appID);
      }

      window.intercomSettings = _extends({}, otherProps, { app_id: appID });

      if (window.Intercom) {
        window.Intercom('boot', otherProps);
      }
    };
    // initialized on mount, as shown by empty array in second param
    initializeIntercom();

    // execute on what used to be componentWillUnmount()
    return function () {
      if (!canUseDOM || !window.Intercom) return false;

      window.Intercom('shutdown');

      delete window.Intercom;
      delete window.intercomSettings;
    };
  }, []);

  (0, _react.useEffect)(function () {
    var clearIntercom = function clearIntercom() {
      if (window.Intercom) {
        // Shutdown and boot each time the user logs out to clear conversations
        window.Intercom('shutdown');
        window.Intercom('boot', otherProps);
      } else {
        window.Intercom('update', otherProps);
      }
    };
    // executed when props.email or props.user_id change
    clearIntercom();
  }, [props.email, props.user_id]);

  return false;
});

Intercom.propTypes = {
  appID: _propTypes2.default.string.isRequired
};

exports.default = Intercom;