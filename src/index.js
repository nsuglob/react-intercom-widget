import { Component } from 'react';
import PropTypes from 'prop-types';

const canUseDOM = window && window.document && window.document.createElement ? true : false;

export const IntercomAPI = (...args) => {
  if (canUseDOM && window.Intercom) {
    window.Intercom.apply(null, args);
  } else {
    console.error('Intercom is not initialized yet');
  }
};

export default class Intercom extends Component {
  constructor(props) {
    super(props);

    const { appID, ...rest } = props;

    if (!appID || !canUseDOM) {
      return;
    }

    if (!window.Intercom) {
      (function(widget, documentBody, id, script) {
        function i() {
          i.c(arguments);
        }
        i.q = [];
        i.c = function(args) {
          i.q.push(args);
        };
        widget.Intercom = i;
        script = documentBody.createElement('script');
        script.async = 1;
        script.src = 'https://widget.intercom.io/widget/' + id;
        documentBody.head.appendChild(script);
      })(window, document, appID);
    }

    window.intercomSettings = { app_id: appID, ...rest };

    if (window.Intercom) {
      window.Intercom('boot', rest);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { appID, ...rest } = nextProps;

    if (!canUseDOM) {
      return;
    }

    window.intercomSettings = { app_id: appID, ...rest };

    if (window.Intercom) {
      if (this.loggedIn(this.props) && !this.loggedIn(nextProps)) {
        // Shutdown and boot each time the user logs out to clear conversations
        window.Intercom('shutdown');
        window.Intercom('boot', rest);
      } else {
        window.Intercom('update', rest);
      }
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    if (!canUseDOM || !window.Intercom) return false;

    window.Intercom('shutdown');

    delete window.Intercom;
    delete window.intercomSettings;
  }

  loggedIn(props) {
    return props.email || props.user_id;
  }

  render() {
    return false;
  }
}

Intercom.propTypes = {
  appID: PropTypes.string.isRequired,
  userID: PropTypes.string,
  name: PropTypes.string,
  email: PropTypes.string,
};
