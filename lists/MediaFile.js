const { Text, Relationship } = require('@keystonejs/fields');

const s3FileAdapter = require('../adapters/s3FileAdapter')
const localFileAdapter = require('../adapters/localFileAdapter')
const PathFile = require('../fields/PathFile');

const { IS_REMOTE_MEDIA_SERVER } = process.env

const fileAdapter = IS_REMOTE_MEDIA_SERVER == 1 ? s3FileAdapter : localFileAdapter

const { atTracking } = require('@keystonejs/list-plugins');

const MediaFile = {
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
  ],
  cacheHint: {
    scope: 'PUBLIC',
    maxAge: 0,
  },
}

module.exports = MediaFile