(function () {
var suite = new Skeleton('DOMNormalizer'),
    sandbox = document.getElementById('TESTsandbox');

// Zero-th batch: Core basics
suite.addBatch({
  'DOMNormalizer': {
    topic: function () {
      return DOMNormalizer;
    },
    'can make a standard event (onclick)': function (DOMNormalizer) {
      var e = DOMNormalizer.makeEvent('click');
      assert(e);
    },
    'can make a non-standard event (onwave)': function (DOMNormalizer) {
      var e = DOMNormalizer.makeEvent('wave');
      assert(e);
    }
  }
});

// First batch: Basics
suite.addBatch({
  'A text input': {
    topic: function () {
      return document.getElementById('TESTinput');
    },
    'that has been DOMNormalized': {
      topic: function (input) {
        return new DOMNormalizer(input);
      },
      'can listen to a standard event (onchange)': function ($input) {
        $input.on('change', function () {});
        assert(true);
      },
      // 'and unsubscribe to it': {
        // 'without throwing errors': ''
      // }
      'can trigger a standard event (onclick)': function ($input) {
        $input.trigger('click', function () {});
        assert(true);
      },
      'can trigger all standard events': function ($input) {
        // Attribution to http://msdn.microsoft.com/en-us/library/ms533051.aspx
        var dhtmlEvts = ['abort', 'activate', 'afterprint', 'afterupdate', 'beforeactivate', 'beforecopy', 'beforecut', 'beforedeactivate', 'beforeeditfocus', 'beforepaste', 'beforeprint', 'beforeunload', 'beforeupdate', 'blur', 'bounce', 'canplay', 'canplaythrough', 'cellchange', 'change', 'click', 'contextmenu', 'controlselect', 'copy', 'cut', 'dataavailable', 'datasetchanged', 'datasetcomplete', 'dblclick', 'deactivate', 'drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'dragstart', 'drop', 'durationchange', 'emptied', 'ended', /*'error',*/ 'errorupdate', 'filterchange', 'finish', 'focus', 'focusin', 'focusout', 'hashchange', 'help', 'input', 'keydown', 'keypress', 'keyup', 'layoutcomplete', 'load', 'loadeddata', 'loadedmetadata', 'loadstart', 'losecapture', 'message', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'mousewheel', 'move', 'moveend', 'movestart', 'mssitemodejumplistitemremoved', 'msthumbnailclick', 'offline', 'online', 'page', 'paste', 'pause', 'play', 'playing', 'progress', 'progress', 'propertychange', 'ratechange', 'readystatechange', 'readystatechange', 'reset', 'resize', 'resizeend', 'resizestart', 'rowenter', 'rowexit', 'rowsdelete', 'rowsinserted', 'scroll', 'seeked', 'seeking', 'select', 'selectionchange', 'selectstart', 'stalled', 'start', 'stop', 'storage', 'storagecommit', 'submit', 'suspend', 'timeout', 'timeupdate', 'unload', 'volumechange', 'waiting'],
          stdEvts = ['abort', 'activate', 'afterupdate', 'beforeactivate', 'beforecopy', 'beforecut', 'beforedeactivate', 'beforeeditfocus', 'beforepaste', 'beforeupdate', 'blur', 'cellchange', 'change', 'click', 'contextmenu', 'controlselect', 'copy', 'cut', 'dataavailable', 'datasetchanged', 'datasetcomplete', 'dblclick', 'deactivate', 'drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'dragstart', 'drop', 'errorupdate', 'filterchange', 'focus', 'focusin', 'focusout', 'help', 'keydown', 'keypress', 'keyup', 'layoutcomplete', 'load', 'losecapture', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'mousewheel', 'move', 'moveend', 'movestart', 'page', 'paste', 'propertychange', 'readystatechange', 'readystatechange', 'resize', 'resizeend', 'resizestart', 'rowenter', 'rowexit', 'rowsdelete', 'rowsinserted', 'scroll', 'select', 'selectstart'],
          i = 0,
          len = stdEvts.length,
          goodEvts = [];
        for (; i < len; i++) {
          try {
            $input.trigger(stdEvts[i], function () {});
            goodEvts.push(stdEvts[i]);
          } catch (e) {
            // alert(stdEvts[i]);
          }
        }

        len = goodEvts.length;
        if (len > 0) {
          var outStr = "['" + goodEvts.join("', '") + "']";
          document.write(outStr);
        }
        assert(true);
      },
      'can listen to a non-standard event (onwiggle)': function ($input) {
        $input.on('wiggle', function () {});
        assert(true);
      },
      // 'and unsubscribe to it': {
        // 'without throwing errors': ''
      // }
      'can trigger a non-standard event (onwobble)': function ($input) {
        $input.trigger('wiggle', function () {});
        assert(true);
      }
    }
  }
});

// Second batch: Intermediate
suite.addBatch({
  'A text input': {
    'that has been DOMNormalized': {
      'that is listening for a standard event (onclick)': {
        'and one occurs': {
          'then the listener is triggered': ''
        }
      },
      'that is listening for a non-standard event (onswizzle)': {
        'and one occurs': {
          'then the listener is triggered': ''
        }
      }
    }
  }
});

// Third batch: Advanced
suite.addBatch({
});

suite.exportTo('Mocha');
}());