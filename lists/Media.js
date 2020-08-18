const { Text, Relationship } = require('@keystonejs/fields');
const { LocalFileAdapter } = require('@keystonejs/file-adapters');

const PathFile = require('../fields/PathFile');

const fileAdapter = new LocalFileAdapter({
  src: process.env.NODE_ENV === 'production' ? './dist/archivos' : './archivos',
  path: '/archivos',
});

const { atTracking } = require('@keystonejs/list-plugins');

const Media = {
  fields: {
    name: {
      type: Text,
      isRequired: true
    },
    file: {
        type: PathFile,
        adapter: fileAdapter,
        label: "File to download",
        isRequired: true,
    },
    author: {
      type: Relationship,
      ref: 'Usuario',
      label: "Author",
    },
    
  
  },
  labelField: 'name',
  adminConfig: {
    defaultColumns: 'name, file, author',
  },
  plugins: [
    atTracking({
      createdAtField: 'createdAt',
      updatedAtField: 'updatedAt'
    }),
  ]
}

module.exports = Media