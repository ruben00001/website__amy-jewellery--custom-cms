import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';


const SNavbar = styled.div`
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
        <Link to="/">amy rodriguez</Link>
      </SPageLink>
      <SPageLink>
        <Link to="/shop">shop</Link>
      </SPageLink>
      <SPageLink>
        <Link to="/contact">contact</Link>
      </SPageLink>
    </SNavbar>
  )
})

export default Navbar;
