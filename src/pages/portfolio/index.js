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
                num: image.num,
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
            <Slide slideData={slideData} setToggle={setToggle} toggle={toggle} />
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
}
