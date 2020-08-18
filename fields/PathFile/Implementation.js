const { File } = require('@keystonejs/fields');

class PathFile extends File.implementation {
//   extendAdminMeta(meta) {
//     return { ...meta, starCount: this.config.starCount || 5 };
//   }
}

module.exports = {
  PathFile,
  MongoFileInterface: File.adapters.mongoose,
  KnexFileInterface: File.adapters.knex,
};