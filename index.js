var _ = require('lodash');

// @param start {Number}: Index of first result
// @param total {Number}: Number of result
// @param range {Number}: Number of pages to show total.  current_page will always be in the center.  ex: if start = 51, size = 10, range=9, current_page = 5, there are 4 pages before & 4 after in the pages array
// @param size {Number}: page size
// @param url {Function}: hook to DI url generation
// @param vm {Function}: hook to DI viewmodel generation
var pagination = function(options) {
  options = _.defaults(options, {
    start: 1,
    total: 0,
    range: 1,
    size: 10,
    url: function(page_number, page_size) {
      return page_number ? 'no/path/defined/' + page_number + '/' + page_size : null;
    },
    vm: function(page_number, page_size) {
      return page_number ? {
        page_number: page_number,
        page_size: page_size
      } : null;
    }
  });

  var pagination = {
    total: options.total,
    current_page: Math.ceil(options.start / options.size),
    page_size: options.size,
    page_count: (options.total / options.size < 1) ? 1 : Math.ceil(options.total / options.size),
    pages: []
  };

  var pageModel = function(page_number) {
    return {
      url: options.url(page_number, options.size),
      vm: options.vm(page_number, options.size),
      selected: pagination.current_page === page_number
    };
  };

  pagination.previous = pageModel((pagination.current_page - 1 >= 1) ? pagination.current_page - 1 : null);
  pagination.next = pageModel((pagination.current_page + 1 <= pagination.page_count) ? pagination.current_page + 1 : null);

  // 1 is simple case
  if (options.range == 1) {
    pagination.pages.push(pageModel(pagination.current_page));

  }

  // 2 is special case
  else if (options.range == 2) {
    pagination.pages.push(pageModel(pagination.current_page));

    if (pagination.page_count >= (pagination.current_page + 1)) {
      pagination.pages.push(pageModel(pagination.current_page + 1));

    } else if (pagination.current_page > 1) {
      pagination.pages.push(pageModel(pagination.current_page - 1));
    }

  }

  // 3+ is common math case.
  else if (options.range > 0) {
    var f = pagination.current_page - (options.range / 2);
    f = (f <= 0 ? 1 : f); // bound check

    var l = pagination.current_page + (options.range / 2);
    l = (l > pagination.page_count ? pagination.page_count : l); // bound check

    for (var i = f; i <= l; i++) {
      pagination.pages.push(pageModel(i));
    }
  }

  return pagination;
};



// Plugin for mixdown exposing the interfaces.
var PaginationPlugin = function(namespace) {

  if (!this instanceof PaginationPlugin) {
    throw new Error('Please instantiate using keyword "new."  Broadway expects this.');
  }

  namespace = namespace || 'pagination';

  this.attach = function(options) {
    options = options || {};

    this[namespace] = function(opt) {
      opt = _.defaults(_.clone(opt || {}), _.pick(options, 'vm', 'url', 'size', 'range'));
      return pagination(opt);
    };
  };

};

// Export the library functions and the plugin functions.  
module.exports = {
  PaginationPlugin: PaginationPlugin,
  pagination: pagination
};