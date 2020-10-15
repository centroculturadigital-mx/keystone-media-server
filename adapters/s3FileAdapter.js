const { S3Adapter } = require('@keystonejs/file-adapters');

const { S3_KEY, S3_SECRET, S3_BUCKET, S3_FOLDER } = process.env

const fileAdapter = new S3Adapter({
  accessKeyId: S3_KEY,
  secretAccessKey: S3_SECRET,
  bucket: S3_BUCKET || 'bucket',
  folder: S3_FOLDER || 'folder',
  region: 'us-west-1',
  // publicUrl: ({ id, filename, _meta }) => {
  //   `https://https://${S3_BUCKET}.s3-us-west-1.amazonaws.com/${S3_FOLDER}/${filename}`
  // },
  s3Options: {
    // Optional paramaters to be supplied directly to AWS.S3 constructor
    apiVersion: '2006-03-01',
    accessKeyId: S3_KEY || 'key',
    secretAccessKey: S3_SECRET || 'secret',
    region: 'us-west-1',
  },
  uploadParams: ({ filename, id, mimetype, encoding }) => {
    return {
      ACL: 'public-read',
      Metadata: {
        keystone_id: id.toString(),
      }
    }
  },
  getFilename: ({ id, originalFilename }) => {
    var pieces = originalFilename.split(/[.]+/);
    return originalFilename.substr(0, originalFilename.lastIndexOf('.')) + '-' + (new Date()).getTime() + '.' + pieces[pieces.length - 1].toLowerCase();
  },
});

module.exports = fileAdapter