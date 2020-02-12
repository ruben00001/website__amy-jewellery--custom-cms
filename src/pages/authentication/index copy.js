import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { Global } from '../../environment/global';
import Screen from '../../components/screens';


const FlexDiv = styled.div`
  display: flex;
`;

const SFormContainer = styled(FlexDiv)`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Title = styled.h1`
  font-size: 26px;
  margin-bottom: 60px;
`;

const SForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const SInput = styled.input`
  width: 400px;
  height: 50px;
  margin-bottom: 10px;
  border: ${props => props.logInError ? '1px solid #D93025' : '1px solid #DADCE0'};
  border-radius: 4px;
  padding-left: 10px;
  outline: none;
  transition: ${props => props.logInError ? 'border .2s' : 'border .1s'};

  :focus {
    border: 1px solid #287AE6;
  }
`

const SLoginInfo = styled(FlexDiv)`
  justify-content: space-between;
  margin-top: 10px;
`;

const SForgot = styled.div`
  font-size: 14px;
  color: #287AE6;
`

const SError = styled.p`
  opacity: ${props => props.logInError ? 1 : 0};
  align-self: flex-end;
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


export default function Login({ storeJwtTokenAtRoot }, props) {

  const [token, setToken] = useState(null);
  const [logInError, setLogInError] = useState(false);
  const [email, setEmail] = useState();
  const [screen, setScreen] = useState(null);

  const history = useHistory();

  const strapiURL = Global.strapiURL;

  useEffect(_ => {
    storeJwtTokenAtRoot(token)
  }, [token]);

  const authenticateLogIn = (e) => {
    e.preventDefault(); // prevents refresh of page on form submit
    setScreen('login');

    const form = e.target;
    axios
      .post(`${strapiURL}/auth/local`, {
        identifier: form.elements.email.value,
        password: form.elements.password.value
      })
      .then(response => {
        setScreen('success-login');
        setToken(response.data.jwt);
        setTimeout(() => {
          history.push("/portfolio")
        }, 800);

      })
      .catch(_ => {
        setScreen('uploadError');
        setTimeout(() => {
          setLogInError(true);
          form.elements.password.value = "";
        }, 1000);
      });
  }



  return (
    <SFormContainer>
      {
        screen &&
        <Screen message={screen} closeScreen={_ => setScreen(null)} />
      }
      <SForm onSubmit={authenticateLogIn}>
        <Title>Amy Rodriguez Jewellery</Title>
        <SInput type="email" name="email" placeholder="email"
          onChange={e => setEmail(e.target.value)}
          onKeyDown={_ => logInError ? setLogInError(false) : null}
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
    </SFormContainer>
  );
}