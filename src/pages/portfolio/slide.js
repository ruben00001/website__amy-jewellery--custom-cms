import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faSave, faHome } from "@fortawesome/free-solid-svg-icons";
import { Global } from '../../environment/global';
import Navbar from '../../components/navbar'
import ImageNav from './imagenav';
import ImageComp from './imagecomp';
import Screen from '../../components/screens';


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
  padding-right: ${props => props.unsavedChange ? '114px' : '0'};
  font-weight: 500;
  cursor: ${props => props.unsavedChange ? 'pointer' : 'default'};
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
`


const Slide = ({ slideData, triggerReset, reset, apiCall, jwtToken }) => {

  const [device, setDevice] = useState({ width: 1920, height: 1200 });
  const [deviceScale, setDeviceScale] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: null, height: null });
  const [imgsValues, setImgsValues] = useState([]); // re-name this - not clear what means (values specifically for device)
  const [file, setFile] = useState(null);
  const [pg, setPg] = useState({});
  const [screen, setScreen] = useState(null);
  const [unsavedChange, setUnsavedChange] = useState(false);


  //_______________________________________________________________________________
  // SET PAGE'S PARAMETERS AND FUNCTIONS

  const pgCurrent = Number(useParams().slideId);
  const pgImgs = slideData[pgCurrent].imgs;

  const { post, put, del } = apiCall;

  const updateImgValues = (valueType, index, newValue) => {

    setImgsValues(imgsValues => {
      const arr = [...imgsValues];
      const element = arr[index];

      console.log('newValue:', newValue)

      if (valueType === 'width') {
        if (newValue.x) {
          element.position.x = newValue.x;
          element.position.change = true; // declaring a value to flag change seems more efficient than having to compare new and old values to determine if there's been a change later. BUT this doesn't allow for a change then a change back! (check imageComp)
        }
        if (newValue.y) {
          element.position.y = newValue.y;
          element.position.change = true;
        }
        element.width.width = newValue.width;
        element.width.change = true;
      }
      else if (valueType === 'position') {
        element.position.x = newValue.x;
        element.position.y = newValue.y;
        element.position.change = true;
      }
      else {
        element.num = newValue;
        element.numChange = true;
      }

      return arr;
    });

    setUnsavedChange(true);
  }


  //________________________________________________________________________________
  // CALCULATE SLIDE SIZE AND SET IMG VALUES FOR THE SELECTED DEVICE;


  // change windowSize to slideSize
  useEffect(_ => {
    if (slideData) {
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
  }, [slideData, device.width, deviceScale]);

  useEffect(_ => {
    

    const getValue = (img, property) => {
      const values = img[property].map(size => size.screen);
      const valuesSorted = img[property].map(size => size.screen).sort((a, b) => a - b);
      for (let i = 0; i < valuesSorted.length; i++) {
        if (device.width <= valuesSorted[i] || !valuesSorted[i + 1]) {
          return img[property][values.indexOf(valuesSorted[i])];
        }
      }
    }

    let values = [];

    pgImgs.forEach(img => {
      values.push({
        id: img.id,
        num: img.num,
        position: getValue(img, 'positions'),
        width: getValue(img, 'widths')
      });
    });

    setImgsValues(values);
  }, [slideData, device.width]); // adding slideData to force recreation of imgValues after new image upload. But leads to unneccessary retriggering after upload of new width and pos values


  //________________________________________________________________________________
  // HANDLE UPLOADS

  const handleReset = () => {
    setUnsavedChange(false);
    triggerReset(!reset);
  }

  const handleSave = _ => {
    const nums = imgsValues.map(img => img.num).sort();

    for (let i = 0; i < nums.length - 1; i++) {
      if (nums[i] === nums[i + 1]) {
        setScreen('numError');
        return;
      }
    }
    uploadPropertyValues();
  }

  const uploadPropertyValues = () => {
    setScreen('upload');
    const promises = [];

    imgsValues.forEach(img => {
      if (img.numChange) {
        promises.push(put('images', { num: img.num }, img.id));
      }
      if (img.position.change) {
        const newValue = { screenwidth: device.width, x: img.position.x, y: img.position.y, image: img.id };
        const promise = img.position.screen === device.width ?
          put('positions', newValue, img.position.id) :
          post('positions', newValue)
        promises.push(promise);
      }
      if (img.width.change) {
        const newValue = { screenwidth: device.width, width: img.width.width, image: img.id };
        const promise = img.width.screen === device.width ?
          put('widths', newValue, img.width.id) :
          post('widths', newValue)
        promises.push(promise);
      }
    });

    Promise.all(promises)
      .then(_ => {
        setScreen('success');
        setTimeout(() => {
          setScreen(null);
        }, 1000);
        handleReset();
      })
      .catch(_ => {
        setScreen('uploadError');
      });
  }

  const uploadImage = e => {
    e.preventDefault();
    setScreen('upload');

    const formData = new FormData(e.target);
    formData.append('ref', 'image');
    formData.append('field', 'image');

    post('images', { num: pgImgs.length + 1, slide: slideData[pgCurrent].id })
      .then(res => {
        const promises = [
          post('widths', { screenwidth: 1920, width: 30, image: res.data.id }),
          post('positions', { screenwidth: 1920, x: 30, y: 30, image: res.data.id })
        ];

        formData.append('refId', res.data.id);

        Promise.all(promises)
          .then(_ => {
            axios.post(`${Global.strapiURL}/upload`, formData, {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
                'Content-Type': 'multipart/form-data'
              }
            })
              .then(_ => {
                setScreen('success');
                setTimeout(() => {
                  setScreen(null);
                }, 1000);
                handleReset();
                setFile(null);
              })
              .catch(_ => {
                setScreen('uploadError');
              });
          });
      })
      .catch(_ => {
        setScreen('uploadError');
      });
  }

  const deleteImage = (index) => { // should trigger save warning
    setScreen('upload');
    const positionIds = pgImgs[index].positions.map(position => position.id);
    const widthIds = pgImgs[index].widths.map(width => width.id);

    const promises = [];

    positionIds.forEach(id => promises.push(del('positions', id)));
    widthIds.forEach(id => promises.push(del('widths', id)));
    promises.push(del('images', pgImgs[index].id));


    Promise.all(promises)
      .then(_ => {
        // On deletion of image, automatically set nums of remaining imgs
        const imgValuesCopy = imgsValues.slice();
        const removedNum = imgsValues[index].num;
        imgValuesCopy.splice(index, 1);

        const nums = imgValuesCopy.map(img => img.num);
        const numsSorted = nums.sort((a, b) => a - b);

        const promises = [];
        for (let i = removedNum - 1; i < numsSorted.length; i++) {
          promises.push(put('images', { num: i + 1 }, imgValuesCopy[nums.indexOf(numsSorted[i])].id));
        }

        if (promises[0]) {
          Promise.all(promises)
            .then(_ => {
              setScreen('success');
              setTimeout(() => {
                setScreen(null);
              }, 1000);
              handleReset();
            })
            .catch(_ => {
              setScreen('uploadError');
            });
        }
        else {
          setScreen('success');
          setTimeout(() => {
            setScreen(null);
          }, 1000);
          handleReset();
        }
      })
      .catch(_ => {
        setScreen('uploadError');
      });
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


  return (
    <SPageContainer scale={deviceScale}>
      {screen &&
        <Screen message={screen} closeScreen={_ => setScreen(null)} ignoreChanges={_ => setUnsavedChange(false)} />
      }
      <SSlideControl>
        <SDevice>
          <div onClick={_ => unsavedChange ? setScreen('unsaved-home') : null}>
            {
              unsavedChange ?
                <FontAwesomeIcon icon={faHome} style={{ marginRight: '130px', fontSize: '24px', color: '#FFD753', cursor: 'pointer' }} />
                :
                <Link to='/portfolio' style={{ marginRight: '130px', fontSize: '24px', color: '#FFD753' }}>
                  <FontAwesomeIcon icon={faHome} />
                </Link>
            }
          </div>
          <div style={{ position: 'relative' }} >
            <SDeviceLabel htmlFor="device"
              onClick={_ => unsavedChange ? setScreen('unsaved') : null}
              unsavedChange={unsavedChange} // prop for styled component
            >
              Device:
            </SDeviceLabel>
            <SSelect id="device"
              onChange={e => setDevice({ width: devices[e.target.value].width, height: devices[e.target.value].height })}
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
                onChange={_ => setDeviceScale(deviceScale => deviceScale === 0 ? 1 : 0)}
              />
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
              onClick={_ => unsavedChange ? setScreen('unsaved') : null}
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
                  numImgArr={imgsValues.map(x => 'a')}
                  src={img.url}
                  index={i}
                  windowSize={windowSize}
                  updateImgValues={updateImgValues}
                  deleteImage={deleteImage}
                  unsavedChange={unsavedChange}
                  setScreen={setScreen}
                  key={i}
                />
              )
            }
          </SImagesContainer>
          <ImageNav
            previousPage={pg.previous}
            nextPage={pg.next}
            unsavedChange={unsavedChange}
            setScreen={setScreen}
            closeScreen={_ => setScreen(null)} />
        </SSlide>
      </SSlideContainer>
    </SPageContainer >
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

  After newValues are saved, pgImgs doesn't change - switching between devices doesn't work properly
  - could have a copy of pgImgs in state
  - as well as saving, new values updates this copy
  - OR instead of having 'imgValues' (a copy in state of this page's img values), everything runs off this copy
  - OR can just have a hard 'reset' and refresh page's values with another api call after update
  - the last option leads to the issue of the device jumping back to default value after saving
  - if create new state, what happens if go to another page and then return to the current one where changes saved?
  
*/}