const { Text, Relationship } = require('@keystonejs/fields');

const s3FileAdapter = require('../adapters/s3FileAdapter')
const localFileAdapter = require('../adapters/localFileAdapter')
const PathFile = require('../fields/PathFile');

module.exports = {
  fields: {
    name: { type: Text },
    fileLocal: {
      type: PathFile,
      adapter: localFileAdapter,
    },
    fileRemote: {
      type: PathFile,
      adapter: s3FileAdapter,
    },
    sizes: {
      type: Relationship,
      ref: 'ImageSize',
      many: true
    },
    resizedImages: {
      type: Relationship,
      ref: 'ResizedImage.image',
      many: true
    },
    project: {
      type: Relationship,
      ref: 'Project.images',
    },
    folder: {
      type: Relationship,
      ref: 'Folder.images',
    },
    tags: {
      type: Relationship,
      ref: 'Tag.images',
      many: true
    },
    credits: { type: Text },
    caption: { type: Text },
    owner: { type: Text },
  },
  adminConfig: {
    defaultColumns: 'size,fileLocal, fileRemote'
  },
  labelField: "name",
  labelResolver: item => {
    let file = item.fileRemote || item.fileLocal
    if( file ) {

      const { 
        DOMAIN,
        LOCAL_MEDIA_SERVER_FOLDER,
        REMOTE_MEDIA_SERVER_URL,
        S3_FOLDER,
        S3_BUCKET,
      } = process.env

      let url = !! item.fileRemote
        ? `${REMOTE_MEDIA_SERVER_URL}/${S3_BUCKET}/${S3_FOLDER}`
        : `${DOMAIN}/${LOCAL_MEDIA_SERVER_FOLDER}`

      url += `/${file.filename}`

      return url
   
    
    }

    return item.name

  }
};
