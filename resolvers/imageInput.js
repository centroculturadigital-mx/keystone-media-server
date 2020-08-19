const { Readable } = require('stream')

const generateSignature = require("./functions/generateSignature")

function bufferToStream(buffer) {
  const newStream = new Readable()
  newStream.push(buffer)
  newStream.push(null)
  return newStream
}

const onImageInput = async ({
  keystone,
  operation,
  existingItem,
  originalInput,
  resolvedData,
  context,
  actions,
}) => {

  if ( !! resolvedData.original ) {

    const sizeQuery = await keystone.executeGraphQL({
      context: keystone.createContext({ skipAccessControl: true }),
      query:`
        query {
          allImageSizes {
            id
            size
          }
        }
      `
    })

    const imageSizes = sizeQuery.data.allImageSizes

    if ( ! Array.isArray(resolvedData.sizes) || ! resolvedData.sizes.length ) {
      resolvedData.sizes = imageSizes.map(s => s.id)
    }

    for(s of resolvedData.sizes) {

      let imageSize = imageSizes.find(is => is.id === s )
      let size = imageSize ?  imageSize.size : 320
      let imageSizeId = imageSize ? imageSize.id : null 

      const { HOST, PORT, IMGPROXY_HOST, IMGPROXY_PORT, MEDIA_FOLDER } = process.env
      
      let url = `http://${HOST}:${PORT}/${MEDIA_FOLDER}/${resolvedData.original.filename}`

      const signature = generateSignature({
        url,
        resizing_type: 'fit',
        width: size,
        height: size,
        gravity: 'ce', //center
        enlarge: 1,
        extension: 'png',
      })

      let image = await fetch(`http://${IMGPROXY_HOST}:${IMGPROXY_PORT}/${signature}`)

      let filename = resolvedData.original.filename
      let name = resolvedData.name || resolvedData.original.filename
      let fileExt = filename.split('.').reverse()[0]
      
      filename = filename.split('-')[1].split('.'+fileExt)[0] + size + '.' +  fileExt

      const encoding = "7bit"
      const buffer = await image.buffer()
      const mimetype = fileExt == 'png' ? 'image/png' : 'image/jpeg'

      const file = { createReadStream: () => bufferToStream(buffer), filename, mimetype, encoding }

      const response = await keystone.executeGraphQL({
        context: keystone.createContext({ skipAccessControl: true }),
        query:`
          mutation generateResizedImage(
            $name: String, 
            $file: Upload,
            $size: ID!
          ) {
            createResizedImage (
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
          }
        `,
        variables: {
          name,
          file,
          size: imageSizeId
        },
      })

      if ( ! Array.isArray(resolvedData.resizedImages) ) {
        resolvedData.resizedImages = []
      }

      resolvedData.resizedImages.push(response.data.createResizedImage.id)

    }
    
  }

  return resolvedData

}

module.exports = onImageInput