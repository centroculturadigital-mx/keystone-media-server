# Keystone Media Server

This repo helps you store files either in a remote location (S3) or locally (where keystone is running). In case you store an Image, it will create and store different sizes of the image, according with ImageSizes. The transformation will be done using [imgproxy](https://github.com/imgproxy/imgproxy)

## Entities

- Image
- MediaFile
- ImageSize
- ResizedImage

## Dev and Prod variants

In case of local develpment you may want to test without S3 or a imgproxy remote server

We use `IS_REMOTE_MEDIA_SERVER` env variable to change between develpment and production environments. Set it to `1` when production, set it to `0` when production

### Enviroment Variables used

file `.env`:

```
IS_REMOTE_MEDIA_SERVER=0

# REMOTE MEDIA SERVER OPTIONS
S3_KEY=<YOUR_S3_KEY>
S3_SECRET=<YOUR_S3_SECRET>
S3_BUCKET=<YOUR_S3_BUCKET>
S3_FOLDER=<YOUR_S3_FOLDER>
REMOTE_MEDIA_SERVER_URL=<YOUR_REMOTE_MEDIA_SERVER_URL>

# LOCAL MEDIA SERVER OPTIONS
LOCAL_MEDIA_SERVER_FOLDER=archivos
LOCAL_KEYSTONE_HOST=localhost
LOCAL_KEYSTONE_PORT=3000

MONGO_URI=mongodb://mongo:27017/<YOUR_DB_NAME>


IMGPROXY_KEY=<YOUR_IMGPROXY_KEY>
IMGPROXY_SALT=<YOUR_IMGPROXY_SALT>

IMGPROXY_HOST=<YOUR_IMGPROXY_HOST>
IMGPROXY_PORT=<YOUR_IMGPROXY_PORT>
```

### Examples

Your keystone `index.js` file should look something like this:

```
const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { Text, Checkbox, Password } = require('@keystonejs/fields');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const initialiseData = require('./initial-data');
const { StaticApp } = require('@keystonejs/app-static');
const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose');

const {
  LOCAL_MEDIA_SERVER_FOLDER,
  IS_REMOTE_MEDIA_SERVER,
  MONGO_URI
} = process.env 

const staticPath = `/${LOCAL_MEDIA_SERVER_FOLDER}`
const staticSrc = `./${LOCAL_MEDIA_SERVER_FOLDER}`


const { 
  Image,
  MediaFile,
  ImageSize,
  ResizedImage
} = require('./keystone-media-server/lists')

const resolveImageInput = require('./keystone-media-server/resolvers/imageInput') 

const PROJECT_NAME = 's3-test';

const mongoUrl = MONGO_URI || 'mongodb://localhost:27017/keystone-s3-test';

const adapterConfig = { mongoUri: mongoUrl };


const keystone = new Keystone({
  adapter: new Adapter(adapterConfig),
  cookieSecret: 'askjdahksjdhaksjdhaksjd',
  onConnect: process.env.CREATE_TABLES !== 'true' && initialiseData,
});

// Access control functions
const userIsAdmin = ({ authentication: { item: user } }) => Boolean(user && user.isAdmin);
const userOwnsItem = ({ authentication: { item: user } }) => {
  if (!user) {
    return false;
  }

  // Instead of a boolean, you can return a GraphQL query:
  // https://www.keystonejs.com/api/access-control#graphqlwhere
  return { id: user.id };
};

const userIsAdminOrOwner = auth => {
  const isAdmin = access.userIsAdmin(auth);
  const isOwner = access.userOwnsItem(auth);
  return isAdmin ? isAdmin : isOwner;
};

const access = { userIsAdmin, userOwnsItem, userIsAdminOrOwner };

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

keystone.createList('User', {
  fields: {
    name: { type: Text },
    email: {
      type: Text,
      isUnique: true,
    },
    isAdmin: {
      type: Checkbox,
      // Field-level access controls
      // Here, we set more restrictive field access so a non-admin cannot make themselves admin.
      access: {
        update: access.userIsAdmin,
      },
    },
    password: {
      type: Password,
    },
  },
  // List-level access controls
  access: {
    read: access.userIsAdminOrOwner,
    update: access.userIsAdminOrOwner,
    create: access.userIsAdmin,
    delete: access.userIsAdmin,
    auth: true,
  },
});

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
});

const apps = [
  new GraphQLApp(),
  new AdminUIApp({
    name: PROJECT_NAME,
    enableDefaultRoute: true,
    authStrategy,
  }),
]

if (IS_REMOTE_MEDIA_SERVER == 0) {
  apps.push(
    new StaticApp({
      path: staticPath,
      src: staticSrc,
      // fallback: 'index.html'
    })
  )
}

module.exports = {
  keystone,
  apps
};

```

Example `docker-compose.yml` file to test

```
version: "3.4"

services:

  mongo:
    container_name: mongo
    image: mongo
    volumes:
      - db:/data/db
    logging:
      driver: none

  imgproxy:
    image: darthsim/imgproxy
    container_name: imgproxy
    environment: 
      IMGPROXY_KEY: ${IMGPROXY_KEY}
      IMGPROXY_SALT: ${IMGPROXY_SALT}
    logging:
      driver: none

  keystone-s3-test:
    container_name: keystone-s3-test
    build: ./
    ports:
      - 3000:3000
    volumes:
      - files:/keystone-s3-test/dist/${LOCAL_MEDIA_SERVER_FOLDER}
      - ./:/keystone-s3-test/
    depends_on: 
      - mongo
      - imgproxy
    environment:
      PORT: 3000
      NODE_ENV: development
      IS_REMOTE_MEDIA_SERVER: ${IS_REMOTE_MEDIA_SERVER}
      S3_KEY: ${S3_KEY}
      S3_SECRET: ${S3_SECRET}
      S3_BUCKET: ${S3_BUCKET}
      S3_FOLDER: ${S3_FOLDER}
      REMOTE_MEDIA_SERVER_URL: ${REMOTE_MEDIA_SERVER_URL}
      LOCAL_MEDIA_SERVER_FOLDER: ${LOCAL_MEDIA_SERVER_FOLDER}
      LOCAL_KEYSTONE_HOST: ${LOCAL_KEYSTONE_HOST}
      LOCAL_KEYSTONE_PORT: ${LOCAL_KEYSTONE_PORT}
      MONGO_URI: ${MONGO_URI} 
      IMGPROXY_HOST: ${IMGPROXY_HOST}
      IMGPROXY_PORT: ${IMGPROXY_PORT}
      IMGPROXY_KEY: ${IMGPROXY_KEY}
      IMGPROXY_SALT: ${IMGPROXY_SALT}

volumes:
  db:
  files:
```
