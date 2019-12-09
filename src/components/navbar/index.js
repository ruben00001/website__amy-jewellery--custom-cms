import React, { memo } from 'react';
import styled from 'styled-components';


const SNavbar = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  display: flex;
  justify-content: space-between;
  width: 98%;
  margin-top: 5px;
  font-family: 'EB Garamond', sans-serif;
  font-size: ${props => props.width < 500 ? '18px' : '24px'};
`;

const SPageLink = styled.div`
  color: black;
  text-decoration: none;
`

const Navbar = memo(({windowWidth, scale}) => {

  return (
    <SNavbar width={windowWidth} scale={scale}>
      <SPageLink className='hello'>
        amy rodriguez
      </SPageLink>
      <SPageLink>
        shop
      </SPageLink>
      <SPageLink>
        contact
      </SPageLink>
    </SNavbar>
  )
})

export default Navbar;
