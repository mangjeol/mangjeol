import React from 'react';
import './style.scss';
export const Wallet = props => {
  const { wallet_image, title, onClick } = props;
  return (
    <div className='wallet' onClick={onClick}>
      <img src={wallet_image} />
      <span>{title}</span>
    </div>
  );
};
