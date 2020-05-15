'use strict';

const pagination = require('hexo-pagination');

hexo.extend.generator.register('home-page', function (locals) {

  const posts = locals.posts
	.filter(post => post.home)
	.sort('-date');
  const paginationDir = 'page';

  return pagination('/', posts, {
    perPage: 10,
    layout: ['index', 'archive'],
    format: paginationDir + '/%d/',
    data: {
      __index: true
    }
  });

});
