import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.css';
import history from './components/history';
import { Router, Switch, Route } from 'react-router-dom';
import Main from './pages/main';
import Appointment from './pages/appointment';
//import * as serviceWorker from './serviceWorker';

ReactDOM.render(
      <Router history={history}>
      <Switch>
        <Route path="/" component={Main} exact={true} />
        <Route path="/book" component={Appointment} exact={true}/>
        </Switch>
      </Router>,
  document.getElementById('root')
);