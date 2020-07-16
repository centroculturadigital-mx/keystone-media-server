const { Relationship } = require('@keystonejs/fields');

class ImageRelationship extends Relationship.implementation {
//   extendAdminMeta(meta) {
//     return { ...meta, starCount: this.config.starCount || 5 };
//   }
}

module.exports = {
  ImageRelationship,
  MongoRelationshipInterface: Relationship.adapters.mongoose,
  KnexRelationshipInterface: Relationship.adapters.knex,
};