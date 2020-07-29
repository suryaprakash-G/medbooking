import React from 'react';
import './style/App.css';
import Main from './pages/main';
import Appointment from './pages/appointment';
import {  Route } from 'react-router-dom';
const App=() =>(
    <div className="App">
      <Route exact path="/" component={Main}  />
      <Route exact path="/book" component={Appointment}/>
    </div>
  );

export default App;
