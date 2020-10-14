const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose');
const { StaticApp } = require('@keystonejs/app-static');
const responseCachePlugin = require('apollo-server-plugin-response-cache');

const {
  MONGO_URI,
  BUILD_STAGE,
  PORT,
  LOCAL_MEDIA_SERVER_FOLDER,
} = process.env

const { 
  Image,
  MediaFile,
  ImageSize,
  ResizedImage,
  Project,
  Folder,
  Tag
} = require('./lists')

const resolveImageInput = require('./resolvers/imageInput') 

// config

const staticPath = `/${LOCAL_MEDIA_SERVER_FOLDER}`
const staticSrc = `./${LOCAL_MEDIA_SERVER_FOLDER}`


const PROJECT_NAME = 'media-server';

const mongoUrl = MONGO_URI ? MONGO_URI : 'mongodb://localhost:27017/media-server';
const sessionStore = BUILD_STAGE == 1 ? null : new MongoStore({ url: mongoUrl })

const adapterConfig = { mongoUri: mongoUrl };

const keystone = new Keystone({
  cookieSecret: 'unacookiemuydificildeadivinar',
  secureCookies: true,
  port: PORT || "4000",
  sessionStore,
  name: PROJECT_NAME,
  adapter: new Adapter(adapterConfig),
  // onConnect: initialiseData,
  onConnect: () => { console.log('conencted') },
});



Image.hooks = {
  resolveInput: (params) => resolveImageInput({
    ...params,
    keystone
  })
}

keystone.createList('Image', Image);
keystone.createList('ImageSize', ImageSize);
keystone.createList('ResizedImage', ResizedImage);
keystone.createList('MediaFile', MediaFile);
keystone.createList('Project', Project);
keystone.createList('Folder', Folder);
keystone.createList('Tag', Tag);

let apps = [
  BUILD_STAGE == 1 ? new GraphQLApp() : new GraphQLApp({
    sessionStore,
    apollo: {
      cacheControl: {
        defaultMaxAge: 300,
      },
      plugins: [responseCachePlugin()],
    },
  }),
  new AdminUIApp({
    enableDefaultRoute: true,
  }),
  new StaticApp({
    path: staticPath,
    src: staticSrc,
    // fallback: 'index.html'
  })
]
  
module.exports = {
  keystone,
  apps,
  configureExpress: app => {
      app.set('trust proxy', 1)
  },
};


