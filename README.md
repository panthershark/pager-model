pager-model
===========

Generates a pagination model for binding into templates

# Usage

Pass the params from your results to generate a view model that is ready to bind to your templates.

### Arguments
* **start**: Index of the first item
* **total**: Total number of results
* **size**: page size
* **range**: number of pages to generate (for links between prev & next)
* **url**: function for generating a url from the pagenumber.
* **vm**: function for generating a view model for injecting other about the page.

### Example

```javascript

var pager = require('pager-model');

var model = pager.pagination({
  start: 52,
  total: 95,
  size: 10,
  range: 4,

  // allows DI for url generation
  url: function(page_number, page_size) {
    return '/items/' + page_number + '?limit=' + page_size;
  },

  // helpful for generating models to plug into your existing templates.
  vm: function(page_number, page_size) {
    return {
      type: 'item',
      num: page_number,
      size: page_size
    }
  }
});

console.log(JSON.stringify(model));

```

### Output

```javascript
{
  "current_page": 6,
  "next": {
    "selected": false,
    "url": "/items/7?limit=10",
    "vm": {
      "num": 7,
      "size": 10,
      "type": "item"
    }
  },
  "page_count": 10,
  "page_size": 10,
  "pages": [
    {
      "selected": false,
      "url": "/items/4?limit=10",
      "vm": {
        "num": 4,
        "size": 10,
        "type": "item"
      }
    },
    {
      "selected": false,
      "url": "/items/5?limit=10",
      "vm": {
        "num": 5,
        "size": 10,
        "type": "item"
      }
    },
    {
      "selected": true,
      "url": "/items/6?limit=10",
      "vm": {
        "num": 6,
        "size": 10,
        "type": "item"
      }
    },
    {
      "selected": false,
      "url": "/items/7?limit=10",
      "vm": {
        "num": 7,
        "size": 10,
        "type": "item"
      }
    },
    {
      "selected": false,
      "url": "/items/8?limit=10",
      "vm": {
        "num": 8,
        "size": 10,
        "type": "item"
      }
    }
  ],
  "previous": {
    "selected": false,
    "url": "/items/5?limit=10",
    "vm": {
      "num": 5,
      "size": 10,
      "type": "item"
    }
  },
  "total": 95
}
```