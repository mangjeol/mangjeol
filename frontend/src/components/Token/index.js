import React from 'react';

import './style.scss';

const TokenDescription = props => {
  const { title, amount, name } = props;
  return (
    <div className='token__description'>
      <span>{title}</span>
      <b>
        {amount} {name}
      </b>
    </div>
  );
};

export const Token = props => {
  const { name, available, sold } = props;
  return (
    <div className='token'>
      <TokenDescription
        name={name}
        title={`Total ${name} Available`}
        amount={available}
      ></TokenDescription>
      <TokenDescription
        name={name}
        title={`${name} Sold`}
        amount={sold}
      ></TokenDescription>
    </div>
  );
};
