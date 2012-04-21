(function () {
function strictEquals(a, b) {
  return a === b;
}
function indexOf(arr, item, comparator) {
  comparator = comparator || strictEquals;
  var index = -1,
      i = 0,
      len = arr.length,
      arrItem;

  for (; i < len; i++) {
    if (comparator(item, arr[i])) {
      index = i;
      break;
    }
  }

  return index;
}

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
  var stdEvts = DOMNormalizer.stdEvts,
      isStd = !!~indexOf(stdEvts, evt);

  return isStd;
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
   
  function compareEvtObj(a, b) {
    return (a.name === b.name && a.fn === b.fn);
  }

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
      if (DOMNormalizer.isStdEvt(evtName)) {
        this.elt.attachEvent('on' + evtName, fn);
      } else {
        var evts = this.elt._events;
        if (evts === undefined) {
          evts = [];
          this.elt._events = evts;
        }
        evts.push({'name': evtName, 'fn': fn});
      }
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
      if (DOMNormalizer.isStdEvt(evtName)) {
        this.elt.detachEvent('on' + evtName, fn);
      } else {
        var evts = this.elt._events || [],
            index = indexOf(evts, fn, compareEvtObj);
        if (!!~index) {
          evts.splice(index, 1);
        }
      }
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
      var elt = this.elt,
          event = DOMNormalizer.makeEvent();

      // If the event is standard, dispatch it normally
      if (DOMNormalizer.isStdEvt(evtName)) {
        elt.fireEvent('on' + evtName, event);
      } else {
      // Otherwise, go to the event emitter
        var evts = elt._events || [],
            i = 0,
            len = evts.length,
            evt;
        for (; i < len; i++) {
          evt = evts[i];
          if (evt.name === evtName) {
            evt.fn.call(elt, event);
          }
        }
        // TODO: Also trigger property events
        // TODO: Also bubble event
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