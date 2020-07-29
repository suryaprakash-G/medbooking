import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.css';
import App from './App';
import {  BrowserRouter, Switch } from 'react-router-dom';
//import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <App />
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
