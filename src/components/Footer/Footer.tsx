import React, { useState } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaAppStore, FaGooglePlay } from 'react-icons/fa';
import './Footer.scss'; // đã chuyển sang SCSS

const Footer = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    setVisible(scrolled > 300);
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', toggleVisible);
  }

  interface HandleClick {
    (section: string): void;
  }

  const handleClick: HandleClick = (section) => {
    console.log(`Navigating to ${section}`);
  };

  return (
    <>
      <footer className="footer">
        <div className="footer__section footer__logo-section">
          <h2 className="footer__logo">Cafe w Fen</h2>
          <p className="footer__description">
            Cafe w Fen – không gian thư giãn tuyệt vời để thưởng thức cà phê, trà sữa và những món bánh ngọt tinh tế.
          </p>
          <div className="footer__socials footer__buttons">
            <button className="footer__social footer__button"><FaGooglePlay /> PlayStore</button>
            <button className="footer__social footer__button"><FaAppStore /> AppleStore</button>
          </div>
        </div>

        <div className="footer__section">
          <h3 className="footer__title">VỀ CHÚNG TÔI</h3>
          <div className="footer__list">
            <div className="footer__item" onClick={() => handleClick('about')}>Giới thiệu</div>
            <div className="footer__item" onClick={() => handleClick('menu')}>Thực đơn</div>
            <div className="footer__item" onClick={() => handleClick('store-locator')}>Hệ thống cửa hàng</div>
            <div className="footer__item" onClick={() => handleClick('blog')}>Tin tức & Blog</div>
          </div>
        </div>

        <div className="footer__section">
          <h3 className="footer__title">HỖ TRỢ</h3>
          <div className="footer__list">
            <div className="footer__item" onClick={() => handleClick('faq')}>Câu hỏi thường gặp</div>
            <div className="footer__item" onClick={() => handleClick('delivery')}>Hướng dẫn đặt hàng</div>
            <div className="footer__item" onClick={() => handleClick('terms')}>Chính sách & Điều khoản</div>
            <div className="footer__item" onClick={() => handleClick('contact')}>Liên hệ</div>
          </div>
        </div>

        <div className="footer__section">
          <h3 className="footer__title">THÔNG TIN LIÊN HỆ</h3>
          <div className="footer__list">
            <div>Email: anhhan@gmail.com</div>
            <div>Địa chỉ: UIT, Khu phố 6, P. Linh Trung, TP. Thủ Đức, HCM</div>
          </div>
          <div className="footer__socials">
            <div className="footer__social" onClick={() => handleClick('Facebook')}><FaFacebookF /></div>
            <div className="footer__social" onClick={() => handleClick('Twitter')}><FaTwitter /></div>
            <div className="footer__social" onClick={() => handleClick('Instagram')}><FaInstagram /></div>
            <div className="footer__social" onClick={() => handleClick('LinkedIn')}><FaLinkedinIn /></div>
          </div>
        </div>
      </footer>

      <div id="back-top" onClick={scrollTop} className={visible ? 'active' : ''}>
        <i className="bi bi-arrow-up"></i>
      </div>
    </>
  );
};

export default Footer;
