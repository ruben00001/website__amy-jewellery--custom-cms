import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { Global } from '../../environment/global';
import Screen from '../../components/screens';

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
  height: 40px;
  margin-bottom: 10px;
  border: ${props => !props.error ? props.success ? '1px solid #12C2AB' : '1px solid #DADCE0' : '1px solid #D93025'};
  border-radius: 4px;
  padding-left: 10px;
  outline: none;
  font-family: 'Roboto', sans-serif;
  transition: ${props => props.success ? 'border .2s' : 'border .1s'};

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
  display: ${props => props.error ? 'block' : 'none'};
  align-self: flex-end;
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  color: #D93025;
  transition: display .2s;
`

const SSuccess = styled.p`
  display: ${props => props.success ? 'block' : 'none'};
  align-self: flex-end;
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  color: #12C2AB;
  transition: display .2s;
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



export function Reset() {

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [screen, setScreen] = useState(null);

  let resetCode = useLocation().search.match(/\=(.*)/);
  resetCode = resetCode[1];

  const strapiURL = Global.strapiURL;

  const sendNewPassword = (e) => {
    e.preventDefault();
    setScreen('upload');

    const form = e.target;

    axios
      .post(`${strapiURL}/auth/reset-password`, {
        code: resetCode,
        password: form.elements.newpassword.value,
        passwordConfirmation: form.elements.confirm.value
      })
      .then(_ => {
        setScreen('success');
        setTimeout(() => {
          setScreen(null);
        }, 1000);
        setSuccess(true);
      })
      .catch(_ => {
        setScreen('uploadError');
        setError(true);
      });
  }



  return (
    <SForm_Container>
      {
        screen &&
        <Screen message={screen} closeScreen={_ => setScreen(null)} />
      }
      <SForm onSubmit={sendNewPassword}>
        <Title>Amy Rodriguez Jewellery</Title>
        <SInput type="password" name="newpassword" placeholder="new password"
          onKeyDown={_ => error ? setError(false) : null}
          error={error}
          success={success}
        />
        <SInput type="password" name="confirm" placeholder="confirm password"
          onKeyDown={_ => error ? setError(false) : null}
          error={error}
          success={success}
        />
        <SLoginInfo>
          <SForgot>
            <Link to="/">Back to Login</Link>
          </SForgot>
          <SError
            error={error}
          >
            Invalid password(s).
          </SError>
          <SSuccess
            success={success}
          >
            Password changed.
          </SSuccess>
        </SLoginInfo>
        <SSubmit type="submit" value="Reset" />
      </SForm>
    </SForm_Container>
  );
}