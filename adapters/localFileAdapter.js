const { LocalFileAdapter } = require('@keystonejs/file-adapters');

const { LOCAL_MEDIA_SERVER_FOLDER } = process.env

const fileAdapter = new LocalFileAdapter({
  src: process.env.NODE_ENV === 'production' ? `./dist/${LOCAL_MEDIA_SERVER_FOLDER}` : `./${LOCAL_MEDIA_SERVER_FOLDER}`,
  path: `/${LOCAL_MEDIA_SERVER_FOLDER}`,
});

module.exports = fileAdapter