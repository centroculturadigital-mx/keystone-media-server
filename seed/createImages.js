const fs = require('fs')
const { Readable } = require('stream')

function bufferToStream(buffer) {
  const newStream = new Readable()
  newStream.push(buffer)
  newStream.push(null)
  return newStream
}

const readImage = async (index = Math.random()*4, prefix="test", extension="jpg") => {

  const filename = prefix+Math.ceil(index)+"."+extension
  const fileType = filename.split('.')[1]
  const encoding = "7bit"
  const mimetype = fileType == 'png' ? 'image/png' : 'image/jpeg'

  const fileRead = await fs.readFileSync(__dirname+'/test-images/'+filename)

  const buffer = Buffer(fileRead)

  const file = { createReadStream: () => bufferToStream(buffer), filename, mimetype, encoding }

  return file

}

const createImages = async (keystone, number = 4, {imageSizes, prefix, extension}) => {

  const images = await Promise.all(new Array(number).fill({}).map(async (e,i) => {
    return {
      data: {
        name: 'test-image-' + (i+1),
        original: await readImage((i%4)+1, prefix, extension),
        sizes: {
          connect: imageSizes.map(is => ({ id: is.id }))
        }
      }
    }
  }))

  const res = await keystone.executeGraphQL({
    context: keystone.createContext({ skipAccessControl: true }),
    query: `
      mutation initialImages($data: [ImagesCreateInput] ) {
        createImages(data: $data) {
          id
          name
          size
        }
      }
    `,
    variables: {
      data: images
    },
  })

  return res.data.createImages

}

module.exports = createImages
