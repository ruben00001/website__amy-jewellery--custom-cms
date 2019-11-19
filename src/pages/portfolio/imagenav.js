import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';


const SSlideLinkContainer = styled.div`
  /* position: fixed;
  bottom: 20px; */
  height: 30px;
  display: flex;
  justify-content: space-around;
  width: 100%;
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  /* border: 2px solid red; */
`

const SSlideLink = styled.div`
  color: black;
  text-decoration: none;
`


const ImageNav = memo(({ previousPage, nextPage }) => {

  return (
    <SSlideLinkContainer>
      <SSlideLink>
        <Link
          to={previousPage === 0 ? "/" : `/portfolio_slide_${previousPage}`}
        >
          previous page
        </Link>
      </SSlideLink>
      <SSlideLink>
        <Link
          to={nextPage === 0 ? "/" : `/portfolio_slide_${nextPage}`}
        >
          next page
        </Link>
      </SSlideLink>
    </SSlideLinkContainer>
  )
})

export default ImageNav;