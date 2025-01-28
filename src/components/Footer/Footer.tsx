import React from 'react';
import './Footer.scss';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer__container">
                <div className="footer__copyright">
                    © 2023. All rights reserved
                </div>
                <div className="footer__contact">
                    <span className="footer__contact-text">Свяжитесь с нами</span>
                    <a href="tel:+79999999999" className="footer__phone">+7 999 999-99-99</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 