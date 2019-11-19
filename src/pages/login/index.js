import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';


const SForm_Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

const Title = styled.h1`
  font-family: 'Roboto', sans-serif;
  font-size: 26px;
  margin-bottom: 60px;
`

const SForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 500px;
  padding: 0 40px;
  border: 1px solid #DADCE0;
  border-radius: 8px;
`

const SInput = styled.input`
  width: 400px;
  height: 50px;
  margin-bottom: 10px;
  border: ${props => props.logInError ? '1px solid #D93025' : '1px solid #DADCE0'};
  border-radius: 4px;
  padding-left: 10px;
  outline: none;
  font-family: 'Roboto', sans-serif;
  transition: ${props => props.logInError ? 'border .2s' : 'border .1s'};
  /* transition: border .2s; */

  :focus {
    border: 1px solid #287AE6;
  }
`

const SLoginInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`

const SForgot = styled.div`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  color: #287AE6;
`


const SError = styled.p`
  opacity: ${props => props.logInError ? 1 : 0};
  align-self: flex-end;
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  color: #D93025;
  transition: opacity .2s;
`

const SSubmit = styled.input`
  width: 80px;
  height: 35px;
  margin-top: 23px;
  border: none;
  outline: none;
  background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%);
  border-radius: 4px;
  color: white;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  align-self: flex-end;
  cursor: pointer;

  :hover {
    box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.1);
  } 
  :active {
    box-shadow: none;
  }
`



export default function Login({ storeJwtTokenAtRoot }) {

  const [token, setToken] = useState(null);
  const [logInError, setLogInError] = useState(false);
  const [email, setEmail] = useState();


  useEffect(_ => {
    storeJwtTokenAtRoot(token)
  }, [token]);

  const authenticateLogIn = (e) => {
    e.preventDefault(); // prevents refresh of page on form submit
    const form = e.target;
    axios
      .post('http://localhost:1337/auth/local', {
        identifier: form.elements.email.value,
        password: form.elements.password.value
      })
      .then(response => {
        // Handle success.
        console.log('Well done!');
        console.log('User profile', response.data.user);
        console.log('User token', response.data.jwt);
        setToken(response.data.jwt);
      })
      .catch(error => {
        // Handle error.
        setLogInError(true);
        form.elements.password.value = "";
        console.log('An error occurred:', error);
      });
  }



  return (
    <SForm_Container>
      <SForm onSubmit={authenticateLogIn}>
        <Title>Amy Rodriguez Jewellery</Title>
        <SInput type="email" name="email" placeholder="email"
          onChange={e => setEmail(e.target.value) }
          onKeyDown={_ => logInError ? setLogInError(false) : null }
          logInError={logInError}
        />
        <SInput type="password" name="password" placeholder="password"
          logInError={logInError}
        />
        <SLoginInfo>
          <SForgot>
            <Link to={{
              pathname: "/forgot-password",
              state: {
                email: email
              }
            }}>
              Forgot Password?
            </Link>
          </SForgot>
          <SError
            logInError={logInError}
          >
            Incorrect password or email.
          </SError>
        </SLoginInfo>
        <SSubmit type="submit" value="Log In" />
      </SForm>
    </SForm_Container>
  );
}