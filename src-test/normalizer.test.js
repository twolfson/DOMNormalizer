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
  'Bubbles a standard event properly': '',
  'Bubbles a non-standard event properly': ''
});

suite.exportTo('Mocha');
}());