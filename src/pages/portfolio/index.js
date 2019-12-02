import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, useRouteMatch, Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import ImageComp from './imagecomp';
import Navbar from '../../components/navbar'
import ImageNav from './imagenav';
import Slide from './slide';


const SSlide_Container = styled.div`
  position: relative;
  width: 60%;
  height: ${props => `${props.height}px`};
  margin: 30px auto;
  overflow: hidden;
  border: 2px solid black;
`

const SSlide_Num = styled.h2`
  position: absolute;
  top: 20px;
  left: 20px;
  font-family: 'Roboto', sans-serif;
  font-size: 30px;
`

export default function Portfolio() {

  let { path, url } = useRouteMatch();

  // console.log('====================================');
  // console.log(path);
  // console.log('====================================');

  const [toggle, set] = useState(false);
  const [slideData, setSlideData] = useState([]);
  const [imgElements, setImgElements] = useState([]);

  useEffect(_ => { // PULL DATA FROM STRAPI CMS AND COLLATE

    console.log('====================================');
    console.log('API CALL MADE');
    console.log('====================================');

    let slides;

    axios.get('http://localhost:1337/slides')
      .then(response => {

        slides = response.data.map(slide => {
          return {
            id: slide.id,
            num: slide.num,
            imgs: slide.images.map(image => {
              return {
                id: image.id,
                url: image.image.url
              }
            })
          }
        });

        axios.get('http://localhost:1337/images')
          .then(response => {
            response.data.forEach(image => {
              const imgWidths = image.widths.map(imgWidth => {
                return {
                  id: imgWidth.id,
                  screen: imgWidth.screenwidth,
                  width: imgWidth.width
                }
              });
              const imgPositions = image.positions.map(imgPos => {
                return {
                  id: imgPos.id,
                  screen: imgPos.screenwidth,
                  x: imgPos.x,
                  y: imgPos.y
                }
              });

              for (let i = 0; i < slides.length; i++) {
                for (let j = 0; j < slides[i].imgs.length; j++) {
                  if (image.id === slides[i].imgs[j].id) {
                    slides[i].imgs[j].widths = imgWidths;
                    slides[i].imgs[j].positions = imgPositions;
                    break;
                  }
                }
              }
            });
            // console.log('slides:', slides);
            setSlideData(slides);
          })
      })
  }, [toggle]);

  useEffect(_ => { // CREATE IMGS ELEMENTS
    if (slideData[0]) {
      const slideImgs = [];

      const setMqPropertyIndex = (image, property, screenWidth) => {
        const values = image[property].map(size =>
          size.screen
        );
        for (let i = 0; i < values.length; i++) {
          if (screenWidth >= values[i] || !values[i + 1]) return i // *** check this works
        }
      }

      slideData.forEach(slide => {
        const imgs = slide.imgs.map((image, j) => {

          const mqWidthsWidthIndex = setMqPropertyIndex(image, 'widths', 1920);
          const mqPositionsWidthIndex = setMqPropertyIndex(image, 'positions', 1920);

          return (
            <img src={`http://localhost:1337${image.url}`}
              style={{
                position: 'absolute',
                width: `${image.widths[0] ? image.widths[mqWidthsWidthIndex].width : 30}%`, // ** change these (no ternary needed)
                top: image.positions[0] ? image.positions[mqPositionsWidthIndex].y : 30,
                left: image.positions[0] ? image.positions[mqPositionsWidthIndex].x : 30
              }}
              key={j}
            />
          )
        });
        slideImgs.push(imgs);
      });
      setImgElements(slideImgs);
    }
  }, [slideData]);


  // const submitUpload = e => {
  //   e.preventDefault();

  //   const formData = new FormData(e.target);
  //   formData.append('ref', 'image');
  //   formData.append('field', 'image');

  //   axios.post("http://localhost:1337/images", {slide: '5dd5cbfecc6e1a0ee4066b29'})
  //     .then(res => {
  //       console.log(res);

  //       formData.append('refId', res.data.id);

  //       axios.post(`http://localhost:1337/upload`, formData, {
  //         headers: { 'Content-Type': 'multipart/form-data' },
  //       })
  //         .then(res => {
  //           console.log(res);
  //         })
  //         .catch(err => {
  //           console.log(err);
  //         });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }
  const setToggle = () => {
    console.log('TOGGLE');
    
    set(!toggle);
  }

  const addPage = () => {
    axios.post("http://localhost:1337/slides", { num: slideData.length + 1 })
      .then(res => {
        // console.log(res.data);
        setToggle();
      })
  }




  return (
    <>
      {/* <form id='form' onSubmit={e => submitUpload(e)}>
     <input type="file" name="files" />
     <input type="submit" value="Submit" />
    </form> */}

      <Switch>
        <Route exact path={path}>
          <div>
            <h2>Portfolio Home</h2>
            {
              slideData[0] &&
              slideData.map((slide, i) => {
                return (
                  <Link to={`${url}/${i}`} key={i}>
                    <SSlide_Container height={(window.innerWidth * 0.6) * 1200 / 1920} key={i}>
                      <SSlide_Num>{i + 1}</SSlide_Num>
                      {imgElements[i]}
                    </SSlide_Container>
                  </Link>
                )
              })

              // imgElements.map((slide, i) => 
              //   <SSlide_Container>
              //     {slide[i]}
              //   </SSlide_Container>
              // )
              // <img style={{ position: 'absolute', width: `${slideData[0].imgs[0].widths[0].width}%` }} src={`http://localhost:1337${slideData[0].imgs[0].url}`}></img>
              // slideData[0].imgs.map(img => 
              //   <img style={{position: 'absolute', width: img.widths[0].width, top: img.positions[0].y, left: img.positions[0].x}} src={`http://localhost:1337${img.url}`}></img>
              // ) 
            }
            {/* <div>
              {
                slideData.map((slide, i) =>
                  <Link to={`${url}/${i}`}>Slide {i + 1}</Link>
                )
              }
            </div> */}
            <h3 onClick={_ => addPage()}>Add Page</h3>
          </div>

        </Route>
        {slideData[0] &&
          <Route path={`${path}/:slideId`}>
            <Slide slideData={slideData} setToggle={setToggle} />
            {/* <Slide slideData={slideData} imgElements={<div>Hello</div>} /> */}
          </Route>
          // imgElements.map((slide, i) => {
          //   console.log('slide:', slide)
          //   return <Route path={`${path}/:slideId`}>
          //     <Slide imgElements={slide} page={i} />
          //   </Route>
          // })
        }

      </Switch>
    </>
  );

  // const [imgURLs, setImgURLs] = useState([]);
  // const [imgComponents, setImgComponents] = useState([]);
  // const [imgNum, setImgNum] = useState(1);
  // const [pg, setPg] = useState({});
  // const [token, setToken] = useState();

  // useEffect(_ => { // GET URLS AND STORE IN STATE
  //   if (images[page]) {

  //     const thisPage = page;
  //     let previousPage;
  //     let nextPage;

  //     page === 0 ?
  //       previousPage = images.length - 1 :
  //       previousPage = page - 1;

  //     page === images.length - 1 ?
  //       nextPage = 0 :
  //       nextPage = page + 1;

  //     setPg({ previous: previousPage, next: nextPage });

  //     let pageImages = (page) => images[page].image;

  //     const imgURLs = pageImages(thisPage).concat(pageImages(nextPage), pageImages(previousPage)).map(image =>
  //       image.url
  //     );

  //     setImgURLs(imgURLs);
  //   }
  // }, [images]);

  // useEffect(_ => { // PRELOAD IMAGES *****change this to do all at same time and not to do with slide now
  //   const preloadImage = (imageArray, index) => {
  //     if (imageArray && imageArray.length > index && !preloadedImages.includes(imageArray[index])) {
  //       const img = new Image();
  //       img.src = `http://localhost:1337${imageArray[index]}`;

  //       img.onload = () => {
  //         updatePreloadedImages(imageArray[index])
  //         preloadImage(imageArray, index + 1);
  //       }
  //     }
  //   }

  //   preloadImage(imgURLs, 1);

  // }, [imgURLs]);

  // const showNextImage = () => {
  //   const imgComponent = <ImageComp src={imgURLs[imgNum]} num={imgNum} key={imgNum} />
  //   const arr = [...imgComponents, imgComponent];

  //   setImgComponents(arr)
  //   setImgNum(imgNum + 1);
  // }

  // const autenticate = () => {
  //   axios
  //     .post('http://localhost:1337/auth/local', {
  //       identifier: 'rub4sev@gmail.com',
  //       password: 'abc123',
  //     })
  //     .then(response => {
  //       // Handle success.
  //       console.log('Well done!');
  //       console.log('User profile', response.data.user);
  //       console.log('User token', response.data.jwt);
  //       setToken(response.data.jwt);
  //     })
  //     .catch(error => {
  //       // Handle error.
  //       console.log('An error occurred:', error);
  //     });
  // }

  // const post = () => {
  //   console.log('token:', token)

  //   // axios.post("http://localhost:1337/names", {title: "hello authorized"}, {
  //   //   headers: {
  //   //     Authorization: `Bearer ${token}`,
  //   //   }
  //   // })
  //   //   .then(res => {
  //   //     console.log(res);
  //   //     console.log(res.data);
  //   //   })
  //   // axios.post("http://localhost:1337/names", { title: "hello authorized" })
  //   //   .then(res => {
  //   //     console.log(res);
  //   //     console.log(res.data);
  //   //   })
  //   // axios.delete("https://amma-strapi.herokuapp.com/galleries/5dcd9fe67735350017719c3d")
  //   //   .then(res => {
  //   //     console.log(res);
  //   //     console.log(res.data);
  //   //   });
  //   // axios.put("http://localhost:1337/names/5dcd768d3a1290143c8a5794", {title: "hello updated"})
  //   //   .then(res => {
  //   //     console.log(res);
  //   //     console.log(res.data);
  //   //   });
  // }

  // useEffect(_ => {
  //   const dragImg = new Image(0, 0);
  //   dragImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  // }, [])

  // const box = {
  //   width: '300px',
  //   // cursor: 'grab',
  //   pointerEvents: 'none'
  // }

  // const handleDragImg = e => {
  //   console.log('e:', e.dataTransfer)
  //   const dragImg = new Image(0, 0);
  //   dragImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  //   e.dataTransfer.setDragImage(dragImg, 0, 0);
  // }


}

// <Navbar />
// {/* <h1 onClick={_ => autenticate()}>Click to test</h1>
//   <h1 onClick={_ => post()}>Click to test 2</h1> */}
// <SImages_Container
//   onClick={_ => { if (imgNum < images[page].image.length) showNextImage() }}
// >
//   {images[page] &&
//     <Draggable
//       onStop={e => console.log('e:', e.target.getBoundingClientRect().x)}
//     >
//       {/* <div style={box} /> */}
//       <SImage_Container

//       >
//         <img style={box} 
//           src="https://images.unsplash.com/photo-1574258496635-6b0acc96262d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60"
//         />
//         {/* <ImageComp
//           src={images[page].image[0].url}
//           num={0}
//         /> */}
//       </SImage_Container>
//     </Draggable>
//   }
//   {imgComponents}
// </SImages_Container>
// <ImageNav previousPage={pg.previous} nextPage={pg.next} />