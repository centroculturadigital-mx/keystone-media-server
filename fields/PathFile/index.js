const { PathFile, MongoFileInterface, KnexFileInterface } = require('./Implementation');
const { importView } = require('@keystonejs/build-field-types');

const { File } = require('@keystonejs/fields');


module.exports = {
  type: 'File',
  implementation: PathFile,
  views: {
    Controller: File.views.Controller,
    Field: importView('./views/Field'),
    Cell: importView('./views/Cell'),
  },
  adapters: {
    mongoose: MongoFileInterface,
    knex: KnexFileInterface,
  },
};
