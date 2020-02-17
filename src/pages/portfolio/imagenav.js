import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';


const SSlideLinkContainer = styled.div`
  position: absolute;
  bottom: 0;
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


function ImageNav({ previousPage, nextPage, unsavedChange, setScreen }) {

  return (
    <SSlideLinkContainer>
      <SSlideLink
        onClick={_ => { if (unsavedChange) setScreen(previousPage) }}
      >
        <Link to={`/portfolio/${previousPage}`}
          style={unsavedChange ? { pointerEvents: 'none' } : null}
        >
          previous page
        </Link>
      </SSlideLink>
      <SSlideLink
        onClick={_ => unsavedChange ? setScreen(nextPage) : null}
      >
        <Link to={`/portfolio/${nextPage}`}
          style={unsavedChange ? { pointerEvents: 'none' } : null}
        >
          next page
        </Link>
      </SSlideLink>
    </SSlideLinkContainer>
  )
}

export default ImageNav;