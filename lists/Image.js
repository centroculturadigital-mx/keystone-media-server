const { File, Relationship, Text } = require('@keystonejs/fields');
const { LocalFileAdapter } = require('@keystonejs/file-adapters');

const IMGPROXY_KEY = process.env.IMGPROXY_KEY
const IMGPROXY_SALT = process.env.IMGPROXY_SALT

const fileAdapter = new LocalFileAdapter({
  src: process.env.NODE_ENV === 'production' ? './dist/archivos' : './archivos',
  path: '/archivos',
});

module.exports = {
  fields: {
    name: { type: Text },
    original: {
      type: File,
      adapter: fileAdapter
    },
    sizes: {
      type: Relationship,
      ref: 'ImageSize',
      many: true
    },
    resizedImages: {
      type: Relationship,
      ref: 'MediaFile',
      many: true
    },
    credits: { type: Text },
    caption: { type: Text },
    owner: { type: Text },
  },
  labelResolver: item => {
    if( !! item && !! item.original ) {

      const { DOMAIN, PORT, IMGPROXY_HOST, IMGPROXY_PORT, MEDIA_FOLDER } = process.env
      let url = `${DOMAIN}:${PORT}/${MEDIA_FOLDER}/${item.original.filename}`
      
      return url
   
    
    }

    return item.name

    


  }

};
