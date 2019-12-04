import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faSave } from "@fortawesome/free-solid-svg-icons";
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

function Slide({ slideData, setToggle, toggle }) {

  const [imgsValues, setImgsValues] = useState([]);
  const [imgElements, setImgElements] = useState([]);
  const [elementsDone, setElementsDone] = useState(false); // prevents re-triggering of creation of image elements on imgsValue change
  const [imgNums, setImgNums] = useState([]);
  const [unsavedChange, setUnsavedChange] = useState(false);
  const [pg, setPg] = useState({});


  const pgCurrent = Number(useParams().slideId);
  const pgImgs = slideData[pgCurrent].imgs;

  useEffect(_ => {
    console.log('slideData[pgCurrent]:', slideData[pgCurrent])
  }, [slideData]);


  //________________________________________________________________________________
  // CREATE IMAGES AND PASS IN DATA

  useEffect(_ => { // SET IMG DEFAULT VALUES
    // if (window.innerWidth) {
    console.log('IMG DEFAULT VALUES SET. PG IMGS:', pgImgs)
    const getIndexOfPropertyForScreenWidth = (img, property) => {
      const values = img[property].map(size => size.screen);
      const valuesSorted = img[property].map(size => size.screen).sort((a, b) => b - a);
      for (let i = 0; i < valuesSorted.length; i++) {
        if (window.innerWidth >= valuesSorted[i] || !valuesSorted[i + 1]) return values.indexOf(valuesSorted[i]) // *** double-check this works
      }
    }

    pgImgs.map(img => {
      const position = {
        x: img.positions[0] ? img.positions[getIndexOfPropertyForScreenWidth(img, 'positions')].x : 10,
        y: img.positions[0] ? img.positions[getIndexOfPropertyForScreenWidth(img, 'positions')].y : 10
      };
      const width = img.widths[0] ? img.widths[getIndexOfPropertyForScreenWidth(img, 'widths')].width : 30;

      setImgsValues(imgsValues => [...imgsValues, { position: position, width: width, num: img.num }]);
    });
    // }
  }, [slideData]);

  useEffect(_ => { // CREATE IMG ELEMENTS
    if (imgsValues[0] && !elementsDone) {
      console.log('CREATE IMG ELEMENTS. IMGS VALUES:', imgsValues);
      const nums = [];

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
            if (width) arr[i].width = width;

            return arr;
          });
        }

        const updateImgNum = (num) => {
          setImgsValues(imgsValues => {
            const arr = [...imgsValues];
            arr[i].num = num;

            return arr;
          });
        }

        const updateImgNums = (num) => {
          setImgNums(imgNums => {
            const arr = [...imgNums];
            arr[i] = num;

            return arr;
          })
        }

        nums.push(img.num);

        return (
          <ImageComp
            x={percentToPx(imgsValues[i].position.x, 'x')}
            y={percentToPx(imgsValues[i].position.y, 'y')}
            w={`${imgsValues[i].width}%`}
            numImgs={pgImgs.length}
            num={img.num}
            src={`http://localhost:1337${img.url}`}
            index={i}
            updateImgValues={updateImgValues}
            updateImgNum={updateImgNum}
            updateImgNums={updateImgNums}
            deleteImage={deleteImage}
            key={i}
          />
        )
      });

      setImgNums(nums);
      setImgElements(imgs);
      setElementsDone(true);
    }

  }, [imgsValues]);


  //________________________________________________________________________________
  // HANDLE API CALLS

  const reset = () => {
    setImgsValues([]);
    setElementsDone(false);
    setToggle(!toggle);
  }

  const uploadPropertyValues = () => {

    const promises = [];

    pgImgs.forEach((img, i) => {

      const sendData = (property) => {
        const arr = img[property].map(width => width.screen);

        let id = 0;
        let promise;

        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === window.innerWidth) id = img[property][i].id;
        }

        if (id) {
          promise = axios.put(`http://localhost:1337/${property}/${id}`,
            property === 'widths' ?
              { screenwidth: window.innerWidth, width: imgsValues[i].width } :
              { screenwidth: window.innerWidth, x: imgsValues[i].position.x, y: imgsValues[i].position.y }
          )
        } else {
          promise = axios.post(`http://localhost:1337/${property}`,
            property === 'widths' ?
              { screenwidth: window.innerWidth, width: imgsValues[i].width, image: img.id } :
              { screenwidth: window.innerWidth, x: imgsValues[i].position.x, y: imgsValues[i].position.y, image: img.id }
          )
        }
        promises.push(promise);
      }

      sendData('widths');
      sendData('positions');

      const numPromise = axios.put(`http://localhost:1337/images/${img.id}`, { num: imgsValues[i].num });
      promises.push(numPromise);
    });

    Promise.all(promises)
      .then(axios.spread((...responses) => {
        if (responses.length === pgImgs.length * 3) {
          reset();
        }
      }));
  }

  const uploadImage = e => {
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.append('ref', 'image');
    formData.append('field', 'image');

    axios.post("http://localhost:1337/images", { num: pgImgs.length + 1, slide: slideData[pgCurrent].id })
      .then(res => {
        console.log(res);

        formData.append('refId', res.data.id);

        axios.post(`http://localhost:1337/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
          .then(res => {
            console.log(res);
            reset();
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  }

  const deleteImage = (index) => {
    const positionIds = pgImgs[index].positions.map(position => position.id);
    const widthIds = pgImgs[index].widths.map(width => width.id);

    console.log('positionIds:', positionIds);
    console.log('widthIds:', widthIds)

    const promises = [];

    positionIds.forEach(id => {
      promises.push(axios.delete(`http://localhost:1337/positions/${id}`));
    });
    widthIds.forEach(id => {
      promises.push(axios.delete(`http://localhost:1337/widths/${id}`));
    });
    promises.push(axios.delete(`http://localhost:1337/images/${pgImgs[index].id}`));

    Promise.all(promises)
      .then(axios.spread((...responses) => {
        console.log('responses:', responses);
        const nums = pgImgs.map(img => img.num);
        nums.splice(index, 1);
        const numsSorted = nums.slice().sort();
        const imgIds = pgImgs.map(img => img.id)
        imgIds.splice(index, 1);

        const imgIdsSorted = [];
        for (let i = 0; i < imgIds.length; i++) {
          imgIdsSorted.push(imgIds[nums.indexOf(numsSorted[i])]);
        }

        console.log('imgIds:', imgIds)
        console.log('imgIdsSorted:', imgIdsSorted)

        const promises = [];
        imgIdsSorted.forEach((id, i) => {
          promises.push(axios.put(`http://localhost:1337/images/${id}`, { num: i + 1 }));
        });

        Promise.all(promises)
          .then(axios.spread((...responses) => {
            console.log('responses:', responses);
            reset();
          }));
      }));
  }

  const remindToSave = () => {
    const nums = imgsValues.map(img => img.num);
    console.log('nums:', nums)
  }

  //________________________________________________________________________________
  // NAVIGATION

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



  const test = () => {
    console.log('imgNums:', imgNums)
  }

  return (
    <SPortfolio>
      <Navbar />
      {/* <h1 style={{ zIndex: 100 }} onClick={_ => test()}>Test</h1> */}
      <SImages_Container>
        {imgElements}
      </SImages_Container>
      {pg.next && // -> prevent unneccesary render
        <ImageNav previousPage={pg.previous} nextPage={pg.next} />
      }
      {/* <FontAwesomeIcon icon={faUpload}
        style={{ zIndex: 2, position: 'fixed', bottom: '50px', right: '20px', cursor: 'pointer' }}
      > */}
      <form id='form' onSubmit={e => uploadImage(e)} style={{ zIndex: 2 }}>
        <input type="file" name="files" />
        <input type="submit" value="Submit" />
      </form>
      {/* </FontAwesomeIcon> */}
      <FontAwesomeIcon icon={faSave}
        style={{ zIndex: 2, position: 'fixed', bottom: '20px', right: '20px', cursor: 'pointer' }}
        onClick={_ => uploadPropertyValues()}
      // onClick={_ => console.log(newImgPositions)}
      />
    </SPortfolio>
  )
}

export default Slide;

