// MailButton.tsx

import React from 'react';
import styled from 'styled-components';
import { FaEnvelope } from 'react-icons/fa';

const Button = () => {
  return (
    <StyledWrapper>
      <a href="mailto:bharathpersonalai@gmail.com" target="_blank" rel="noopener noreferrer">
        <button>
          <FaEnvelope size={18} /> 
          <span>Mail</span>
        </button>
      </a>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: absolute;
  top: 60px; /* Adjust this based on your header height */
  right: 20px; /* Adjust this to set distance from the right side */
  z-index: 1000;
  display: flex;
  justify-content: flex-end;

  button {
    background: transparent;
    position: relative;
    padding: 4px 8px; /* Adjust padding to control button size */
    display: flex;
    align-items: center;
    font-size: 14px; /* Font size of the text */
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    border: 1px solid rgb(40, 144, 241);
    border-radius: 20px;
    outline: none;
    overflow: hidden;
    color: rgb(40, 144, 241);
    transition: color 0.3s 0.1s ease-out;
    text-align: center;
  }

  button span {
    margin-left: 6px; /* Adjust space between icon and text */
  }

  button .icon {
    width: 14px;  /* Adjust icon width */
    height: 14px; /* Adjust icon height */
  }

  button::before {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    content: '';
    border-radius: 50%;
    display: block;
    width: 14em; /* Adjust the size of the circle */
    height: 14em; /* Adjust the size of the circle */
    left: -4em;
    text-align: center;
    transition: box-shadow 0.5s ease-out;
    z-index: -1;
  }

  button:hover {
    color: #fff;
    border: 1px solid rgb(40, 144, 241);
  }

  button:hover::before {
    box-shadow: inset 0 0 0 10em rgb(40, 144, 241);
  }
`;

export default Button;

