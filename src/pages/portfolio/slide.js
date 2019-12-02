import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
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

function Slide({ slideData, setToggle }) {

  const [windowWidth, setWindowWidth] = useState(null);
  const [imgsValues, setImgsValues] = useState([]);
  const [imgElements, setImgElements] = useState([]);
  const [elementsDone, setElementsDone] = useState(false);
  const [pg, setPg] = useState({});
  const [numRequestsDone, setNumRequestsDone] = useState(0);


  const pgCurrent = Number(useParams().slideId);
  const pgImgs = slideData[pgCurrent].imgs;

  useEffect(_ => {
    setWindowWidth(window.innerWidth);
  }, []);


  useEffect(_ => { // SET IMG DEFAULT VALUES
    if (windowWidth) {
      console.log('pgImgs:', pgImgs)
      const getIndexOfPropertyForScreenWidth = (img, property) => {
        const values = img[property].map(size => size.screen);
        const valuesSorted = img[property].map(size => size.screen).sort((a, b) => b - a);
        for (let i = 0; i < valuesSorted.length; i++) {
          if (windowWidth >= valuesSorted[i] || !valuesSorted[i + 1]) return values.indexOf(valuesSorted[i]) // *** double-check this works
        }
      }

      pgImgs.map(img => {
        const position = {
          x: img.positions[getIndexOfPropertyForScreenWidth(img, 'positions')].x,
          y: img.positions[getIndexOfPropertyForScreenWidth(img, 'positions')].y
        };
        const width = img.widths[getIndexOfPropertyForScreenWidth(img, 'widths')].width;

        setImgsValues(imgsValues => [...imgsValues, { position: position, width: width }]);
      });
    }
  }, [windowWidth]);

  useEffect(_ => { // CREATE IMG ELEMENTS
    if (imgsValues[0] && !elementsDone) {
      console.log('CREATE IMG ELEMENTS');

      const imgs = pgImgs.map((img, i) => {

        const percentToPx = (percent, dimension) => {
          return dimension === 'x' ?
            (percent * window.innerWidth) / 100 :
            (percent * window.innerHeight) / 100;
        }

        const updateImgValues = (x, y, width) => {
          setImgsValues(imgsValues => {
            const arr = [...imgsValues];
            arr[i].position.x = x;
            arr[i].position.y = y;
            arr[i].width = width;

            return arr;
          })
        }

        return (
          <ImageComp
            x={percentToPx(imgsValues[i].position.x, 'x')}
            y={percentToPx(imgsValues[i].position.y, 'y')}
            w={`${imgsValues[i].width}%`}
            src={`http://localhost:1337${img.url}`}
            percentToPx={percentToPx}
            updateImgValues={updateImgValues}
            key={i}
          />
        )
      });

      setImgElements(imgs);
      setElementsDone(true);
    }

  }, [imgsValues]);

  const uploadPropertyValues = () => {

    pgImgs.forEach((img, i) => {

      const sendData = (property) => {
        const arr = img[property].map(width => width.screen);

        let id = 0;

        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === windowWidth) id = img[property][i].id;
        }

        if (id) { // ***** USE AXIOS ALL
          axios.put(`http://localhost:1337/${property}/${id}`,
            property === 'widths' ?
              { screenwidth: windowWidth, width: imgsValues[i].width } :
              { screenwidth: windowWidth, x: imgsValues[i].position.x, y: imgsValues[i].position.y }
          )
            .then(res => {
              console.log(res.data);
              setNumRequestsDone(numRequestsDone + 1);
            });
        } else {
          axios.post(`http://localhost:1337/${property}`,
            property === 'widths' ?
              { screenwidth: windowWidth, width: imgsValues[i].width, image: img.id } :
              { screenwidth: windowWidth, x: imgsValues[i].position.x, y: imgsValues[i].position.y, image: img.id }
          )
            .then(res => {
              console.log(res.data);
              setNumRequestsDone(numRequestsDone + 1);
            })
        }
      }

      sendData('widths');
      sendData('positions');

    });
  }


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

  useEffect(_ => {
    console.log('numRequestsDone:', numRequestsDone)
    if(numRequestsDone === pgImgs.length * 2) setToggle();
  }, [numRequestsDone])

  const test = () => {
    // window.location.reload(false)
    console.log('Test... pgImgs:', pgImgs) 
  }

  return (
    <SPortfolio>
      <Navbar />
      <h1 style={{ zIndex: 100 }} onClick={_ => test()}>Test</h1>
      <SImages_Container>
        {imgElements}
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

export default Slide;

