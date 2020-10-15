const crypto = require('crypto');
const {
  createImageSizes,
} = require('./seed')

const randomString = () => crypto.randomBytes(6).hexSlice();

const createAdminUser = async (keystone) => {

  const {
    data: {
      _allUsersMeta: { count },
    },
  } = await keystone.executeGraphQL({
    context: keystone.createContext({ skipAccessControl: true }),
    query:`
      query {
      _allUsersMeta {
        count
      }
    }`
  });

  if (count === 0) {

    const password = process.env.NODE_ENV != 'production' ? 'password' : randomString()
    const email = 'ccd.labweb@gmail.com'

    const user =  {
      email,
      password,
      isAdmin: true
    }

    const res = await keystone.executeGraphQL({
      context: keystone.createContext({ skipAccessControl: true }),
      query:`
        mutation initialUser($data: UserCreateInput!) {
          createUser(data: $data) {
            id
          }
        }
      `,
      variables: {
        data: user
      },
    });

    console.log(`
  
      UserAdmin created:

          email: ${email}
          password: ${password}

      Modifica la contraseña tras primer ingreso

      `
    )

  }

}



module.exports = async keystone => {
  
  await createImageSizes(keystone)
  await createAdminUser(keystone) 
  
};
