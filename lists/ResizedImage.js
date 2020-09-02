const { Text, File, Relationship } = require('@keystonejs/fields');
const { LocalFileAdapter } = require('@keystonejs/file-adapters');
const PathFile = require('../fields/PathFile')
const ImageRelationship = require('../fields/ImageRelationship')

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
      type: PathFile,
      adapter: fileAdapter,
      label: "Imagen transformada",
      isRequired: true,
    },
    size: {
      type: Relationship,
      ref: "ImageSize"
    },
    image: {
      type: ImageRelationship,
      ref: "Image"  
    }
  },
  adminConfig: {
    defaultColumns: 'size,file'
  },
  labelField: "name"
};
