import React, { memo, useState } from 'react';
import styled from 'styled-components';


const SImage = styled.img`

`;


const ImageComp = memo(({ src, num }) => {

  console.log(`loaded MEMO image ${num}`);

  const [animateIn, setAnimateIn] = useState(false);

  return (
    <SImage
      src={`http://localhost:1337${src}`}
      animateIn={animateIn}
      onLoad={_ => setAnimateIn(!animateIn)}
    />
  )
})

export default ImageComp;

