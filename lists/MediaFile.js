const { Text, File, Relationship } = require('@keystonejs/fields');
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
    size: {
      type: Relationship,
      ref: "ImageSize"
    }
  },
  adminConfig: {
    defaultColumns: 'size,file'
  },
  labelField: "name"
};
