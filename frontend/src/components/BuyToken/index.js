import React from 'react';
import './style.scss';

export const BuyToken = props => {
  const {
    name,
    amount,
    tokenBalance,
    onClick,
    details,
    setDetails,
    formStatus,
  } = props;

  const handleChange = e => {
    if (e.target.value > 0) {
      setDetails(prev => ({
        ...prev,
        [e.target.name]: e.target.value,
        token_amount: e.target.value * amount,
      }));
    } else {
      setDetails(prev => ({
        ...prev,
        [e.target.name]: 0,
        token_amount: 0,
      }));
    }
  };
  return (
    <div className='buy_token'>
      <div className='buy_token__balance'>
        <span>Token Balance:</span>
        <b>
          {tokenBalance} {name}
        </b>
      </div>
      <div className='buy_token__form'>
        <div className='formitem'>
          <label>BNB Amount</label>
          <input
            name='bnb_amount'
            onChange={handleChange}
            value={details['bnb_amount'] ? details['bnb_amount'] : ''}
            placeholder='0'
          ></input>
          <span>BNB</span>
        </div>
        {!formStatus && !details['bnb_amount'] && (
          <div className='error'>
            <span>Enter BNB Amount</span>
          </div>
        )}

        <div className='formitem'>
          <label>{name} Amount</label>
          <input
            name='token_amount'
            value={details['token_amount'] ? details['token_amount'] : ''}
            onChange={handleChange}
            placeholder='0'
            disabled
          ></input>
          <span>{name}</span>
        </div>
        <div className='buy_token__form__button' onClick={onClick}>
          Buy Token
        </div>
      </div>
    </div>
  );
};
