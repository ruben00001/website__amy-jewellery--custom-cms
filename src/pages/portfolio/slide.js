import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import OutsideClickHandler from 'react-outside-click-handler';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faSave, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import Navbar from '../../components/navbar'
import ImageNav from './imagenav';
import ImageComp from './imagecomp';


const SPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`

const SSlideControl = styled.div`
  display: flex;
  justify-content: space-around;
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: white;
  border-bottom: 1px solid #d9d9d9;
  font-family: 'Roboto', sans-serif;
  /* border: 1px solid yellow; */
`

const SDeviceLabel = styled.label`
  margin-right: 10px;
  font-weight: 500;
`

const SSelect = styled.select`
  padding: 2px 4px;
  outline: none;
`

const SImageInput = styled.input`
	width: 0.1px;
	height: 0.1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	z-index: -1;
`

const SImageLabel = styled.label`
  font-weight: 500;
  cursor: pointer;
  /* border: 1px solid black; */
  /* padding: 3px 8px; */
`

const SImageSubmit = styled.input`
  margin-left: 20px;
  background-color: white;
  border: 1px solid black;
  border-radius: 2px;
  padding: 4px 6px;
  font-weight: bold;
  cursor: pointer;
`

const SIconContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  p {
    font-weight: 500;
    margin-right: 10px;
  }
`

const SSaveWarningContainer = styled.div`
  position: absolute;
  bottom: -120px;
  left: -1px;
  /* right: 20px; */
  z-index: 10;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
  border: 1px solid #D93025;
  font-family: 'Roboto', sans-serif;
  font-size: 13px;
  padding: 8px 15px;
  border-radius: 3px;
`

const SWarningButtonContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  margin-top: 70px;
`

const SWarningButton = styled.button`
  background-color: #89D4F7;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 3px;
  font-size: 15px;
`

const SLinkContainer = SWarningButton;

const SSaveWarningMessage = styled.p`
  text-align: center;
`

const SSlideContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: #f9f9f9;
  /* border: 1px solid yellow; */
`

const SSlide = styled.div`
  position: relative;
  width: ${props => `${props.width}px`};
  height: ${props => `${props.height}px`};
  /* max-width: 95%;
  max-height: 95%; */
  margin: 0 auto;
  /* overflow: hidden; */
  background-color: white;
  border: 1px solid #e6e6e6;
`

const SImagesContainer = styled.div`
  height: 100%;
  /* border: 2px solid blue; */
`

const SReminderScreen = styled.div`
  z-index: 10;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: rgba(146,147,148, 0.6);
`

const SReminderBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  height: 200px;
  text-align: center;
  background-color: white;
  border-radius: 5px;

  & p {
    font-family: 'Roboto', sans-serif;
    font-size: 23px;
    color: #5C5C5C;
    margin-top: 30px;
  }
