import React from 'react';



const ImageRelationship = ({ value }) => {
  
    
    return value ? (
    <div
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
                }}
                key={value.id}
                src={value._label_}
            />
        )}

    </div>
  ) : null;
};

export default ImageRelationship;