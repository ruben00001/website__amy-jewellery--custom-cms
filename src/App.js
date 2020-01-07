import './style.scss';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import React, { useState } from 'react';
import Login from './pages/login';
import ForgotPassword from './pages/login/forgotPassword';
import ResetPassword from './pages/login/resetPassword';
import Portfolio from './pages/portfolio';
// import Contact from './pages/contact';
// import Shop from './pages/shop';

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
          <ForgotPassword />
        </Route>
        <Route path="/reset-password">
          <ResetPassword />
        </Route>
        <Route path="/portfolio"
          render={_ => <Portfolio jwtToken={jwtToken} />}
        />

        {/* <Route path="/portfolio">
          <Portfolio jwtToken={jwtToken} />
        </Route> */}
        {/* <Route path="/contact" component={Contact} />
        <Route path="/shop" component={Shop} /> */}
      </Switch>
    </BrowserRouter>
  );
}

export default App;
