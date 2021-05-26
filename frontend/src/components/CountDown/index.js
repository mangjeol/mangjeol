import React from 'react';
import Timer from 'count-down-react';
import { CountdownRenderer } from './renderer';
import './style.scss';

export const CountDown = props => {
  const { date, title } = props;
  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>{title}</h2>
      <Timer date={date} renderer={CountdownRenderer} />
    </div>
  );
};
