const { Text, Relationship } = require('@keystonejs/fields');

const s3FileAdapter = require('../adapters/s3FileAdapter')
const localFileAdapter = require('../adapters/localFileAdapter')
const PathFile = require('../fields/PathFile');

const { IS_REMOTE_MEDIA_SERVER } = process.env

const fileAdapter = IS_REMOTE_MEDIA_SERVER == 1 ? s3FileAdapter : localFileAdapter

module.exports = {
  fields: {
    name: { type: Text },
    images: {
      type: Relationship,
      ref: 'Image.tags',
      many: true
    },
    mediaFiles: {
      type: Relationship,
      ref: 'MediaFile.tags',
      many: true
    },
  },
};
