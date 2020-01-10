import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import OutsideClickHandler from 'react-outside-click-handler';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faSave, faTimesCircle, faHome } from "@fortawesome/free-solid-svg-icons";
import { Global } from '../../environment/global';
import Navbar from '../../components/navbar'
import ImageNav from './imagenav';
import ImageComp from './imagecomp';


const SPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: ${props => props.scale ? 'auto' : '100vh'};
  background-color: #f9f9f9;
`

const SSlideControl = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: white;
  border-bottom: 1px solid #d9d9d9;
  border-right: 1px solid #d9d9d9;
  font-family: 'Roboto', sans-serif;
`

const SDevice = styled.div`
  display: flex;
  align-items: center;
`

const SDeviceLabel = styled.label`
  position: absolute;
  left: -60px;
  padding-right: ${props => props.remind ? '114px' : '0'};
  font-weight: 500;
  cursor: ${props => props.remind ? 'pointer' : 'default'};
`

const SCheckBox = styled.div`
  display: flex;
  align-items: center;
  margin-left: 25px;

  p {
    margin-right: 10px;
    font-size: 15px;
  }

  div {
    position: relative;
    

    input {
      cursor: pointer;
    }

     /* label {
      position: absolute;
      left: -1px;
      top: 1px;
      width: 13px;
      height: 13px;
      cursor: pointer;
    }  */
  }
`

const SDimensions = styled.p`
  position: absolute;
  top: 2px;
  left: 6px;
  color: grey;
  font-size: 14px; 
`

const SSelect = styled.select`
  padding: 2px 4px;
  outline: none;
  cursor: pointer;
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
  cursor: pointer;
`


const SSaveWarningMessage = styled.p`
  text-align: center;
`

const SSlideContainer = styled.div`
  position: relative;
  display: ${props => props.scale ? 'block' : 'flex'};
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: ${props => props.scale ? '20px' : 0};
`

