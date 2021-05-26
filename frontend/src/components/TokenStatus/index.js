import React from 'react';
import './style.scss';
import { Line } from 'rc-progress';
export const TokenStatus = props => {
  const { phase, tokenBalance, name } = props;
  return (
    <div className='token_status'>
      <div className='token_status__top'>
        <b>Phase {phase}</b>
        <span>
          1 BNB = {tokenBalance} {name}
        </span>
      </div>
      <div className='token_status__bottom'>
        <Line
          percent='40'
          strokeWidth='8'
          trailWidth='8'
          trailColor='#eee'
          strokeColor='#00BFFF'
        />
      </div>
    </div>
  );
};
