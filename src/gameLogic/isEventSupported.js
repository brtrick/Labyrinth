// Code modified slightly from kangax at http://perfectionkills.com/detecting-event-support-without-browser-sniffing/

const isEventSupported = (() => {
    const TAGNAMES = {
      'select':'input','change':'input',
      'submit':'form','reset':'form',
      'error':'img','load':'img','abort':'img'
    }
    function isEventSupported(eventName) {
      const el = document.createElement(TAGNAMES[eventName] || 'div');
      const isSupported = (eventName in el);
      if (!isSupported) {
        el.setAttribute(eventName, 'return;');
        isSupported = typeof el[eventName] == 'function';
      }
      el = null;
      return isSupported;
    }
    return isEventSupported;
  })();
  
  export default isEventSupported;
