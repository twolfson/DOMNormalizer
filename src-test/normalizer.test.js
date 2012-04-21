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
        $input.trigger('wobble', function () {});
        assert(true);
      }
    }
  }
});

// Second batch: Intermediate
suite.addBatch({
  'A text input': {
    topic: function () {
      return document.getElementById('TESTinput');
    },
    'that has been DOMNormalized': {
      topic: function (input) {
        return new DOMNormalizer(input);
      },
      'that is listening for a standard event (onclick)': {
        topic: function ($input) {
          $input.on('change', function () {
            window.testStandard = true;
          });
          return $input;
        },
        'and one occurs': {
          topic: function ($input) {
            $input.trigger('change');
            return $input;
          },
          'then the listener is triggered': function () {
            assert(window.testStandard);
          }
        }
      },
      'that is listening for a non-standard event (onswizzle)': {
        topic: function ($input) {
          $input.on('swizzle', function () {
            window.testNonStandard = true;
          });
          return $input;
        },
        'and one occurs': {
          topic: function ($input) {
            $input.trigger('swizzle');
            return $input;
          },
          'then the listener is triggered': function () {
            assert(window.testNonStandard);
          }
        }
      }
    }
  }
});

// Third batch: Advanced
suite.addBatch({
  'Bubbles a standard event properly': '',
  'Bubbles a non-standard event properly': 'TODO'
});

suite.exportTo('Mocha');
}());