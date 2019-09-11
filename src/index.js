import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

export const IntercomAPI = (...args) => {
  if (canUseDOM && window.Intercom) {
    window.Intercom.apply(null, args);
  } else {
    console.warn('Intercom not initialized yet');
  }
};

const Intercom = React.memo(props => {
  const { appID, ...otherProps } = props;

  if (!canUseDOM) return null;

  useEffect(() => {
    const initializeIntercom = () => {
      if (!appID || !canUseDOM) {
        return;
      }

      if (!window.Intercom) {
        (function(w, d, id, s) {
          function i() {
            i.c(arguments);
          }
          i.q = [];
          i.c = function(args) {
            i.q.push(args);
          };
          w.Intercom = i;
          s = d.createElement('script');
          s.async = 1;
          s.src = 'https://widget.intercom.io/widget/' + id;
          d.head.appendChild(s);
        })(window, document, appID);
      }

      window.intercomSettings = { ...otherProps, app_id: appID };

      if (window.Intercom) {
        window.Intercom('boot', otherProps);
      }
    };
    // initialized on mount, as shown by empty array in second param
    initializeIntercom();

    // execute on what used to be componentWillUnmount()
    return () => {
      if (!canUseDOM || !window.Intercom) return false;

      window.Intercom('shutdown');

      delete window.Intercom;
      delete window.intercomSettings;
    };
  }, []);

  useEffect(() => {
    const clearIntercom = () => {
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
  appID: PropTypes.string.isRequired,
};

export default Intercom;
