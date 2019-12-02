import React, { memo, useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import styled from 'styled-components';


const SImage = styled.img`

`;

// class ImageComp extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       width: 200,
//       height: 200,
//       x: 10,
//       y: 10
//     };
//   }

//   render() {
//     return (
//       <Rnd
//         size={{ width: this.state.width, height: this.state.height }}
//         position={{ x: this.state.x, y: this.state.y }}
//         onDragStop={(e, d) => {
//           this.setState({ x: d.x, y: d.y });
//         }}
//         onResizeStop={(e, direction, ref, delta, position) => {
//           this.setState({
//             width: ref.style.width,
//             height: ref.style.height,
//             ...position
//           });
//         }}
//       >
//         <img style={{ pointerEvents: 'none', width: '100%' }} src={'https://images.unsplash.com/photo-1574969970937-a90cdcbeea2e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60'}></img>
//       </Rnd>
//     );
//   }
// }

// export default ImageComp;

export default function ImageComp({ x, y, w, src, percentToPx, updateImgValues }) {

  const [state, setState] = useState({ x: x, y: y, width: w });

  useEffect(_ => {
    setState({ x: x, y: y, width: w })
  }, [x, y, w])

  const pxToPercent = (num, dimension) => {
    return dimension === 'x' ?
      (num / window.innerWidth) * 100 :
      (num / window.innerHeight) * 100;
  }

  return (
    <Rnd
      style={{border: '1px solid green'}}
      lockAspectRatio={true}
      enableResizing={{ bottomLeft: true, bottomRight: true }}
      size={{ width: state.width }}
      position={{ x: state.x, y: state.y }}
      onDragStop={(e, d) => {
        setState({ ...state, x: d.x, y: d.y });
        updateImgValues(pxToPercent(d.x, 'x'), pxToPercent(d.y, 'y'), Number(state.width.slice(0, -1)));
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setState({
          width: ref.style.width,
          ...position
        });
        updateImgValues(pxToPercent(state.x, 'x'), pxToPercent(state.y, 'y'), Number(ref.style.width.slice(0, -1)));
      }}
    >
      <img style={{ pointerEvents: 'none', width: '100%', height: '100%' }} src={src} />
    </Rnd>
  )
}



