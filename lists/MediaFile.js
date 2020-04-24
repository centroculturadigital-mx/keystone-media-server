const { Text, File } = require('@keystonejs/fields');
const { LocalFileAdapter } = require('@keystonejs/file-adapters');

const fileAdapter = new LocalFileAdapter({
  src: process.env.NODE_ENV === 'production' ? './dist/archivos' : './archivos',
  path: '/archivos',
});


module.exports = {
  fields: {
    name: {
      type: Text,
    },
    file: {
      type: File,
      adapter: fileAdapter
    },
  }
};
