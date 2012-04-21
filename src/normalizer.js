(function () {
/**
 * DOM normalizer for event bindings
 * @param {HTMLElement} elt Element to normalize for
 * @returns {Object<DOMNormalizer>} DOMNormalizer object with elt as the element to normalize for
 */
function DOMNormalizer(elt) {
  this.elt = elt;
}

/**
 * Static method for making events
 * @param {Object} options Options to specify with respect to the event
 * @param {String} [options.eventType='HTMLEvents'] Type of event to create
 */
DOMNormalizer.makeEvent = (function () {
  var createFn = function () { return {}; };

  if (document.createEvent) {
    createFn = function (evtType) {
      return document.createEvent(evtType);
    };
  } else if (document.createEventObject) {
    // Before, we would do a .call on document.createEventObject however IE6 threw a hissy fit
    createFn = function (evtType) {
      return document.createEventObject(evtType);
    };
  }

  return function (options) {
    // Fallback options
    options = options || {};

    // Grab the event type and create the event
    var eventType = options.eventType || 'HTMLEvents',
        event = createFn(eventType);

    // Return the created event
    return event;
  };
}());

/**
 * Static list of events supported by IE6/7
 */
DOMNormalizer.stdEvts = ['activate', 'afterupdate', 'beforeactivate', 'beforecopy', 'beforecut', 'beforedeactivate', 'beforeeditfocus', 'beforepaste', 'beforeupdate', 'blur', 'cellchange', 'click', 'contextmenu', 'controlselect', 'copy', 'cut', 'dataavailable', 'datasetchanged', 'datasetcomplete', 'dblclick', 'deactivate', 'drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'dragstart', 'drop', 'errorupdate', 'filterchange', 'focus', 'focusin', 'focusout', 'help', 'keydown', 'keypress', 'keyup', 'layoutcomplete', 'losecapture', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'mousewheel', 'move', 'moveend', 'movestart', 'page', 'paste', 'propertychange', 'readystatechange', 'readystatechange', 'resize', 'resizeend', 'resizestart', 'rowenter', 'rowexit', 'rowsdelete', 'rowsinserted', 'scroll', 'selectstart'];

/**
 * Static method to determine if an event is standard or not
 * @param {String} evt Name of the event to check on
 * @returns {Boolean} True if the event is standard, false otherwise
 */
DOMNormalizer.isStdEvt = function (evt) {
  var isStd = false,
      stdEvts = DOMNormalizer.stdEvts,
      i = 0,
      len = stdEvts.length;

  for (; i < len; i++) {
    if (evt === stdEvts[i]) {
      isStd = true;
      break;
    }
  }

  return isStd;
};

/**
 * Event emitter for DOMNormalizer
 */
DOMNormalizer.EventEmitter = {
  'channels': {},
  'on': function (channelName, fn) {
    var channels = this.channels,
        channel = channels[channelName];
    if (channel === undefined) {
      channel = [];
      channels[channelName] = channel;
    }
    channel.push(fn);
  },
  'off': function (channelName, fn) {
    var channels = this.channels,
        channel = channels[channelName] || [],
        i = channel.length;
    while (i--) {
      if (channel[i] === fn) {
        channel.splice(i, 1);
      }
    }
  },
  'trigger': function (channelName) {
    var channels = this.channels,
        channel = channels[channelName] || [],
        i = 0,
        len = channel.length,
        args = [].slice.call(arguments, 1),
        o = {};
    for (; i < len; i++) {
      channel[i].apply(o, args);
    }
  }
};

DOMNormalizer.prototype = (function () {
  // Determine what are the available event listener's
  var div = document.createElement('div'),
      onHandler = function (evtName, fn) {
        this.elt['on' + evtName] = fn;
      },
      offHandler = function (evtName) {
        this.elt['on' + evtName] = null;
      },
      triggerHandler = function (evtName) {
        // Create and init an event to trigger
        // TODO: Robustify init for Mouse and UIEvents
        var event = DOMNormalizer.makeEvent();
        event.initEvent(evtName, true, true);

        // Fire the event on the element
        var elt = this.elt,
            method = elt['on' + evtName];

        // If there is a method, trigger the event on the object
        if (method) {
          method.call(elt, event);
        }
      };

  // If there is an addEventListener handler
  if (div.addEventListener) {
    // Override onHandler
    onHandler = function (evtName, fn) {
      this.elt.addEventListener(evtName, fn, false);
    };
  } else if (div.attachEvent) {
  // Otherwise, if there is an attachEvent handler
    // Override onHandler
    onHandler = function (evtName, fn) {
      this.elt.attachEvent('on' + evtName, fn);
    };
  }

  // If there is an removeEventListener handler
  if (div.removeEventListener) {
    // Override offHandler
    offHandler = function (evtName, fn) {
      this.elt.removeEventListener(evtName, fn, false);
    };
  } else if (div.detachEvent) {
  // Otherwise, if there is an detachEvent handler
    // Override offHandler
    offHandler = function (evtName, fn) {
      this.elt.detachEvent('on' + evtName, fn);
    };
  }

  // If there is an dispatchEvent handler
  if (div.dispatchEvent) {
    // Override triggerHandler
    triggerHandler = function (evtName) {
      var event = DOMNormalizer.makeEvent();
      event.initEvent(evtName, true, true);
      this.elt.dispatchEvent(event);
      // TODO: Check that property events are triggered
    };
  } else if (div.fireEvent) {
  // Otherwise, if there is an fireEvent handler
    // Override triggerHandler
    triggerHandler = function (evtName) {
      var event = DOMNormalizer.makeEvent();

      // If the event is standard, dispatch it normally
      if (DOMNormalizer.isStd(evtName)) {
        this.elt.fireEvent('on' + evtName, event);
      } else {
      // Otherwise, go to the event emitter
        DOMNormalizer.EventEmitter.emit(evtName, this.elt, event);
        // TODO: Also trigger property events
      }
    };
  }

  return {
    'on': onHandler,
    'off': offHandler,
    'trigger': triggerHandler
  };
}());

// Expose DOMNormalizer to the window scope
window.DOMNormalizer = DOMNormalizer;
}());