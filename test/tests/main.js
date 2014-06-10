var assert = require('assert');
var pager = require('../../index.js');

suite('Pagination', function() {

  test('Simple', function(done) {


    // @param start {Number}: Index of first result
    // @param total {Number}: Number of result
    // @param range {Number}: Number of pages to show total.  current_page will always be in the center.  ex: if start = 51, size = 10, range=9, current_page = 5, there are 4 pages before & 4 after in the pages array
    // @param size {Number}: page size
    // @param url {Function}: hook to DI url generation
    // @param vm {Function}: hook to DI viewmodel generation
    var model = pager.pagination({
      start: 52,
      total: 95,
      size: 10,
      range: 4,

      // alows DI for url generation
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

    assert.ok(model.total, 'Total exists');
    assert.ok(model.current_page, 'Current page exists');
    assert.ok(model.page_count, 'Page count exists');
    assert.ok(model.page_size, 'Page size exists');
    assert.ok(model.previous, 'Previous exists');
    assert.ok(model.next, 'Next exists');
    assert.ok(Array.isArray(model.pages), 'Pages exists');

    done();

  });
});