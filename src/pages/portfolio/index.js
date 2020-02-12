import React, { useState, useEffect } from 'react';
import { Route, Switch, useRouteMatch, Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faSave, faPlus } from "@fortawesome/free-solid-svg-icons";
import Slide from './slide';
import { Global } from '../../environment/global';
import Screen from '../../components/screens';

const SSlide_Container = styled.div`
  position: relative;
  width: 100%;
  height: ${props => `${props.height}px`};
  overflow: hidden;
  border: 2px solid black;
`

const SPageControl = styled.div`
  position: absolute;
  top: -36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-family: 'Roboto', sans-serif;
  padding-left: 10px;
  padding-right: 10px;
`

const SSelect = styled.select`
  border: none;
  cursor: pointer;
  font-size: 24px;
`

const Portfolio = ({ jwtToken }) => {

  const [slideData, setSlideData] = useState([]);
  const [imgElements, setImgElements] = useState([]);
  const [nums, setNums] = useState([]);
  const [screen, setScreen] = useState(null);
  const [reset, setReset] = useState(false);
  const [ignoreChanges, setIgnore] = useState(false);


  let { path, url } = useRouteMatch();
  const { strapiURL } = Global;
  const authHeader = { headers: { Authorization: `Bearer ${jwtToken}` } };

  const apiCall = {
    get: contentType => axios.get(`${strapiURL}/${contentType}`),
    post: (contentType, data) => axios.post(`${strapiURL}/${contentType}`, data, authHeader),
    put: (contentType, data, id) => axios.put(`${strapiURL}/${contentType}/${id}`, data, authHeader),
    del: (contentType, id) => axios.delete(`${strapiURL}/${contentType}/${id}`, authHeader)
  };

  const { get, post, put, del } = apiCall;

  //________________________________________________________________________________
  // PULL DATA FROM STRAPI CMS AND COLLATE

  useEffect(_ => {

    let slides;

    get('slides')
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

        let numArr = [];
        slides.forEach((slide, i) => {
          numArr.push(i + 1);
        });
        setNums(numArr);

        get('images')
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

            slides.sort((a, b) => a.num - b.num);
            setSlideData(slides);
          })
      })
  }, [reset]);


  //________________________________________________________________________________
  // CREATE ELEMENTS

  useEffect(_ => {
    if (slideData[0]) {

      console.log('slideData:', slideData)

      const slideImgs = [];

      const getIndexOfPropertyForScreenWidth = (img, property) => {
        const values = img[property].map(size => size.screen);
        const valuesSorted = img[property].map(size => size.screen).sort((a, b) => a - b);
        for (let i = 0; i < valuesSorted.length; i++) {
          if (1920 <= valuesSorted[i] || !valuesSorted[i + 1]) return values.indexOf(valuesSorted[i]);
        }
      }

      slideData.forEach((slide, i) => {
        const imgs = slide.imgs.map((image, j) => {

          const mqWidthsWidthIndex = getIndexOfPropertyForScreenWidth(image, 'widths');
          const mqPositionsWidthIndex = getIndexOfPropertyForScreenWidth(image, 'positions');

          return (
            <img src={image.url}
              // <img src={strapiURL.image.url}
              style={{
                position: 'absolute',
                width: image.widths[0] ? `${image.widths[mqWidthsWidthIndex].width}%` : '30%',
                top: image.positions[0] ? `${image.positions[mqPositionsWidthIndex].y}%` : '30%',
                left: image.positions[0] ? `${image.positions[mqPositionsWidthIndex].x}%` : '30%'
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


  //________________________________________________________________________________
  // HANDLE DATA CHANGE & UPLOADS


  const updateNums = (index, value) => {
    setNums(nums => {
      const arr = [...nums];
      arr[index] = Number(value);

      return arr;
    })
  }

  const checkNumError = _ => {
    const arr = [...nums].sort();

    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        return true;
      }
    }
    return false;
  }

  const handleSave = _ => {
    if (checkNumError()) {
      setScreen('numError');
    } else {
      uploadNums();
    }
  }

  const uploadNums = _ => {
    const promises = [];

    nums.forEach((num, i) => {
      if (num !== i + 1) {
        let promise = put('slides', { num: num }, slideData[i].id);
        promises.push(promise);
      }
    });

    if (promises[0]) {
      setScreen('upload');
      Promise.all(promises)
        .then(_ => {
          setScreen('success');
          setTimeout(() => {
            setScreen(null);
          }, 1000);
          setReset(!reset);
        })
        .catch(_ => {
          setScreen('uploadError');
        });
    }
  }

  const checkForChange = _ => {
    for (let i = 0; i < nums.length; i++) {
      if (nums[i] !== i + 1) return true;
    }
    return false;
  }

  const addPage = _ => {
    if (checkForChange() && !ignoreChanges) setScreen('unsaved')
    else {
      setScreen('upload');
      post('slides', { num: slideData.length + 1 })
        .then(_ => {
          setScreen('success');
          setTimeout(() => {
            setScreen(null);
          }, 1000);
          setIgnore(false);
          setReset(!reset);
        })
        .catch(_ => {
          setScreen('uploadError');
        });
    }
  }

  const deletePage = index => {
    if (checkForChange() && !ignoreChanges) setScreen('unsaved')
    else {
      setScreen('upload');
      const promises = [];

      slideData[index].imgs.forEach(img => {
        const widthPromises = img.widths.map(width =>
          del('widths', width.id)
        );
        promises.push(widthPromises);

        const positionPromises = img.positions.map(position =>
          del('positions', position.id)
        );
        promises.push(positionPromises);

        const imgPromise = del('images', img.id);
        promises.push(imgPromise);
      });

      promises.push(del('slides', slideData[index].id));

      Promise.all(promises)
        .then(_ => {
          setScreen('success');
          setTimeout(() => {
            setScreen(null);
          }, 1000);
          setIgnore(false);
          setReset(!reset);
        })
        .catch(_ => {
          setScreen('uploadError');
        });
    }
  }




  return (
    <div>
      <Switch>
        <Route exact path={path}>
          <div style={{ backgroundColor: 'white', paddingTop: '100px' }}>
            {screen &&
              <Screen message={screen} closeScreen={_ => setScreen(null)} ignoreChanges={_ => setIgnore(true)} />
            }
            <div style={{ position: 'fixed', top: '20px', left: '20px' }}>
              <FontAwesomeIcon icon={faPlus} style={{ fontSize: '30px', cursor: 'pointer' }} onClick={_ => addPage()} />
              <p style={{ marginTop: '8px' }} >Add Page</p>
            </div>
            <div style={{ position: 'fixed', right: '20px', top: '20px', textAlign: 'right' }}>
              <FontAwesomeIcon icon={faSave}
                style={{ fontSize: '30px', cursor: 'pointer' }}
                onClick={_ => handleSave()}
              />
              <p style={{ marginTop: '8px' }}>(save after <br /> changing <br /> slide order)</p>
            </div>
            {
              slideData[0] &&
              slideData.map((slide, i) =>
                <div style={{ position: 'relative', width: '60%', paddingBottom: '100px', margin: '0 auto' }} key={i}>
                  <SPageControl>
                    <SSelect value={nums[i]}
                      onChange={e => updateNums(i, e.target.value)}
                      onClick={_ => setScreen(null)}
                    >
                      {slideData.map((slide, i) =>
                        <option value={i + 1} key={i}>{i + 1}</option>
                      )}
                    </SSelect>
                    <FontAwesomeIcon icon={faTrash}
                      style={{ fontSize: '20px', cursor: 'pointer' }}
                      onClick={_ => deletePage(i)}
                    />
                  </SPageControl>
                  <Link to={`${url}/${i}`} key={i}>
                    <SSlide_Container height={(window.innerWidth * 0.6) * 1200 / 1920} key={i} >
                      {imgElements[i]}
                    </SSlide_Container>
                  </Link>
                </div>
              )
            }
          </div>
        </Route>
        {slideData &&
          <Route path={`${path}/:slideId`}
            render={_ => <Slide slideData={slideData} triggerReset={_ => setReset(!reset)} reset={reset} apiCall={apiCall} jwtToken={jwtToken} />}
          />
        }
      </Switch>
    </div>
  );
}

export default Portfolio;