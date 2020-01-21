import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import LoadingWidget from '../loadingWidget';


const SScreen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: rgba(63, 63, 63, 0.48);
`

const SMessage = styled.div`
  position: relative;
  z-index: 10000;
  width: 40vw;
  padding: 26px;
  background-color: white;
  text-align: left;
  font-family: 'Roboto', sans-serif;
  border-radius: 6px;

    h2 {
      font-weight: normal;
    }

    p {
      margin-top: 20px;
      color: #5F6368;
      font-size: 13px;
    }

    button {
      float: right;
      margin-top: 25px;
      background-color: #297BE6;
      padding: 9px 24px;
      color: white;
      font-size: 15px;
      border: none;
      border-radius: 3px;
      cursor: pointer;
    }
`

const SClose = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
  color: #5F6368;
  padding: 0px 4px;
  cursor: pointer;
`

const SCheck = styled.div`
  float: right;
  font-size: 20px;
  margin-top: 15px;
  color: #16E7AE;
`

const SUnsavedButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  margin-top: 15px;

`



export default function Screen({ message, closeScreen, ignoreChanges }) {

  console.log('message:', message)

  return (
    <SScreen>
      <SMessage>
        {
          message === 'numError' &&
          <>
            <SClose onClick={_ => closeScreen()}>
              <FontAwesomeIcon icon={faTimes} />
            </SClose>
            <h2>Error</h2>
            <p>Make sure no 2 numbers are identical.</p>
            <button onClick={_ => closeScreen()}>OK</button>
          </>
        }
        {
          message === 'uploadError' &&
          <>
            <SClose onClick={_ => closeScreen()}>
              <FontAwesomeIcon icon={faTimes} />
            </SClose>
            <h2>Oops.. something went wrong</h2>
            <p>Please try again.</p>
            <button onClick={_ => closeScreen()}>OK</button>
          </>
        }
        {
          message === 'unsaved' &&
          <>
            <SClose onClick={_ => closeScreen()}>
              <FontAwesomeIcon icon={faTimes} />
            </SClose>
            <h2>Warning</h2>
            <p>There are unsaved changes.</p>
            <SUnsavedButtonContainer>
              <button onClick={_ => { ignoreChanges(); closeScreen() }}>Ignore Changes</button>
              <button onClick={_ => closeScreen()}>OK</button>
            </SUnsavedButtonContainer>
          </>
        }
        {
          message === 'unsaved-home' &&
          <>
            <SClose onClick={_ => closeScreen()}>
              <FontAwesomeIcon icon={faTimes} />
            </SClose>
            <h2>Warning</h2>
            <p>There are unsaved changes.</p>
            <SUnsavedButtonContainer>
              <button>
                <Link to="/portfolio">Proceed anyway</Link>
              </button>
              <button onClick={_ => closeScreen()}>OK</button>
            </SUnsavedButtonContainer>
          </>
        }
        {
          typeof (message) === 'number' &&
          <>
            <SClose onClick={_ => closeScreen()}>
              <FontAwesomeIcon icon={faTimes} />
            </SClose>
            <h2>Warning</h2>
            <p>There are unsaved changes.</p>
            <SUnsavedButtonContainer>
              <button>
                <Link to={`/portfolio/${message}`} onClick={_ => closeScreen()}>Proceed anyway</Link>
              </button>
              <button onClick={_ => closeScreen()}>OK</button>
            </SUnsavedButtonContainer>
          </>
        }
        {
          message === 'upload' &&
          <>
            <h2>Please wait</h2>
            <p>Saving new data.</p>
            <LoadingWidget />
          </>
        }
        {
          message === 'success' &&
          <>
            <h2>Success</h2>
            <p>Data saved.</p>
            <SCheck>
              <FontAwesomeIcon icon={faCheck} />
            </SCheck>
          </>
        }
      </SMessage>
    </SScreen>
  )
}