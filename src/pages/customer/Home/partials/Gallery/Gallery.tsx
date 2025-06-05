import React, { useState } from 'react';
import GalleryImg1 from "@/assets/cup32.jpg";
import GalleryImg3 from "@/assets/bread9.jpg";
import GalleryImg2 from "@/assets/cup21.jpg";
import GalleryImg5 from "@/assets/cup15.jpg";
import GalleryImg6 from "@/assets/cup29.jpg";
import Lightbox from 'yet-another-react-lightbox'; // Import đúng thư viện Lightbox

import './Gallery.scss';

const Gallery = () => {
  // Thông tin hình ảnh liên quan đến thức uống, đồ ăn
  const images = [
    {
      src: GalleryImg1,
      desc: "Trà sữa trân châu thơm béo",
      sub: "Trà Sữa Trân Châu"
    },
    {
      src: GalleryImg3,
      desc: "Bánh socola mềm mịn",
      sub: "Bánh Socola"
    },
    {
      src: GalleryImg5,
      desc: "Sinh tố dâu tươi mát",
      sub: "Sinh Tố Dâu"
    },
    {
      src: GalleryImg6,
      desc: "Trà đào cam sả thanh mát",
      sub: "Trà Đào Cam Sả"
    },
  ];

  const settings = {
    columnCount: {
      default: 3,
      mobile: 2,
      tab: 3,
    },
    mode: "dark",
    enableZoom: false,
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="gallery">
        {images.map((image, index) => (
          <div key={index} className="gallery-item">
            <img
              src={image.src}
              alt={image.desc || 'Gallery Image'}
              onClick={() => setIsOpen(true)}
            />
          </div>
        ))}
      </div>

      <Lightbox
        slides={images}
        open={isOpen}
        close={() => setIsOpen(false)}
      />
    </div>
  );
};

export default Gallery;