const SSlide = styled.div`
  position: relative;
  width: ${props => `${props.width}px`};
  height: ${props => `${props.height}px`};
  margin: 0 auto;
  background-color: white;
  box-sizing: content-box;
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



const Slide = ({ slideData, setToggle, toggle, apiCall, jwtToken }) => {

  const [device, setDevice] = useState({ width: 1920, height: 1200 });
  const [deviceScale, setDeviceScale] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: null, height: null });
  const [imgsValues, setImgsValues] = useState([]);
  const [unsavedChange, setUnsavedChange] = useState(false);
  const [remind, setRemind] = useState(false);
  const [numError, setNumError] = useState(false);
  const [file, setFile] = useState(null);
  const [pg, setPg] = useState({});
  const [activeLink, setActiveLink] = useState(null);
  // const [activeDevice, setActiveDevice] = useState('24"');


  //_______________________________________________________________________________
  // SET PAGE PARAMETERS AND FUNCTIONS

  const pgCurrent = Number(useParams().slideId);
  const pgImgs = slideData[pgCurrent].imgs;

  const { post, put, del } = apiCall;

  const updateNumError = _ => {
    setNumError(false);
  }

  const updateImgValues = (valueType, index, newValue) => {

    setImgsValues(imgsValues => {
      const arr = [...imgsValues];
      const element = arr[index];

      if (valueType === 'width') {
        if (newValue.x) {
          element.position.value.x = newValue.x;
          element.position.change = true;
        }
        if (newValue.y) {
          element.position.value.y = newValue.y;
          element.position.change = true;
        }
        element.width.value = newValue.width;
        element.width.change = true;
      }
      else if (valueType === 'position') {
        element.position.value.x = newValue.x;
        element.position.value.y = newValue.y;
        element.position.change = true;
      }
      else {
        element.num.value = newValue;
        element.num.change = true;
      }

      return arr;
    });

    setUnsavedChange(true);
  }


  //________________________________________________________________________________
  // CALCULATE SLIDE AND SET IMG VALUES FOR THE SELECTED DEVICE; 

  useEffect(_ => {
    if (slideData) {

      console.log('====================================');
      console.log('WINDOW SIZE USEEFFECT INVOKED');
      console.log('====================================');

      let width = window.innerWidth * .95;
      let height = (width) * (device.height / device.width);

      if (deviceScale) {
        width = device.width;
        height = device.height;
      }
      else if (height > window.innerHeight - 70 - 20) { // 70 = height of control panel; 20 = min padding desired
        height = (window.innerHeight - 70) * 0.95;
        width = (height) * (device.width / device.height);
      }
      // if doesn't fit height-wise, know it does already fit width-wise. So a reduction in width to fit height-wise will definitely fit width-wise too

      setWindowSize({ width: width, height: height });
    }
  }, [slideData, device, deviceScale]);


  useEffect(_ => {
    console.log('====================================');
    console.log('IMG VALUES USEEFFECT INVOKED');
    console.log('====================================');

    const getIndexOfPropertyForScreenWidth = (img, property) => {
      const values = img[property].map(size => size.screen);
      const valuesSorted = img[property].map(size => size.screen).sort((a, b) => a - b);
      for (let i = 0; i < valuesSorted.length; i++) {
        if (device.width <= valuesSorted[i] || !valuesSorted[i + 1]) return values.indexOf(valuesSorted[i]) // *** double-check this works for all cases
      }
    }

    let values = [];

    pgImgs.map((img, i) => {
      let position = img.positions[getIndexOfPropertyForScreenWidth(img, 'positions')];
      position = { x: position.x, y: position.y };

      const width = img.widths[getIndexOfPropertyForScreenWidth(img, 'widths')].width;

      values.push({
        position: { change: false, value: position },
        width: { change: false, value: width },
        num: { change: false, value: img.num }
      });
    });

    setImgsValues(values);
  }, [device.width]);
  // windowSize shouldn't be the second arg here as this doesn't need to be invoked when scale changes


  //________________________________________________________________________________
  // HANDLE UPLOADS

  const reset = () => {
    setUnsavedChange(false);
    setImgsValues([]);
    // setElementsDone(false);
    setToggle(!toggle);
  }

  const uploadPropertyValues = () => { // this is updating all of the page's images?? yes!!

    const promises = [];

    pgImgs.forEach((img, i) => {

      const sendData = (property) => {
        const arr = img[property].map(width => width.screen);

        let id = 0;
        let promise;

        for (let i = 0; i < arr.length; i++) { // determine whether to update existing or post new value
          if (arr[i] === device.width) id = img[property][i].id;
        }

        if (id) {
          promise = property === 'widths' ?
            put('widths', { screenwidth: device.width, width: imgsValues[i].width }, id) :
            put('positions', { screenwidth: device.width, x: imgsValues[i].position.x, y: imgsValues[i].position.y }, id)

        } else {
          promise = property === 'widths' ?
            post('widths', { screenwidth: device.width, width: imgsValues[i].width }) :
            post('positions', { screenwidth: device.width, x: imgsValues[i].position.x, y: imgsValues[i].position.y })
        }
        promises.push(promise);
      }

      sendData('widths');
      sendData('positions');

      // num value updating for each image?
      const numPromise = put('images', { num: imgsValues[i].num }, img.id);

      promises.push(numPromise);
    });

    Promise.all(promises)
      .then(axios.spread((...responses) => {
        console.log('responses:', responses);
        setRemind(false);
        reset();
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

    post('images', { num: pgImgs.length + 1, slide: slideData[pgCurrent].id })
      .then(res => {
        console.log(res);
        const promises = [];

        promises.push(
          post('widths', { screenwidth: 1920, width: 30, image: res.data.id })
        );
        promises.push(
          post('positions', { screenwidth: 1920, x: 30, y: 30, image: res.data.id })
        );

        formData.append('refId', res.data.id);

        Promise.all(promises)
          .then(axios.spread((...responses) => {
            console.log('responses:', responses);

            axios.post(`${Global.strapiURL}/upload`, formData, {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
                'Content-Type': 'multipart/form-data'
              }
            })
              .then(res => {
                console.log(res);
                reset();
              })
              .catch(err => {
                console.log(err);
              });
          }));
      })
      .catch(err => {
        console.log(err);
      });
  }

  const deleteImage = (index) => {
    const positionIds = pgImgs[index].positions.map(position => position.id);
    const widthIds = pgImgs[index].widths.map(width => width.id);

    const promises = [];

    positionIds.forEach(id => promises.push(del('positions', id)));
    widthIds.forEach(id => promises.push(del('widths', id)));
    promises.push(del('images', pgImgs[index].id));

    Promise.all(promises)
      .then(axios.spread((...responses) => {
        console.log('responses:', responses);

        // On deletion of image, automatically set nums of remaining imgs
        const nums = pgImgs.map(img => img.num);
        nums.splice(index, 1);
        const numsSorted = nums.slice().sort();
        const imgIds = pgImgs.map(img => img.id)
        imgIds.splice(index, 1);

        const imgIdsSorted = [];
        for (let i = 0; i < imgIds.length; i++) {
          imgIdsSorted.push(imgIds[nums.indexOf(numsSorted[i])]);
        }

        const promises = [];
        imgIdsSorted.forEach((id, i) => {
          promises.push(put('images', { num: i + 1 }, id));
        });

        Promise.all(promises)
          .then(axios.spread((...responses) => {
            console.log('responses:', responses);
            reset();
          }));
      }));
  }

  //________________________________________________________________________________
  // PAGE CONTROL AND NAVIGATION

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


  const devices = [
    { size: '24"', width: 1920, height: 1200 },
    { size: '22"', width: 1680, height: 1050 },
    { size: '20"', width: 1600, height: 900 },
    { size: '19"', width: 1440, height: 900 },
    { size: '15"', width: 1366, height: 768 },
    { size: '13"', width: 1280, height: 800 },
    { size: '12"', width: 1024, height: 768 },
    { size: '10"', width: 1024, height: 600 },
    { size: 'Nexus 7', width: 960, height: 600 },
    { size: 'Kindle', width: 800, height: 480 },
    // {size: 'iPad Pro', width: 1024, height: 1366 },
    { size: 'iPad', width: 768, height: 1024 },
    { size: 'iPhone Plus', width: 414, height: 736 },
    { size: 'iPhone X', width: 375, height: 812 },
    { size: 'iPhone 6/7/8', width: 375, height: 667 },
    { size: 'iPhone 5', width: 320, height: 568 },
  ];

  const updateDevice = index => {
    setImgsValues([]);
    // setElementsDone(false);
    setDevice({ width: devices[index].width, height: devices[index].height });
  }

  const updateScale = _ => {
    // setImgsValues([]);
    // setElementsDone(false);
    setDeviceScale(deviceScale => deviceScale === 0 ? 1 : 0);
  }

  const remindToSave = (link) => {

    if (unsavedChange) {
      if (link === 'previous' || link === 'next') {
        link === 'previous' ? setActiveLink(pg.previous) : setActiveLink(pg.next);
      }
      else {
        setActiveLink(link);
      }

      setRemind(true);
    }
  }


  return (
    <SPageContainer scale={deviceScale}>
      <SSlideControl>
        <SDevice>
          <Link to='/portfolio' style={{ marginRight: '130px', fontSize: '24px', color: '#FFD753' }}>
            <FontAwesomeIcon icon={faHome} />
          </Link>
          <div style={{ position: 'relative' }} >
            <SDeviceLabel htmlFor="device"
              onClick={_ => unsavedChange ? remindToSave('device') : null}
              remind={unsavedChange}
            >
              Device:
            </SDeviceLabel>
            <SSelect id="device"
              onChange={e => updateDevice(e.target.value)}
              disabled={unsavedChange ? true : false}
            >
              {devices.map((device, i) =>
                <option value={i} key={i}>{device.size}</option>
              )}
            </SSelect>
          </div>
          <SCheckBox >
            <p>To Scale</p>
            <div>
              <input type='checkbox'
              // <input type='checkbox' id='scale' value='Fit to page'
                onChange={_ => updateScale()}
                // disabled={unsavedChange ? true : false}
              />
              {/* <label htmlFor="scale"
                onClick={_ => unsavedChange ? remindToSave('scale') : null}
              /> */}
            </div>
          </SCheckBox>
        </SDevice>
        <div>
          <form id='form' onSubmit={e => uploadImage(e)} style={{ position: "relative" }}>
            <SImageInput type="file" name="files" id="file"
              onChange={e => setFile(e.target.value.match(/[^/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/g))}
              disabled={unsavedChange ? true : false}
            />
            <SImageLabel htmlFor="file"
              onClick={_ => unsavedChange ? remindToSave('device') : null}
            >
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
      <SSlideContainer scale={deviceScale}>
        <SDimensions>{`${device.width} x ${device.height}`}</SDimensions>
        <SSlide width={windowSize.width} height={windowSize.height} >
          <Navbar windowWidth={windowSize.width} scale={deviceScale} />
          <SImagesContainer>
            {
              imgsValues[0] &&
              pgImgs.map((img, i) =>
                <ImageComp
                  values={imgsValues[i]}
                  numImgArr={imgsValues.map(x_ => 'a')}
                  src={img.url}
                  index={i}
                  windowSize={windowSize}
                  updateImgValues={updateImgValues}
                  updateNumError={updateNumError}
                  deleteImage={deleteImage}
                  key={i}
                />
              )
            }
          </SImagesContainer>
          <ImageNav previousPage={pg.previous} nextPage={pg.next} unsavedChange={unsavedChange} remindToSave={remindToSave} />
        </SSlide>
      </SSlideContainer>
      {remind &&
        <SReminderScreen>
          <OutsideClickHandler
            onOutsideClick={_ => setRemind(false)}
          >
            <SReminderBox>
              <p>There are unsaved changes! You will lose them if you continue.</p>
              <SWarningButtonContainer>
                {typeof (activeLink) === 'number' &&
                  <SWarningButton>
                    <Link to={`/portfolio/${activeLink}`}
                      onClick={_ => setRemind(false)}
                    >
                      I don't care, proceed!
                    </Link>
                  </SWarningButton>
                }
                {typeof (activeLink) !== 'number' &&
                  <SWarningButton onClick={_ => { setUnsavedChange(false); setRemind(false) }}>
                    Ignore
                  </SWarningButton>
                }
                <SWarningButton onClick={_ => uploadPropertyValues()}>Save</SWarningButton>
              </SWarningButtonContainer>
            </SReminderBox>
          </OutsideClickHandler>
        </SReminderScreen>
      }
    </SPageContainer>
  )
}

export default Slide;


// NOTES
{/*
  - Need to create img components with values according to the device
  - When the device changes, these components need to be updated with the new values for the new device
  - Also potentially necessary for a change in scale

  - How would a change in scale work with the image component?
  - react-rnd component receives the css values
  - width is in % so it should update 'automatically'
  - position is in px and worked out for the actual size in px of the slide. So it needs to be worked out again
  - with scale, windowSize needs to be recalculated
  - this can trigger a re-rendering of the img components
  - (position values stored in imgValues from where data is uploaded to Strapi, is in %.)
  - a 'reset' of the page isn't necessary


  - does Link need to be surrounded by an element?
  - optimal way to prevent initial invocation of UseEffect?

  Working out how to initially display, track changes and upload these changes optimally
  - in principle, receive values for a component, these values change, and any change needs to be uploaded
  - value changes need to be tracked by storing in state
  - makes sense to have an array of initial values, an array of any new values for each img component, and then to compare the 2 to work out what to upload

  Scale
  - 
*/}