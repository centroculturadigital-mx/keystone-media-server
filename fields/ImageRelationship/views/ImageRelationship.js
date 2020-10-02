import React from 'react';



const ImageRelationship = (payload) => {

    // console.log({payload});

    const { value } = payload
    
    return value ? (
    <div
      className="ImageRelationship"
      style={{
        display: 'inline-flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',        
      }}
    >
        {(
            <img
                style={{
                    'objectFit': "contain",
                    'width': "100%",
                    'maxWidth': "5rem",
                    'outline': '3px solid #ccd'
                }}
                key={value.id}
                src={value._label_}
            />
        )}

    </div>
  ) : null;
};

export default ImageRelationship;