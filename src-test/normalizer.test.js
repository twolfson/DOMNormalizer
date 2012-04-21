(function () {
var suite = new Skeleton('DOMNormalizer'),
    sandbox = document.getElementById('TESTsandbox');

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
      'can listen to a standard event (onchange) without throwing errors': function ($input) {
        $input.on('change', function () {});
        assert(true);
      },
      // 'and unsubscribe to it': {
        // 'without throwing errors': ''
      // }
      'can trigger a standard event (onclick) without throwing errors': function ($input) {
        $input.trigger('change', function () {});
        assert(true);
      },
      'can listen to a non-standard event (onwiggle) without throwing errors': function ($input) {
        $input.on('wiggle', function () {});
        assert(true);
      },
      // 'and unsubscribe to it': {
        // 'without throwing errors': ''
      // }
      'can trigger a non-standard event (onwobble) without throwing errors': function ($input) {
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