`





function Slide({ slideData, setToggle, toggle }) {

  const [windowSize, setWindowSize] = useState({ width: null, height: null });
  const [device, setDevice] = useState({ width: 1920, height: 1600 });
  const [imgsValues, setImgsValues] = useState([]);
  const [imgElements, setImgElements] = useState([]);
  const [elementsDone, setElementsDone] = useState(false); // prevents re-triggering of creation of image elements on imgsValue change
  const [unsavedChange, setUnsavedChange] = useState(false);
  const [remind, setRemind] = useState(false);
  const [numError, setNumError] = useState(false);
  const [file, setFile] = useState(null);
  const [pg, setPg] = useState({});
  const [activeLink, setActiveLink] = useState(null);


  const pgCurrent = Number(useParams().slideId);
  const pgImgs = slideData[pgCurrent].imgs;

  useEffect(_ => {
    console.log('slideData[pgCurrent]:', slideData[pgCurrent])
  }, [slideData]);

  useEffect(_ => {
    const width = window.innerWidth * .95 - 2;
    const height = (width + 2) * (device.height / device.width) - 2;

    setWindowSize({ width: width, height: height });
  }, [slideData]);

  useEffect(_ => {
    console.log('windowSize:', windowSize)
  }, [windowSize]);

  // *** mq may be wrong way around.


  //________________________________________________________________________________
  // CREATE IMAGES AND PASS IN DATA

  useEffect(_ => { // SET IMG DEFAULT VALUES
    if (windowSize.width) {
      console.log('IMG DEFAULT VALUES SET. PG IMGS:', pgImgs)
      const getIndexOfPropertyForScreenWidth = (img, property) => {
        const values = img[property].map(size => size.screen);
        const valuesSorted = img[property].map(size => size.screen).sort((a, b) => b - a);
        for (let i = 0; i < valuesSorted.length; i++) {
          if (device.width >= valuesSorted[i] || !valuesSorted[i + 1]) return values.indexOf(valuesSorted[i]) // *** double-check this works
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
    }
  }, [windowSize]);

  useEffect(_ => { // CREATE IMG ELEMENTS
    if (imgsValues[0] && !elementsDone) {
      console.log('CREATE IMG ELEMENTS. IMGS VALUES:', imgsValues);

      const percentToPx = (percent, dimension) => {
        return dimension === 'x' ?
          (percent * windowSize.width) / 100 :
          (percent * windowSize.height) / 100;
      }

      const imgs = pgImgs.map((img, i) => {

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

        const updateUnsavedChange = _ => {
          setUnsavedChange(!unsavedChange);
        }

        const updateNumError = _ => {
          setNumError(false);
        }

        return (
          <ImageComp
            x={percentToPx(imgsValues[i].position.x, 'x')}
            y={percentToPx(imgsValues[i].position.y, 'y')}
            w={`${imgsValues[i].width}%`}
            numImgs={pgImgs.length}
            num={img.num}
            src={`http://localhost:1337${img.url}`}
            index={i}
            windowSize={windowSize}
            updateImgValues={updateImgValues}
            updateImgNum={updateImgNum}
            deleteImage={deleteImage}
            updateUnsavedChange={updateUnsavedChange}
            updateNumError={updateNumError}
            key={i}
          />
        )
      });

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
          if (arr[i] === device.width) id = img[property][i].id;
        }

        if (id) {
          promise = axios.put(`http://localhost:1337/${property}/${id}`,
            property === 'widths' ?
              { screenwidth: device.width, width: imgsValues[i].width } :
              { screenwidth: device.width, x: imgsValues[i].position.x, y: imgsValues[i].position.y }
          )
        } else {
          promise = axios.post(`http://localhost:1337/${property}`,
            property === 'widths' ?
              { screenwidth: device.width, width: imgsValues[i].width, image: img.id } :
              { screenwidth: device.width, x: imgsValues[i].position.x, y: imgsValues[i].position.y, image: img.id }
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

  const handleSave = _ => {
    const nums = imgsValues.map(img => img.num).sort();

    for (let i = 0; i < nums.length - 1; i++) {
      if (nums[i] === nums[i + 1]) {
        setNumError(true);
        return;
      }
    }
    uploadPropertyValues();
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

  const remindToSave = (page) => {

    if (unsavedChange) {
      page === 'previous' ? setActiveLink(pg.previous) : setActiveLink(pg.next);
      setRemind(true);
    }
  }

  useEffect(_ => {
    console.log('remind:', remind)
  }, [remind])


  const test = () => {

  }

  return (
    <SPageContainer>
      <SSlideControl>
        <div>
          <SDeviceLabel htmlFor="device">Device:</SDeviceLabel>
          <SSelect id="device">
            <option>24"</option>
            <option>22"</option>
            <option>20"</option>
            <option>19"</option>
            <option>15"</option>
          </SSelect>
          {/* <SDeviceButton>Fit to page</SDeviceButton>
          <SDeviceButton>To scale</SDeviceButton> */}
        </div>
        <div>
          <form id='form' onSubmit={e => uploadImage(e)} style={{ position: "relative" }}>
            {/* <div style={{ position: "absolute", left: "-94px" }}>
              <label htmlFor="upload" style={{ marginRight: "15px" }}>Add Image:</label>
              <FontAwesomeIcon icon={faUpload} id="upload" />
            </div> */}
            <SImageInput type="file" name="files" id="file"
              // onChange={e => console.log(e.target.value.match(/[^/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/g))}
              onChange={e => setFile(e.target.value.match(/[^/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/g))}
            />
            <SImageLabel htmlFor="file">
              {file ? file[0] : <><FontAwesomeIcon icon={faUpload} id="upload" style={{ marginRight: '8px' }} /> Add Image</>}
            </SImageLabel>
            {file ? <SImageSubmit type="submit" value="Submit" /> : null}
          </form>
        </div>
        <SIconContainer>
          <p>Save changes</p>
          <FontAwesomeIcon icon={faSave} id="save"
            style={{ fontSize: '25px', cursor: 'pointer' }}
            onClick={_ => handleSave()}
          />
          {numError &&
            <OutsideClickHandler
              onOutsideClick={_ => setNumError(false)}
            >
              <SSaveWarningContainer>
                <FontAwesomeIcon icon={faTimesCircle}
                  style={{ color: 'red', fontSize: '25px', marginTop: '15px', marginBottom: '20px' }}
                />
                <SSaveWarningMessage>Image number error. Make sure no 2 are identical.</SSaveWarningMessage>
              </SSaveWarningContainer>
            </OutsideClickHandler>
          }
        </SIconContainer>
      </SSlideControl>
      <SSlideContainer>
        <SSlide width={windowSize.width} height={windowSize.height}>
          <Navbar />
          {/* <h1 style={{ zIndex: 100 }} onClick={_ => test()}>Test</h1> */}
          <SImagesContainer>
            {imgElements}
          </SImagesContainer>
          {/* <FontAwesomeIcon icon={faUpload}
        style={{ zIndex: 2, position: 'fixed', bottom: '50px', right: '20px', cursor: 'pointer' }}
      > */}

          {/* </FontAwesomeIcon> */}

          {remind &&
            <SReminderScreen>
              <OutsideClickHandler
                onOutsideClick={_ => setRemind(false)}
              >
                <SReminderBox>
                  <p>There are unsaved changes!</p>
                  <SWarningButtonContainer>
                    <SLinkContainer>
                      <Link to={`/portfolio/${activeLink}`}
                        onClick={_ => setRemind(false)}
                      >
                        I don't care, proceed!
                      </Link>
                    </SLinkContainer>
                    <SWarningButton onClick={_ => uploadPropertyValues()}>Save</SWarningButton>
                  </SWarningButtonContainer>
                </SReminderBox>
              </OutsideClickHandler>
            </SReminderScreen>
          }
          {pg.next && // -> prevent unneccesary render
            <ImageNav previousPage={pg.previous} nextPage={pg.next} unsavedChange={unsavedChange} remindToSave={remindToSave} />
          }
        </SSlide>
      </SSlideContainer>
    </SPageContainer>
  )
}

export default Slide;

    // const initialNums = pgImgs.map(img => img.num);

    // let error;
// for (let i = 0; i < nums.length; i++) {
//   if (nums[i] !== initialNums[i]) error = true;
// }