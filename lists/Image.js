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

      const { 
        LOCAL_MEDIA_SERVER_FOLDER,
        LOCAL_KEYSTONE_PORT,
        LOCAL_KEYSTONE_HOST
      } = process.env

      let domain = LOCAL_KEYSTONE_PORT 
        ? `${LOCAL_KEYSTONE_HOST}:${LOCAL_KEYSTONE_PORT}` 
        : LOCAL_KEYSTONE_HOST 

      let url = item.original.publicUrl.includes('http') 
       ? item.original.publicUrl
       : `http://${domain}/${LOCAL_MEDIA_SERVER_FOLDER}/${item.original.filename}`

      console.log('url', url)
      return url
   
    
    }

    return item.name

  }
};
