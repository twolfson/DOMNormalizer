(function () {
var suite = new Skeleton('DOMNormalizer'),
    sandbox = document.getElementById('TESTsandbox');

// First batch: Basics
suite.addBatch({
  'A text input': {
    topic: function () {
    },
    'that has been DOMNormalized': {
      'can listen to a standard event (onchange)': {
        'without throwing errors': '',
        'and unsubscribe to it': {
          'without throwing errors': ''
        }
      },
      'can trigger a standard event (onchange)': {
        'without throwing errors': ''
      },
      'can listen to a non-standard event (onwiggle)': {
        'without throwing errors': '',
        'and unsubscribe to it': {
          'without throwing errors': ''
        }
      },
      'can trigger a non-standard event (onwiggle)': {
        'without throwing errors': ''
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