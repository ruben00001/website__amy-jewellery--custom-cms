import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
`

const SInput = styled.input`
  width: 400px;
  height: 40px;
  margin-bottom: 10px;
  border: ${props => props.logInError ? '1px solid #D93025' : '1px solid #DADCE0'};
  border-radius: 4px;
  padding-left: 10px;
  outline: none;
  font-family: 'Roboto', sans-serif;
  transition: ${props => props.logInError ? 'border .2s' : 'border .1s'};

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



export default function ForgotPassword() {

  const [logInError, setLogInError] = useState(false);

  const resetCode = useLocation().search.match(/\=(.*)/);

  console.log('resetCode:', resetCode[1])

  const sendNewPassword = (e) => {
    e.preventDefault(); // prevents refresh of page on form submit
    const form = e.target;



    axios
      .post('http://localhost:1337/auth/reset-password', {
        code: resetCode,
        password: form.elements.newpassword.value,
        passwordConfirmation: form.elements.confirm.value
      })
      .then(response => {
        // Handle success.
        console.log('Your user\'s password has been changed.');
      })
      .catch(error => {
        // Handle error.
        console.log('An error occurred:', error);
      });
  }



  return (
    <SForm_Container>
      <SForm onSubmit={sendNewPassword}>
        <Title>Amy Rodriguez Jewellery</Title>
        <SInput type="password" name="newpassword" placeholder="new password"
          logInError={logInError}
        />
        <SInput type="password" name="confirm" placeholder="confirm password"
          logInError={logInError}
        />
        <SLoginInfo>
          <SForgot>
            <Link to="/">Back to Login</Link>
          </SForgot>
          <SError
            logInError={logInError}
          >
            Incorrect email.
          </SError>
        </SLoginInfo>
        <SSubmit type="submit" value="Reset" />
      </SForm>
    </SForm_Container>
  );
}