import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import ImageComp from './imagecomp';
import Navbar from '../../components/navbar'
import ImageNav from './imagenav';

const SPortfolio = styled.div`
  height: 100vh;
  /* overflow: hidden; */
  display: flex;
  flex-flow: column;
  /* border: 3px solid blue; */
`

const SImages_Container = styled.div`
  flex: auto;
`

const SImage_Container = styled.div`
  display: inline-block;
  cursor: grab;
  width: 40%;
`

export default function Portfolio({ images, page, preloadedImages, updatePreloadedImages }) {

  const [imgURLs, setImgURLs] = useState([]);
  const [imgComponents, setImgComponents] = useState([]);
  const [imgNum, setImgNum] = useState(1);
  const [pg, setPg] = useState({});
  const [token, setToken] = useState();

  useEffect(_ => { // GET URLS AND STORE IN STATE
    if (images[page]) {

      const thisPage = page;
      let previousPage;
      let nextPage;

      page === 0 ?
        previousPage = images.length - 1 :
        previousPage = page - 1;

      page === images.length - 1 ?
        nextPage = 0 :
        nextPage = page + 1;

      setPg({ previous: previousPage, next: nextPage });

      let pageImages = (page) => images[page].image;

      const imgURLs = pageImages(thisPage).concat(pageImages(nextPage), pageImages(previousPage)).map(image =>
        image.url
      );

      setImgURLs(imgURLs);
    }
  }, [images]);

  useEffect(_ => { // PRELOAD IMAGES
    const preloadImage = (imageArray, index) => {
      if (imageArray && imageArray.length > index && !preloadedImages.includes(imageArray[index])) {
        const img = new Image();
        img.src = `http://localhost:1337${imageArray[index]}`;

        img.onload = () => {
          updatePreloadedImages(imageArray[index])
          preloadImage(imageArray, index + 1);
        }
      }
    }

    preloadImage(imgURLs, 1);

  }, [imgURLs]);

  const showNextImage = () => {
    const imgComponent = <ImageComp src={imgURLs[imgNum]} num={imgNum} key={imgNum} />
    const arr = [...imgComponents, imgComponent];

    setImgComponents(arr)
    setImgNum(imgNum + 1);
  }

  const autenticate = () => {
    axios
      .post('http://localhost:1337/auth/local', {
        identifier: 'rub4sev@gmail.com',
        password: 'abc123',
      })
      .then(response => {
        // Handle success.
        console.log('Well done!');
        console.log('User profile', response.data.user);
        console.log('User token', response.data.jwt);
        setToken(response.data.jwt);
      })
      .catch(error => {
        // Handle error.
        console.log('An error occurred:', error);
      });
  }

  const post = () => {
    console.log('token:', token)

    // axios.post("http://localhost:1337/names", {title: "hello authorized"}, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   }
    // })
    //   .then(res => {
    //     console.log(res);
    //     console.log(res.data);
    //   })
    // axios.post("http://localhost:1337/names", { title: "hello authorized" })
    //   .then(res => {
    //     console.log(res);
    //     console.log(res.data);
    //   })
    // axios.delete("https://amma-strapi.herokuapp.com/galleries/5dcd9fe67735350017719c3d")
    //   .then(res => {
    //     console.log(res);
    //     console.log(res.data);
    //   });
    // axios.put("http://localhost:1337/names/5dcd768d3a1290143c8a5794", {title: "hello updated"})
    //   .then(res => {
    //     console.log(res);
    //     console.log(res.data);
    //   });
  }

  useEffect(_ => {
    const dragImg = new Image(0, 0);
    dragImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  }, [])

  const box = {
    width: '300px',
    // cursor: 'grab',
    pointerEvents: 'none'
  }

  const handleDragImg = e => {
    console.log('e:', e.dataTransfer)
    const dragImg = new Image(0, 0);
    dragImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(dragImg, 0, 0);
  }


  return (
    <SPortfolio>
      <Navbar />
      {/* <h1 onClick={_ => autenticate()}>Click to test</h1>
        <h1 onClick={_ => post()}>Click to test 2</h1> */}
      <SImages_Container
        onClick={_ => { if (imgNum < images[page].image.length) showNextImage() }}
      >
        {images[page] &&
          <Draggable
            onStop={e => console.log('e:', e.target.getBoundingClientRect().x)}
          >
            {/* <div style={box} /> */}
            <SImage_Container
              
            >
              <img style={box} 
                src="https://images.unsplash.com/photo-1574258496635-6b0acc96262d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60"
              />
              {/* <ImageComp
                src={images[page].image[0].url}
                num={0}
              /> */}
            </SImage_Container>
          </Draggable>
        }
        {imgComponents}
      </SImages_Container>
      <ImageNav previousPage={pg.previous} nextPage={pg.next} />
    </SPortfolio>
  );
}