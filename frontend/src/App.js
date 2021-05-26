import React, { Suspense, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import Router from './navigation/Router';

if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

const App = () => {
  const [loading, setloading] = useState(false);
  if (loading) {
    return (
      <div className='loadingdiv'>
        <i class='fa fa-spinner fa-spin'></i>
      </div>
    );
  }
  return (
    <Suspense
      fallback={
        <div className='loadingdiv'>
          <i className='fa fa-spinner fa-spin'></i>
        </div>
      }
    >
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </Suspense>
  );
};

export default App;
