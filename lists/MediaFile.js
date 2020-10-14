const { Text, Relationship } = require('@keystonejs/fields');

const s3FileAdapter = require('../adapters/s3FileAdapter')
const localFileAdapter = require('../adapters/localFileAdapter')
const PathFile = require('../fields/PathFile');

const { atTracking } = require('@keystonejs/list-plugins');

const MediaFile = {
  fields: {
    name: {
      type: Text,
      isRequired: true
    },
    fileLocal: {
      type: PathFile,
      adapter: localFileAdapter,
    },
    fileRemote: {
      type: PathFile,
      adapter: s3FileAdapter,
    },
    // author: {
    //   type: Relationship,
    //   ref: 'Usuario',
    //   label: "Author",
    // },
    project: {
      type: Relationship,
      ref: 'Project.mediaFiles',
    },
    folder: {
      type: Relationship,
      ref: 'Folder.mediaFiles',
    },
    tags: {
      type: Relationship,
      ref: 'Tag.mediaFiles',
      many: true
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

module.exports = MediaFile