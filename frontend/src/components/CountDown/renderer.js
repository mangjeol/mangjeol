import React from 'react';
export const CountdownRenderer = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
}) => {
  return (
    <div className='renderer'>
      <div className='renderer__item'>
        <b>{days}</b>
        <span>Days</span>
      </div>
      <div className='renderer__margin'>:</div>
      <div className='renderer__item'>
        <b>{hours}</b>
        <span>Hours</span>
      </div>
      <div className='renderer__margin'>:</div>
      <div className='renderer__item'>
        <b>{minutes}</b>
        <span>Minutes</span>
      </div>
      <div className='renderer__margin'>:</div>
      <div className='renderer__item'>
        <b>{seconds}</b>
        <span>Seconds</span>
      </div>
    </div>
  );
};
