import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';


const SSlideLinkContainer = styled.div`
  position: fixed;
  bottom: 10px;
  z-index: 1;
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
  cursor: pointer;
`


const ImageNav = memo(({ previousPage, nextPage, unsavedChange, remindToSave }) => {


  return (
    <SSlideLinkContainer>
      <SSlideLink
        onClick={_ => remindToSave('previous')}
      >
        {/* <Link style={{ pointerEvents: 'none' }} */}
        <Link style={unsavedChange ? { pointerEvents: 'none' } : null}
          to={`/portfolio/${previousPage}`}
        >
          previous page
        </Link>
      </SSlideLink>
      <SSlideLink>
        <Link style={{ pointerEvents: 'none' }}
          to={`/portfolio/${nextPage}`}
        >
          next page
        </Link>
      </SSlideLink>
    </SSlideLinkContainer>
  )
})

export default ImageNav;