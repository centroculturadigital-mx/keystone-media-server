const createImageSizes = async (keystone) => {
  const res = await keystone.executeGraphQL({
    context: keystone.createContext({ skipAccessControl: true }),
    query:`
      query {
        allImageSizes {
          id
          name
          size
        }
      }
    `
  });

  const imageSizes = res.data.allImageSizes

  

  if (imageSizes.length === 0) {

    const sizes = [
      {data: { name:"xs", size:320 } },
      {data: { name:"md", size:768 } },
      {data: { name:"lg", size: 1024 } },
      {data: { name:"xl", size: 1600 } },
    ]

    const res = await keystone.executeGraphQL({
      context: keystone.createContext({ skipAccessControl: true }),
      query:`
        mutation initialImageSizes($data: [ImageSizesCreateInput] ) {
          createImageSizes(data: $data) {
            id
            name
            size
          }
        }
      `,
      variables: {
        data: sizes
      },
    });

    return res.data.createImageSizes
    
  }

  return imageSizes
}

module.exports = createImageSizes
