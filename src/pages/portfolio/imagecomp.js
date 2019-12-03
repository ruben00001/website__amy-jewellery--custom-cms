import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import styled from 'styled-components';


const SInfo = styled.div`
  position: absolute;
  top: 5px;
  left: 5px;
  z-index: 10;
  cursor: pointer;
  display: flex;
  align-items: center;
`

const SSelect = styled.select`
  border: none;
  margin-left: 10px;
  cursor: inherit;
`

export default function ImageComp({ x, y, w, numImgs, num, src, updateImgValues, updateImgNum }) {

  const [state, setState] = useState({ x: 10, y: 10, width: '30%' });
  const [options, setOptions] = useState([]);
  const [imgNum, setImgNum] = useState(num);

  useEffect(_ => {
    // console.log('IMG STATE UPDATED');
    // console.log('x:', x, 'state.x:', state.x);
    // console.log('y:', y, 'state.y:', state.y);
    console.log('num:', num)
    setState({ x: x, y: y, width: w })
  }, [x]);

  useEffect(_ => { // CREATE OPTION ELEMENTS
    const arr = [];
    for (let i = 0; i < numImgs; i++) {
      arr.push(<option value={i + 1} key={i}>{i + 1}</option>)
    }
    setOptions(arr);
  }, [numImgs]);

  const pxToPercent = (num, dimension) => {
    return dimension === 'x' ?
      (num / window.innerWidth) * 100 :
      (num / window.innerHeight) * 100;
  }


  return (
    <Rnd
      // style={{ border: '1px solid green' }}
      lockAspectRatio={true}
      // enableResizing={{ bottomLeft: true, bottomRight: true }}
      size={{ width: state.width }}
      position={{ x: state.x, y: state.y }}
      onDragStop={(e, d) => {
        // console.log('ONDRAGSTOP:', d.x);
        setState({ ...state, x: d.x, y: d.y });
        updateImgValues(pxToPercent(d.x, 'x'), pxToPercent(d.y, 'y'));
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        // console.log('ONRESIZESTOP:', position.x);
        setState({
          width: ref.style.width,
          ...position
        });
        updateImgValues(pxToPercent(position.x, 'x'), pxToPercent(position.y, 'y'), Number(ref.style.width.slice(0, -1)));
      }}
    >
      <div style={{ position: 'relative' }}>
        <img style={{ pointerEvents: 'none', width: '100%', height: '100%' }} src={src} />
        <SInfo>
          <SSelect value={imgNum} onChange={e => { setImgNum(e.target.value); updateImgNum(Number(e.target.value)) }} >
            {options}
          </SSelect>
        </SInfo>
      </div>
    </Rnd>
  )
}



