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
  labelResolver: item => {
    if( !! item && !! item.original ) {

      console.log(item.original)

      const { 
        DOMAIN,
        IS_REMOTE_MEDIA_SERVER,
        LOCAL_MEDIA_SERVER_FOLDER,
        REMOTE_MEDIA_SERVER_URL,
        S3_FOLDER
      } = process.env

      let url = IS_REMOTE_MEDIA_SERVER == 1 
        ? `${REMOTE_MEDIA_SERVER_URL}/${S3_FOLDER}`
        : `${DOMAIN}/${LOCAL_MEDIA_SERVER_FOLDER}`

      url += `/${item.original.filename}`

      console.log('url', url)
      return url
   
    
    }

    return item.name

  }
};
