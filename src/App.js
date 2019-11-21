import './style.scss';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './pages/login';
import ForgotPassword from './pages/login/forgotPassword';
import ResetPassword from './pages/login/resetPassword';
import Portfolio from './pages/portfolio';
import Contact from './pages/contact';
import Shop from './pages/shop';

function App() {

  const [preloadedImages, setPreLoadedImages] = useState([]);
  const [jwtToken, setJwtToken] = useState(null);

  const storeJwtTokenAtRoot = (key) => {
    setJwtToken(key)
  }

  const updatePreloadedImages = (url) => {
    setPreLoadedImages(preloadedImages => preloadedImages.concat(url));
  }

  return (
    <Router>
      {/* <h1 onClick={_ => console.log(preloadedImages)}>App.js</h1> */}
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
        <Route path="/portfolio" render={_ =>
          <Portfolio />
        } />
        
        {/* {
          // jwtToken &&
          images.map((portfolio_slide, i) =>
            <Route key={i} path={`/portfolio_slide_${i}`} render={_ =>
              <Portfolio
                images={images}
                page={i}
                preloadedImages={preloadedImages}
                updatePreloadedImages={updatePreloadedImages}
              />}
            />
          )
        } */}

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
