const { Readable } = require('stream');

const generateSignature = require("./functions/generateSignature")

function bufferToStream(buffer) {
  const newStream = new Readable();
  newStream.push(buffer);
  newStream.push(null);
  return newStream;
}

const onImageInput = async ({
  keystone,
  operation,
  existingItem,
  updatedItem,
  originalInput,
  resolvedData,
  context,
  actions,
}) => {

  if ( !! updatedItem.original ) {

    const sizeQuery = await keystone.executeQuery(
      `query {
        allImageSizes {
          id
          size
        }
      }`
    );

    const imageSizes = sizeQuery.data.allImageSizes
    
    if ( ! Array.isArray(updatedItem.sizes) || ! updatedItem.sizes.length ) {
      updatedItem.sizes = imageSizes.map(s => s.id)
    }
    
    for(s of updatedItem.sizes) {

      let imageSize = imageSizes.find(is => {
        return is.id === s.toString()
      } )

      let size = imageSize ?  imageSize.size : 320
      let imageSizeId = imageSize ? imageSize.id : null 

      const { HOST, PORT, IMGPROXY_HOST, IMGPROXY_PORT, MEDIA_FOLDER } = process.env
      

      let url = `http://${HOST}:${PORT}/${MEDIA_FOLDER}/${updatedItem.original.filename}`

      console.log('url', url)

      const signature = generateSignature({
        url,
        resizing_type: 'fit',
        width: size,
        height: size,
        gravity: 'ce', //center
        enlarge: 1,
        extension: 'png',
      });

      let image = await fetch(`http://${IMGPROXY_HOST}:${IMGPROXY_PORT}/${signature}`)
        
      let filename = updatedItem.original.filename
      let name = updatedItem.name || updatedItem.original.filename
      let fileExt = filename.split('.').reverse()[0]
      
      filename = filename.split('-')[1].split('.'+fileExt)[0] + '-' + size + '.' +  fileExt


      const encoding = "7bit"
      const buffer = await image.buffer()
      const mimetype = fileExt == 'png' ? 'image/png' : 'image/jpeg'

      const file = { createReadStream: () => bufferToStream(buffer), filename, mimetype, encoding }

      const response = await keystone.executeQuery(
        `mutation generateMediaFile(
          $name: String, 
          $file: Upload,
          $size: ID!
        ) {
          createMediaFile (
            data: {
              name: $name,
              file: $file,
              size: {
                connect: {
                  id: $size
                }
              }
            }
          ) {
            id
          }
        }`,
        {
          variables: {
            name,
            file,
            size: imageSizeId
          },
        }
      );
      
      console.log('createMediaFile', response)
      
      if ( ! Array.isArray(updatedItem.resizedImages) ) {
        updatedItem.resizedImages = []
      }
      updatedItem.resizedImages.push(response.data.createMediaFile.id)
    }
    
    
  }

}

module.exports = onImageInput