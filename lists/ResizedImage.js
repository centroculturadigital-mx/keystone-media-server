const { Text, Relationship } = require('@keystonejs/fields');

const PathFile = require('../fields/PathFile')
const ImageRelationship = require('../fields/ImageRelationship')
const s3FileAdapter = require('../adapters/s3FileAdapter')
const localFileAdapter = require('../adapters/localFileAdapter')

const { IS_REMOTE_MEDIA_SERVER } = process.env

const fileAdapter = IS_REMOTE_MEDIA_SERVER == 1 ? s3FileAdapter : localFileAdapter

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
      ref: "Image.resizedImages"  
    },
  },
  adminConfig: {
    defaultColumns: 'size,file'
  },
  labelField: "name"
};
