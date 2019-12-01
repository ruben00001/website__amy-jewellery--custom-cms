import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Rnd } from 'react-rnd';
import styled from 'styled-components';
import { SizeMe, withSize } from 'react-sizeme'
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import Navbar from '../../components/navbar'
import ImageNav from './imagenav';
import ImageComp from './imagecomp';

const SPortfolio = styled.div`
  /* position: relative; */
  height: 100vh;
  display: flex;
  flex-flow: column;
  overflow: hidden;
`

const SImages_Container = styled.div`
  height: 100vh;
  /* border: 3px solid blue; */
`

// const SImage_Container = styled.div`
//   display: inline-block;
//   cursor: grab;
//   width: 40%;
// `

function Slide({ slideData, size }) {

  const [windowWidth, setWindowWidth] = useState();
  const [imgElements, setImgElements] = useState([]);
  const [newImgWidths, setNewImgWidths] = useState([]);
  const [newImgPositions, setNewImgPositions] = useState([]);
  const [pg, setPg] = useState({});
  const [imgsRND, setImgsRND] = useState([]);
  const [state, setState] = useState({ x: 200, y: 200, w: '30%' });

  const pgCurrent = Number(useParams().slideId);

  useEffect(_ => { // SET UP WINDOW WIDTH LISTENER
    function updateWidth() {
      console.log('WINDOW WIDTH CHANGED:', window.innerWidth);

      setWindowWidth(window.innerWidth);
    }
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(_ => {
    if (windowWidth) {
      setState({ ...state, x: 700, y: 100 });
      console.log('====================================');
      console.log('updated image state');
      console.log('====================================');
    }
  }, [windowWidth])
  // useEffect(_ => {
  //   setState({...state, x: 700, y: 100})
  //   setWindowWidth(size.width);
  // }, [size.width])

  // useEffect(_ => {
  //   const imgsRNDarr = [];

  //   slideData[pgCurrent].imgs.forEach(img => {
  //     imgsRNDarr.push({x: 0, y: 0});
  //   });

  //   setImgsRND(imgsRNDarr);
  // }, [slideData])

  useEffect(_ => { // CREATE IMGS ELEMENTS & STORE NEW WIDTH AND POS VALUES

    console.log('slideData[pgCurrent]:', slideData[pgCurrent])

    const setMqPropertyIndex = (image, property, screenWidth) => {
      const values = image[property].map(size => size.screen);
      const valuesSorted = image[property].map(size => size.screen).sort((a, b) => b - a);
      for (let i = 0; i < valuesSorted.length; i++) {
        if (screenWidth >= valuesSorted[i] || !valuesSorted[i + 1]) return values.indexOf(valuesSorted[i]) // *** double-check this works
      }
    }

    const imgs = slideData[pgCurrent].imgs.map((image, i) => {

      const widthsScreenWidths = image.widths.map(width => width.screen);
      const positionScreenWidths = image.positions.map(position => position.screen);

      const mqWidthsIndex = setMqPropertyIndex(image, 'widths', window.innerWidth);
      const mqPositionsIndex = setMqPropertyIndex(image, 'positions', window.innerWidth);



      return (
        <Rnd
          lockAspectRatio={true}
          // style={{border: size.width === 1680 ? '1px solid red' : '1px solid green' }}
          onDragStop={(e, d) => {

            let positionId = 0;
            for (let i = 0; i < positionScreenWidths.length; i++) {
              if (window.innerWidth === positionScreenWidths[i]) positionId = image.positions[i].id
            }

            setNewImgPositions(newImgPositions => {
              const arr = newImgPositions;
              let containsPosition = false;
              for (let i = 0; i < arr.length; i++) { // rewrite over existing value (not in Strapi) for image at this screensize
                if (d.node.getAttribute('value') === arr[i].imgId && arr[i].screenWidth === window.innerWidth) {
                  arr[i].x = d.x / window.innerWidth * 100;
                  arr[i].y = d.y / window.innerHeight * 100;
                  containsPosition = true;
                  break;
                }
              }
              return containsPosition ? arr : [...newImgPositions,
              { imgId: image.id, screenWidth: window.innerWidth, x: d.x / window.innerWidth * 100, y: d.y / window.innerHeight * 100, positionId: positionId }]
            })
          }}
          onResizeStop={(e, d, ref) => {

            let widthId = 0;
            for (let i = 0; i < widthsScreenWidths.length; i++) {
              if (widthsScreenWidths[i] === window.innerWidth) widthId = image.widths[i].id
            }

            setNewImgWidths(newImgWidths => {
              const arr = newImgWidths;
              let containsWidth = false;
              for (let i = 0; i < arr.length; i++) {
                if (ref.getAttribute('value') === arr[i].imgId && arr[i].screenWidth === window.innerWidth) {
                  arr[i].width = ref.style.width.slice(0, -1);
                  containsWidth = true;
                  break;
                }
              }
              return containsWidth ? arr : [...newImgWidths,
              { imgId: image.id, screenWidth: window.innerWidth, width: ref.style.width.slice(0, -1), widthId: widthId }]
            })
          }}
          // size={{ width: `${image.widths[mqWidthsIndex].width}%` }}
          // position={{
          //   x: imgsRND[i] ? imgsRND[i].x : `${window.innerWidth * image.positions[mqPositionsIndex].x / 100}`,
          //   y: imgsRND[i] ? imgsRND[i].y : `${window.innerHeight * image.positions[mqPositionsIndex].y / 100}`
          // }}
          default={{
            x: `${window.innerWidth * image.positions[mqPositionsIndex].x / 100}`,
            y: `${window.innerHeight * image.positions[mqPositionsIndex].y / 100}`,
            width: `${image.widths[mqWidthsIndex].width}%`,
          }}
          value={image.id}
          key={i}
        >
          <img style={{ pointerEvents: 'none', width: '100%' }} src={`http://localhost:1337${image.url}`} />
        </Rnd>
      )
    });

    setImgElements(imgs);

  }, [slideData]);

  useEffect(_ => { // SET VARIABLES FOR SLIDE NAVIGATION
    let page = { previous: null, next: null };

    pgCurrent === 0 ?
      page.previous = slideData.length - 1 :
      page.previous = pgCurrent - 1;

    pgCurrent === slideData.length - 1 ?
      page.next = 0 :
      page.next = pgCurrent + 1;

    setPg(page);
  }, [pgCurrent]);

  const uploadPropertyValues = () => {

    newImgWidths.forEach(width => {
      if (width.widthId) {
        axios.put(`http://localhost:1337/widths/${width.widthId}`,
          { screenwidth: width.screenWidth, width: width.width })
          .then(res => {
            console.log(res.data);
          });
      } else {
        axios.post("http://localhost:1337/widths",
          { screenwidth: width.screenWidth, width: width.width, image: width.imgId })
          .then(res => {
            console.log(res.data);
          })
      }
    });

    newImgPositions.forEach(position => {
      if (position.positionId) {
        axios.put(`http://localhost:1337/positions/${position.positionId}`,
          { screenwidth: position.screenWidth, x: position.x, y: position.y, })
          .then(res => {
            console.log(res.data);
          });
      } else {
        axios.post("http://localhost:1337/positions",
          { screenwidth: position.screenWidth, x: position.x, y: position.y, image: position.imgId })
          .then(res => {
            console.log(res.data);
          })
      }
    });
  }

  const test = () => {
    console.log('TEST');
    
    setState({ x: 700, y: 100, w: '10%' })
  }

  return (
    <SPortfolio>
      <Navbar />
      {/* <h1 style={{zIndex: 100}} onClick={_ => test()}>Test</h1> */}
      <SImages_Container>
        {/* {imgElements} */}
        <ImageComp defaultX={state.x} defaultY={state.y} defaultW={state.w} />
      </SImages_Container>
      {pg.next && // -> prevent unneccesary render
        <ImageNav previousPage={pg.previous} nextPage={pg.next} />
      }
      <FontAwesomeIcon icon={faSave}
        style={{ zIndex: 2, position: 'fixed', bottom: '20px', right: '20px', cursor: 'pointer' }}
        onClick={_ => uploadPropertyValues()}
      // onClick={_ => console.log(newImgPositions)}
      />
    </SPortfolio>
  )
}

export default withSize()(Slide);

// export default function Portfolio({ images, page, preloadedImages, updatePreloadedImages }) {

//   const [imgURLs, setImgURLs] = useState([]);
//   const [imgComponents, setImgComponents] = useState([]);
//   const [imgNum, setImgNum] = useState(1);
//   const [pg, setPg] = useState({});
//   const [token, setToken] = useState();

//   useEffect(_ => { // GET URLS AND STORE IN STATE
//     if (images[page]) {

//       const thisPage = page;
//       let previousPage;
//       let nextPage;

//       page === 0 ?
//         previousPage = images.length - 1 :
//         previousPage = page - 1;

//       page === images.length - 1 ?
//         nextPage = 0 :
//         nextPage = page + 1;

//       setPg({ previous: previousPage, next: nextPage });

//       let pageImages = (page) => images[page].image;

//       const imgURLs = pageImages(thisPage).concat(pageImages(nextPage), pageImages(previousPage)).map(image =>
//         image.url
//       );

//       setImgURLs(imgURLs);
//     }
//   }, [images]);

//   useEffect(_ => { // PRELOAD IMAGES
//     const preloadImage = (imageArray, index) => {
//       if (imageArray && imageArray.length > index && !preloadedImages.includes(imageArray[index])) {
//         const img = new Image();
//         img.src = `http://localhost:1337${imageArray[index]}`;

//         img.onload = () => {
//           updatePreloadedImages(imageArray[index])
//           preloadImage(imageArray, index + 1);
//         }
//       }
//     }

//     preloadImage(imgURLs, 1);

//   }, [imgURLs]);

//   const showNextImage = () => {
//     const imgComponent = <ImageComp src={imgURLs[imgNum]} num={imgNum} key={imgNum} />
//     const arr = [...imgComponents, imgComponent];

//     setImgComponents(arr)
//     setImgNum(imgNum + 1);
//   }

//   const autenticate = () => {
//     axios
//       .post('http://localhost:1337/auth/local', {
//         identifier: 'rub4sev@gmail.com',
//         password: 'abc123',
//       })
//       .then(response => {
//         // Handle success.
//         console.log('Well done!');
//         console.log('User profile', response.data.user);
//         console.log('User token', response.data.jwt);
//         setToken(response.data.jwt);
//       })
//       .catch(error => {
//         // Handle error.
//         console.log('An error occurred:', error);
//       });
//   }

//   const post = () => {
//     console.log('token:', token)

//     // axios.post("http://localhost:1337/names", {title: "hello authorized"}, {
//     //   headers: {
//     //     Authorization: `Bearer ${token}`,
//     //   }
//     // })
//     //   .then(res => {
//     //     console.log(res);
//     //     console.log(res.data);
//     //   })
//     // axios.post("http://localhost:1337/names", { title: "hello authorized" })
//     //   .then(res => {
//     //     console.log(res);
//     //     console.log(res.data);
//     //   })
//     // axios.delete("https://amma-strapi.herokuapp.com/galleries/5dcd9fe67735350017719c3d")
//     //   .then(res => {
//     //     console.log(res);
//     //     console.log(res.data);
//     //   });
//     // axios.put("http://localhost:1337/names/5dcd768d3a1290143c8a5794", {title: "hello updated"})
//     //   .then(res => {
//     //     console.log(res);
//     //     console.log(res.data);
//     //   });
//   }

//   useEffect(_ => {
//     const dragImg = new Image(0, 0);
//     dragImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
//   }, [])

//   const box = {
//     width: '300px',
//     // cursor: 'grab',
//     pointerEvents: 'none'
//   }

//   const handleDragImg = e => {
//     console.log('e:', e.dataTransfer)
//     const dragImg = new Image(0, 0);
//     dragImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
//     e.dataTransfer.setDragImage(dragImg, 0, 0);
//   }


//   return (
//     <SPortfolio>
//       <Navbar />
//       {/* <h1 onClick={_ => autenticate()}>Click to test</h1>
//         <h1 onClick={_ => post()}>Click to test 2</h1> */}
//       <SImages_Container
//         onClick={_ => { if (imgNum < images[page].image.length) showNextImage() }}
//       >
//         {images[page] &&
//           <Draggable
//             onStop={e => console.log('e:', e.target.getBoundingClientRect().x)}
//           >
//             {/* <div style={box} /> */}
//             <SImage_Container

//             >
//               <img style={box} 
//                 src="https://images.unsplash.com/photo-1574258496635-6b0acc96262d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60"
//               />
//               {/* <ImageComp
//                 src={images[page].image[0].url}
//                 num={0}
//               /> */}
//             </SImage_Container>
//           </Draggable>
//         }
//         {imgComponents}
//       </SImages_Container>
//       <ImageNav previousPage={pg.previous} nextPage={pg.next} />
//     </SPortfolio>
//   );
// }

            // let arr = newImgWidths.slice();
            // let containsWidth = false;
            // for (let i = 0; i < arr.length; i++) {
            //   if (arr[i].screenWidth === window.innerWidth) {
            //     console.log('REPLACE WIDTH');
            //     arr[i].width = ref.style.width.slice(0, -1);
            //     containsWidth = true;
            //     setNewImgWidths(arr);
            //     break;
            //   }
            // }
            // if (!containsWidth) {
            //   console.log('ADD WIDTH');
            //   setNewImgWidths(newImgWidths => [...newImgWidths,
            //   { id: image.id, screenWidth: window.innerWidth, width: ref.style.width.slice(0, -1) }])
            // }
