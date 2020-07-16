const { Text, Integer } = require('@keystonejs/fields');

module.exports = {
  fields: {
    name: {
      type: Text,
    },
    size: {
      type: Integer,
    },
  }
};
