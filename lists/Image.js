const { Text, Relationship } = require('@keystonejs/fields');

const s3FileAdapter = require('../adapters/s3FileAdapter')
const localFileAdapter = require('../adapters/localFileAdapter')
const PathFile = require('../fields/PathFile');

const { IS_REMOTE_MEDIA_SERVER } = process.env

const fileAdapter = IS_REMOTE_MEDIA_SERVER == 1 ? s3FileAdapter : localFileAdapter

module.exports = {
  fields: {
    name: { type: Text },
    original: {
      type: PathFile,
      adapter: fileAdapter,
      isRequired: true
    },
    sizes: {
      type: Relationship,
      ref: 'ImageSize',
      many: true
    },
    resizedImages: {
      type: Relationship,
      ref: 'ResizedImage',
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
