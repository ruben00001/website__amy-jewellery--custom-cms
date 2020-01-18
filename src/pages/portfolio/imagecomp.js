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

const ImageComp = ({ values, numImgArr, src, index, windowSize, updateImgValues, deleteImage, updateNumError }) => {

  const percentToPx = (value, dimension) => {
    return dimension === 'x' ?
      (value * windowSize.width) / 100 :
      (value * windowSize.height) / 100;
  }

  const pxToPercent = (value, dimension) => {
    return dimension === 'x' ?
      (value / windowSize.width) * 100 :
      (value / windowSize.height) * 100;
  }


  return (
    <Rnd
      lockAspectRatio={true}
      size={{ width: values ? `${values.width.width}%` : 0 }}
      position={{ x: values ? percentToPx(values.position.x, 'x') : 0, y: values ? percentToPx(values.position.y, 'y') : 0 }}
      onDragStop={(e, d) => {
        console.log('drag stop..');
        let newValue = {};
        let x = pxToPercent(d.x, 'x');
        let y = pxToPercent(d.y, 'y');

        if (Math.round(values.position.x * 10) / 10 !== Math.round(x * 10) / 10) newValue.x = x; // changing select was causing a small change in position. This prevents the resulting unneccessary update of position.
        if (Math.round(values.position.y * 10) / 10 !== Math.round(y * 10) / 10) newValue.y = y;

        if (newValue.x || newValue.y) updateImgValues('position', index, newValue);
      }}
      onResizeStop={(e, direction, ref, delta, position) => { // a good example of optimisation - putting logic here so not creating any unneccesary name-value pairs in the object

        let newValue = { width: Number(ref.style.width.slice(0, -1)) }
        let x = pxToPercent(position.x, 'x');
        let y = pxToPercent(position.y, 'y');

        if (values.position.x !== x) newValue.x = x;
        if (values.position.y !== y) newValue.y = y;

        updateImgValues('width', index, newValue);
      }}
    >
      <div style={{ position: 'relative' }}>
        <img style={{ pointerEvents: 'none', width: '100%', height: '100%' }} src={src} />
        <SInfo>
          <SSelect value={ values ? values.num : 0}
            onChange={e => updateImgValues('num', index, Number(e.target.value))}
            onClick={_ => updateNumError()}
          >
            {numImgArr.map((x, i) =>
              <option value={i + 1} key={i}>{i + 1}</option>
            )}
          </SSelect>
          <FontAwesomeIcon icon={faTrash}
            onClick={_ => deleteImage(index)}
          />
        </SInfo>
      </div>
    </Rnd>
  )
}


export default ImageComp;

//____NOTES__________________
{/*
- react-rnd position doesn't take percentages. To make imgs responsive as poss, necesseary to store pos values as %. So, pos values must be converted from and to % when passing to react-rnd and uploading to Strapi respectively.

- why does a change in the 'value' prop of this component not trigger a re-rendering of the component with updated value?
- answered in 'react_child-component-props-playground' in 'experiments' folder.  

- why is imgsvalues being printed, which happens on a change in imgsvalues in slide.js, when click on select?
- isn't happening anymore, since change to receiving num value from slide.js state via props.
*/}