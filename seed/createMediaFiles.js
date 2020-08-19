const fs = require('fs')
const { Readable } = require('stream')

function bufferToStream(buffer) {
  const newStream = new Readable()
  newStream.push(buffer)
  newStream.push(null)
  return newStream
}

const readMediaFile = async () => {

  const filename = "test-file.pdf"
  const encoding = "binary"
  const mimetype = 'application/pdf'

  const fileRead = await fs.readFileSync(__dirname+'/'+filename)
  
  const buffer = Buffer(fileRead)

  const file = { createReadStream: () => bufferToStream(buffer), filename, mimetype, encoding }

  return file

}

const createMediaFiles = async (keystone, number = 1) => {

  const medias = await Promise.all(new Array(number).fill({}).map(async (e,i) => {
    return {
      data: {
        name: 'test-file',
        file: await readMediaFile(),
      }
    }
  }))

  const res = await keystone.executeGraphQL({
    context: keystone.createContext({ skipAccessControl: true }),
    query: `
      mutation initialMedias($data: [MediaFilesCreateInput] ) {
        createMediaFiles(data: $data) {
          id
          name
        }
      }
    `,
    variables: {
      data: medias
    },
  })

  return res.data.createMediaFiles

}

module.exports = createMediaFiles
