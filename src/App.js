import './style.scss';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
    <Router>
      <Switch>
        <Route exact path="/" render={_ =>
          <Login storeJwtTokenAtRoot={storeJwtTokenAtRoot} />
        } />
        <Route path="/forgot-password" render={_ =>
          <ForgotPassword />
        } />
        <Route path="/reset-password" render={_ =>
          <ResetPassword />
        } />
        <Route path="/portfolio">
          <Portfolio jwtToken={jwtToken} />
        </Route>
        {/* <Route path="/contact" component={Contact} />
        <Route path="/shop" component={Shop} /> */}
      </Switch>
    </Router>
  );
}

export default App;
