import './style.scss';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './pages/login';
import PasswordReset from './pages/login/passwordReset';
import Portfolio from './pages/portfolio';
import Contact from './pages/contact';
import Shop from './pages/shop';

function App() {

  const [jwtToken, setJwtToken] = useState(null);

  const storeJwtTokenAtRoot = (key) => {
    setJwtToken(key)
  }


  return (
    <Router>
      {/* <h1 onClick={_ => console.log(preloadedImages)}>App.js</h1> */}
      <Switch>
        <Route exact path="/" render={_ =>
          <Login storeJwtTokenAtRoot={storeJwtTokenAtRoot} />
        } />
        <Route exact path="/password-reset" render={_ =>
          <PasswordReset storeJwtTokenAtRoot={storeJwtTokenAtRoot} />
        } />

        {/* {
          images.slice(1).map((portfolio_slide, i) =>
            <Route key={i} path={`/portfolio_slide_${i + 1}`} render={_ =>
              <Portfolio
                images={images}
                page={i + 1}
                preloadedImages={preloadedImages}
                updatePreloadedImages={updatePreloadedImages}
              />}
            />
          )
        } */}
        <Route path="/contact" component={Contact} />
        <Route path="/shop" component={Shop} />
      </Switch>
    </Router>
  );
}

export default App;
