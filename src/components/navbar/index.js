import React, { memo } from 'react';
import styled from 'styled-components';


const SNavbar = styled.div`
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  display: flex;
  justify-content: space-between;
  width: 98%;
  margin: 1vh auto 20px auto;
  font-family: 'EB Garamond', sans-serif;
  font-size: 26px;
`;

const SPageLink = styled.div`
  color: black;
  text-decoration: none;
`

const Navbar = memo(() => {

  return (
    <SNavbar>
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
