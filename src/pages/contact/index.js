import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from '../../components/navbar'
import img from '../../imgs/contact-img.jpg';


const SContact = styled.div`
  height: 100vh;
  overflow: hidden;
`

const SImage_Container = styled.div`
  display: inline-block;
  position: relative;
  top: 23vh;
  left: 20%;
`

const SImage = styled.img`
  width: 512px; /* w and h from original scale of image */
  height: 461px;
  opacity: ${props => props.animateIn ? 1 : 0};
  transition: opacity .2s;
`

const SEmail = styled.p`
  position: absolute;
  top: -14px;
  right: -120px;
  font-family: 'Roboto', sans-serif;
  font-size: 22px;
  letter-spacing: 1.1px;
`

const SInsta_Link = styled.a`
  opacity: ${props => props.animateIn ? 1 : 0};
  transition: opacity .2s;
`

const SInsta_Img = styled.img`
  position: absolute;
  top: 70px;
  right: -30px;
  width: 50px;
`

export default function Contact() {

  const [animateIn, setAnimateIn] = useState(false);

  return (
    <SContact>
      <Navbar />
      <SImage_Container>
        <SImage
          src={img}
          animateIn={animateIn}
          onLoad={_ => setAnimateIn(!animateIn)}
        />
        <SEmail>amy@amyrodriguez.co.uk</SEmail>
        <SInsta_Link href="https://www.instagram.com/amyrodriguezjewellery/"
          animateIn={animateIn}
          target="__blank"
        >
          <SInsta_Img src={require("../../imgs/IG_Glyph_Fill.png")} />
        </SInsta_Link>
      </SImage_Container>

      {/* <img src={require("../../imgs/contact-img.jpg")} alt="jewellery" /> */}
    </SContact>
  );
}