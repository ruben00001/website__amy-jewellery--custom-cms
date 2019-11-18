import './style.scss';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Portfolio from './pages/portfolio';
import Contact from './pages/contact';
import Shop from './pages/shop';

function App() {

  const [images, setImages] = useState([]);
  const [preloadedImages, setPreLoadedImages] = useState([]);


  useEffect(_ => { // PULL DATA FROM STRAPI CMS
    const fetchImages = async () => {
      console.log(`fetching images...`);
      const result = await axios('http://localhost:1337/images');

      setImages(result.data);
    }

    fetchImages();
  }, []);


  const updatePreloadedImages = (url) => {
    setPreLoadedImages(preloadedImages => preloadedImages.concat(url));
  }


  return (
    <Router>
      {/* <h1 onClick={_ => console.log(preloadedImages)}>App.js</h1> */}
      {/* <Navbar /> */}
      <Switch>
        <Route exact path="/" render={_ =>
          <Portfolio
            images={images}
            page={0}
            preloadedImages={preloadedImages}
            updatePreloadedImages={updatePreloadedImages}
          />}
        />
        {
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
        }
        <Route path="/contact" component={Contact} />
        <Route path="/shop" component={Shop} />
      </Switch>
    </Router>
  );
}

export default App;
