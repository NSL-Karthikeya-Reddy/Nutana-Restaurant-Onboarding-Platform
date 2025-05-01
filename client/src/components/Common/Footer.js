import React from 'react';
import { FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          Nutana Restaurant Onboarding Platform &copy; {new Date().getFullYear()} All rights reserved - Crafted with{' '}
          <FaHeart style={{ color: 'red' }} /> for Food Delivery
        </p>
      </div>
    </footer>
  );
};

export default Footer;