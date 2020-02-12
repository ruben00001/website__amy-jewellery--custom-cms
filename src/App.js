import './style.scss';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import React, { useState } from 'react';
import { Login, Forgot, Reset } from './pages/authentication/';
import Portfolio from './pages/portfolio';


function App() {

  const [jwtToken, setJwtToken] = useState(null);

  const storeJwtTokenAtRoot = (key) => {
    setJwtToken(key)
  }


  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Login storeJwtTokenAtRoot={storeJwtTokenAtRoot} />
        </Route>
        <Route path="/forgot-password">
          <Forgot />
        </Route>
        <Route path="/reset-password">
          <Reset />
        </Route>
        {
          jwtToken ?
            <Route path="/portfolio"
              render={_ => <Portfolio jwtToken={jwtToken} />}
            /> :
            <Redirect to={'/'} />
        }
      </Switch>
    </BrowserRouter>
  );
}

export default App;
