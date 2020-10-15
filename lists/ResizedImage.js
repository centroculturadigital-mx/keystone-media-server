const { Text, Relationship } = require('@keystonejs/fields');

const PathFile = require('../fields/PathFile')
const ImageRelationship = require('../fields/ImageRelationship')
const s3FileAdapter = require('../adapters/s3FileAdapter')
const localFileAdapter = require('../adapters/localFileAdapter')

module.exports = {
  fields: {
    name: {
      type: Text,
    },
    fileLocal: {
      type: PathFile,
      adapter: localFileAdapter,
    },
    fileRemote: {
      type: PathFile,
      adapter: s3FileAdapter,
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
    defaultColumns: 'size,fileLocal, fileRemote'
  },
  labelField: "name"
};
