import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from "@fortawesome/free-solid-svg-icons";


const SInfo = styled.div`
  position: absolute;
  top: -20px;
  /* left: 5px; */
  height: 20px;
  padding: 4px;
  z-index: 10;
  cursor: pointer;
  display: flex;
  align-items: center;
  background-color: white;
  /* border: 1px solid black; */
`

const SSelect = styled.select`
  border: none;
  margin-right: 10px;
  cursor: inherit;
`

export default function ImageComp({ values, numImgs, num, src, index, windowSize, updateImgValues, updateImgNum, deleteImage, updateUnsavedChange, updateNumError }) {

  const [state, setState] = useState({ x: 10, y: 10, width: '30%' });
  const [options, setOptions] = useState([]);
  const [imgNum, setImgNum] = useState();


  const percentToPx = (percent, dimension) => {
    return dimension === 'x' ?
      (percent * windowSize.width) / 100 :
      (percent * windowSize.height) / 100;
  }

  const pxToPercent = (num, dimension) => {
    return dimension === 'x' ?
      (num / windowSize.width) * 100 :
      (num / windowSize.height) * 100;
  }

  useEffect(_ => {
    setState({ 
      x: percentToPx(values.position.x, 'x'), 
      y: percentToPx(values.position.y, 'y'), 
      width: `${values.width}%` 
    });
  }, [values]);

  useEffect(_ => {
    setImgNum(num);
  }, [num]);

  useEffect(_ => { // SET UP OPTIONS FOR ORDER SELECT
    const arr = [];
    for (let i = 0; i < numImgs; i++) {
      arr.push(<option value={i + 1} key={i}>{i + 1}</option>)
    }
    setOptions(arr);
  }, [numImgs]);


  return (
    <Rnd
      // style={{ border: '1px solid green' }}
      lockAspectRatio={true}
      // enableResizing={{ bottomLeft: true, bottomRight: true }}
      size={{ width: state.width }}
      position={{ x: state.x, y: state.y }}
      onDragStop={(e, d) => {
        // console.log('ONDRAGSTOP:', d.x, d.y);
        setState({ ...state, x: d.x, y: d.y });
        updateImgValues(pxToPercent(d.x, 'x'), pxToPercent(d.y, 'y'));
        updateUnsavedChange();
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        // console.log('ONRESIZESTOP:', position.x, position.y);
        // console.log('ONWIDTHCHANGE:', ref.style.width);
        setState({
          width: ref.style.width,
          ...position
        });
        updateImgValues(pxToPercent(position.x, 'x'), pxToPercent(position.y, 'y'), Number(ref.style.width.slice(0, -1)));
        updateUnsavedChange();
      }}
    >
      <div style={{ position: 'relative' }}>
        <img style={{ pointerEvents: 'none', width: '100%', height: '100%' }} src={src} />
        <SInfo>
          <SSelect value={imgNum}
            onChange={e => { setImgNum(e.target.value); updateImgNum(Number(e.target.value)); updateUnsavedChange(true); }}
            onClick={_ => updateNumError()}
          >
            {options}
          </SSelect>
          <FontAwesomeIcon icon={faTrash}
            onClick={_ => deleteImage(index)}
          />
        </SInfo>
      </div>
    </Rnd>
  )
}


//____NOTES__________________
{/*
- react-rnd position doesn't take percentages. To make imgs responsive as poss, necesseary to store pos values as %. So, pos values must be converted from and to % when passing to react-rnd and uploading to Strapi respectively.
*/}