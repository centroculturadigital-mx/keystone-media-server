const createImageSizes = async (keystone) => {
  const ImageSizesMetaQuery = await keystone.executeQuery(
    `query {
      _allImageSizesMeta {
        count
      }
    }`
  );

  let ImageSizesCount = ImageSizesMetaQuery.data ?
    ImageSizesMetaQuery.data._allImageSizesMeta?
      ImageSizesMetaQuery.data._allImageSizesMeta.count
      : null
  : null
  

  if (ImageSizesCount === 0) {


    const sizes = [
        {
            name:"xs",
            size:320
        },
        {
            name:"md",
            size:768
        },
        {
            name:"lg",
            size: 1024
        },
        {
            name:"xl",
            size: 1600
        },
    ]

    for( {name, size} of sizes ) {


        const res = await keystone.executeQuery(
        `mutation initialImageSize($name: String, $size: Int) {
                createImageSize(data: {  size: $size, name: $name}) {
                id
                }
            }`,
        {
            variables: {
                name,
                size,
            },
        }
        );


    }

    
  }
}

module.exports = createImageSizes
