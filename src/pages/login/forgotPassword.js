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
  justify-content: center;
  height: 500px;
  padding: 0 40px;
  border: 1px solid #DADCE0;
  border-radius: 8px;
`

const SInput_Container = styled.div`
  position: relative;
`

const SInput = styled.input`
  width: 400px;
  height: 45px;
  margin-bottom: 10px;
  border: ${props => !props.emailError ? props.emailSuccess ? '1px solid #12C2AB' : '1px solid #DADCE0' : '1px solid #D93025'};
  border-radius: 4px;
  padding-left: 10px;
  outline: none;
  font-family: 'Roboto', sans-serif;
  transition: ${props => props.emailError ? 'border .2s' : 'border .1s'};

  :focus {
    border: 1px solid #287AE6;
  }
`

const SInput_Info = styled.p`
  position: absolute;
  top: -7px;
  left: 20px;
  background: white;
  padding: 0 6px;
  font-family: 'Roboto', sans-serif;
  font-size: 11px;
  color: grey;
  /* border: 1px solid black; */
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
  opacity: ${props => props.emailError ? 1 : 0};
  align-self: flex-end;
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  color: #D93025;
  transition: opacity .2s;
`

const SSuccess = styled.p`
  opacity: ${props => props.emailSuccess ? 1 : 0};
  align-self: flex-end;
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  color: #12C2AB;
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

  const [emailError, setEmailError] = useState(false);
  const [success, setSuccess] = useState(false);


  const sendPasswordReset = (e) => {
    e.preventDefault(); // prevents refresh of page on form submit
    const form = e.target;
    axios
      .post('http://localhost:1337/auth/forgot-password', {
        email: form.elements.email.value,
        url:
          'http://localhost:3000/reset-password',
      })
      .then(response => {
        // Handle success.
        setSuccess(true);
        console.log('Your user received an email');
      })
      .catch(error => {
        // Handle error.
        setEmailError(true);
        console.log('An error occurred:', error);
      });
  }



  return (
    <SForm_Container>
      <SForm onSubmit={sendPasswordReset}>
        <Title>Amy Rodriguez Jewellery</Title>
        <SInput_Container>
          <SInput_Info>Enter email for password recovery</SInput_Info>
          <SInput type="email" name="email"
            defaultValue={useLocation().state.email}
            onKeyDown={_ => emailError ? setEmailError(false) : null }
            emailError={emailError}
            emailSuccess={success}
          />
        </SInput_Container>
        <SLoginInfo>
          <SForgot>
            <Link to="/">Go Back</Link>
          </SForgot>
          <SError
            emailError={emailError}
          >
            Incorrect email.
          </SError>
          <SSuccess
            emailSuccess={success}
          >
            Email sent.
          </SSuccess>
        </SLoginInfo>
        <SSubmit type="submit" value="Send" />
      </SForm>
    </SForm_Container>
  );
}