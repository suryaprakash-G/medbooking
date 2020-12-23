import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.css';
import history from './components/history';
import { Router, Switch, Route } from 'react-router-dom';
import Main from './pages/main';
import Appointment from './pages/appointment';
import Patient_Form from './pages/patient_form';
import View_Appointment from './pages/view_appointment';
import AdminLogin from './pages/adminlogin';
import AdminMain from './pages/adminmain';
//import * as serviceWorker from './serviceWorker';

ReactDOM.render(
      <Router history={history}>
      <Switch>
        <Route path="/" component={Main} exact={true} />
        <Route path="/book" component={Appointment} exact={true}/>
        <Route path="/form" component={Patient_Form} exact={true}/>
        <Route path="/appointment" component={View_Appointment} exact={true}/>
        <Route path="/admin" component={AdminLogin} exact={true}/>
        <Route path="/admin/main" component={AdminMain} exact={true}/>
        </Switch>
      </Router>,
  document.getElementById('rootc')
);