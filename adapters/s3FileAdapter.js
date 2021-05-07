const { S3Adapter } = require('@keystonejs/file-adapters');

const { S3_KEY, S3_SECRET, S3_BUCKET, S3_FOLDER, REMOTE_MEDIA_SERVER_URL } = process.env

const fileAdapter = new S3Adapter({
  accessKeyId: S3_KEY,
  secretAccessKey: S3_SECRET,
  bucket: S3_BUCKET || 'bucket',
  folder: S3_FOLDER || 'folder',
  publicUrl: ({ id, filename, _meta }) => {
    return `${REMOTE_MEDIA_SERVER_URL}/${S3_BUCKET}/${S3_FOLDER}/${filename}`
  },
  s3Options: {
    // Optional paramaters to be supplied directly to AWS.S3 constructor
    signatureVersion: 'v4',
    s3ForcePathStyle: true,
    accessKeyId: S3_KEY || 'key',
    secretAccessKey: S3_SECRET || 'secret',
    endpoint: REMOTE_MEDIA_SERVER_URL
  },
  // uploadParams: ({ filename, id, mimetype, encoding }) => {
  //   return {
  //     ACL: 'public-read',
  //     Metadata: {
  //       keystone_id: id.toString(),
  //     }
  //   }
  // },
  getFilename: ({ id, originalFilename }) => {
    var pieces = originalFilename.split(/[.]+/);
    return originalFilename.substr(0, originalFilename.lastIndexOf('.')) + '-' + (new Date()).getTime() + '.' + pieces[pieces.length - 1].toLowerCase();
  },
});

module.exports = fileAdapter